import {defineStore} from "pinia";
import {computed, ref} from "vue";
import axios from "axios";
import api from "../../../core/api/api";
import {POKEMON_ENDPOINTS} from "@/core/api/ApiEndpoints";
import {Pokemon} from "@/core/models/pokemonModel";
import {createPokemon} from "@/core/api/dto/pokemonDto";

const PAGE_SIZE = 20;

export const usePokemonStore = defineStore('pokemon', () => {
    const pokemon = ref<Pokemon | null>(null);
    const pokemonList = ref<Pokemon[]>([]);
    const loading = ref(false);
    const loadingMore = ref(false);
    const error = ref<string | null>(null);
    const notFound = ref(false);
    const notFoundMismatch = ref<{ name: string; types: string[] } | null>(null);

    const namesPool = ref<{ name: string; url: string }[]>([]);
    const selectedTypes = ref<string[]>([]);
    const offset = ref(0);
    const hasMorePages = ref(false);

    /*
     * Hay más contenido si el pool todavía tiene nombres sin hidratar,
     * o si (sin filtro activo) la API todavía tiene páginas siguientes.
     * Con un filtro de tipo activo, el pool ya vino completo de una sola
     * vez, así que no hay "próxima página" que pedir.
     */
    const hasMore = computed(() =>
        namesPool.value.length > 0 || (selectedTypes.value.length === 0 && hasMorePages.value)
    )

    function extractIdFromUrl(url: string): number {
        const segments = url.split('/').filter(Boolean)
        return Number(segments[segments.length - 1])
    }

    function handleFetchFailure(caughtError: unknown) {
        if (axios.isAxiosError(caughtError) && caughtError.response?.status === 404) {
            notFound.value = true
            return
        }
        error.value = caughtError instanceof Error ? caughtError.message : String(caughtError);
    }

    async function fetchAPokemon(pokemonName: string) {
        loading.value = true;
        error.value = null;
        notFound.value = false;

        try {
            const response = await api.get(POKEMON_ENDPOINTS.one(pokemonName))
            pokemon.value = createPokemon(response.data);

        } catch (caughtError) {
            handleFetchFailure(caughtError)
        } finally {
            loading.value = false;
        }
    }

    async function hydrateNextBatch() {
        const batch = namesPool.value.splice(0, PAGE_SIZE)

        if (batch.length === 0) return

        const settledDetails = await Promise.allSettled(
            batch.map(item => api.get(POKEMON_ENDPOINTS.one(item.name)))
        )

        const pokemons: Pokemon[] = []
        for (const result of settledDetails) {
            if (result.status === 'fulfilled') {
                pokemons.push(createPokemon(result.value.data))
            }
        }
        pokemonList.value.push(...pokemons)
    }

    async function fetchNextPage() {
        const listResponse = await api.get(POKEMON_ENDPOINTS.list, {
            params: {limit: PAGE_SIZE, offset: offset.value}
        })
        const names = listResponse.data.results as { name: string; url: string }[]

        offset.value += PAGE_SIZE
        hasMorePages.value = listResponse.data.next !== null
        namesPool.value.push(...names)
    }

    async function fetchAllPokemon() {
        loading.value = true;
        error.value = null;
        notFound.value = false;
        pokemonList.value = [];
        namesPool.value = [];
        offset.value = 0;
        selectedTypes.value = [];

        const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 1500))

        try {
            await fetchNextPage()
            await hydrateNextBatch()

            if (pokemonList.value.length === 0) notFound.value = true

        } catch (caughtError) {
            handleFetchFailure(caughtError)
        } finally {
            await minimumLoadingTime
            loading.value = false;
        }
    }

    async function filterPokemonListByTypes(typeNames: string[]) {
        loading.value = true;
        error.value = null;
        notFound.value = false;
        pokemonList.value = [];
        namesPool.value = [];
        hasMorePages.value = false;

        const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 1500))

        try {
            const settledResponses = await Promise.allSettled(
                typeNames.map(typeName => api.get(POKEMON_ENDPOINTS.pokemonListByType(typeName)))
            )

            /*
             * Filtrado aditivo (OR): un pokemon con dos tipos seleccionados
             * aparece en más de un pool, así que se deduplica por nombre.
             */
            const uniqueByName = new Map<string, { name: string; url: string }>()
            for (const result of settledResponses) {
                if (result.status !== 'fulfilled') continue

                for (const entry of result.value.data.pokemon as { pokemon: { name: string; url: string } }[]) {
                    uniqueByName.set(entry.pokemon.name, entry.pokemon)
                }
            }

            namesPool.value = Array.from(uniqueByName.values())
                .sort((a, b) => extractIdFromUrl(a.url) - extractIdFromUrl(b.url))

            await hydrateNextBatch()

            if (pokemonList.value.length === 0) notFound.value = true

        } catch (caughtError) {
            handleFetchFailure(caughtError)
        } finally {
            await minimumLoadingTime;
            loading.value = false;
        }
    }

    async function applyTypeFilters(typeNames: string[]) {
        selectedTypes.value = typeNames

        if (typeNames.length === 0) {
            await fetchAllPokemon()
            return
        }

        await filterPokemonListByTypes(typeNames)
    }

    /*
     * Único punto de entrada para el estado de la URL (q + types).
     * Con query: trae ESE pokemon (una sola consulta) y valida en memoria
     * que su tipo intersecte los tipos seleccionados (semántica AND).
     * Sin query: delega en el filtrado por tipo de siempre.
     */
    async function syncFromQuery(query: string, types: string[]) {
        selectedTypes.value = types
        notFoundMismatch.value = null

        if (!query) {
            pokemon.value = null
            await applyTypeFilters(types)
            return
        }

        /*
         * No delegamos en fetchAPokemon: esa función cierra `loading` en su
         * propio finally, y recién después podríamos detectar el desajuste
         * de tipos. Eso deja `loading=false` con `notFound` todavía sin
         * actualizar por un tick, y PokeballLoading.vue —que decide su
         * animación comparando ambos en el mismo cambio reactivo— nunca
         * llega a "notFound" (ver bug reportado). Acá resolvemos todo
         * (pokemon/notFound/notFoundMismatch) antes de soltar loading.
         */
        loading.value = true;
        error.value = null;
        notFound.value = false;

        try {
            const response = await api.get(POKEMON_ENDPOINTS.one(query))
            const fetchedPokemon = createPokemon(response.data)
            const matchesTypes = types.length === 0 || fetchedPokemon.types.some(type => types.includes(type))

            if (matchesTypes) {
                pokemon.value = fetchedPokemon
            } else {
                notFoundMismatch.value = { name: fetchedPokemon.name, types: fetchedPokemon.types }
                pokemon.value = null
                notFound.value = true
            }
        } catch (caughtError) {
            handleFetchFailure(caughtError)
        } finally {
            loading.value = false;
        }
    }

    async function loadMore() {
        if (loading.value || loadingMore.value || !hasMore.value) return

        loadingMore.value = true

        try {
            if (namesPool.value.length === 0 && selectedTypes.value.length === 0 && hasMorePages.value) {
                await fetchNextPage()
            }
            await hydrateNextBatch()

        } catch (caughtError) {
            handleFetchFailure(caughtError)
        } finally {
            loadingMore.value = false
        }
    }

    const visiblePokemonList = computed(() => pokemon.value ? [pokemon.value] : pokemonList.value)

    return {
        pokemon,
        pokemonList,
        visiblePokemonList,
        loading,
        loadingMore,
        error,
        notFound,
        notFoundMismatch,
        hasMore,
        selectedTypes,
        fetchAPokemon,
        fetchAllPokemon,
        filterPokemonListByTypes,
        applyTypeFilters,
        syncFromQuery,
        loadMore,
    }
})
