import {defineStore} from "pinia";
import {computed, ref} from "vue";
import api from "../../../core/api/api";
import {POKEMON_ENDPOINTS} from "../../../core/api/ApiEndpoints";
import {Pokemon} from "../../../core/models/pokemonModel";
import {createPokemon} from "../../../core/api/dto/pokemonDto";

export const usePokemonStore = defineStore('pokemon', () => {
    const pokemon = ref<Pokemon | null>(null);
    const pokemonList = ref<Pokemon[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchAPokemon(pokemonName: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.get(POKEMON_ENDPOINTS.one(pokemonName))
            pokemon.value = createPokemon(response.data);

        } catch (caughtError) {
            error.value = caughtError instanceof Error ? caughtError.message : String(caughtError);
        } finally {
            loading.value = false;
        }
    }

    async function findPokemon(pokemonName: string) {
        const normalizedName = pokemonName.trim().toLowerCase()
        const alreadyLoaded = pokemonList.value.find(p => p.name.toLowerCase() === normalizedName)

        if (alreadyLoaded) {
            pokemon.value = alreadyLoaded
            error.value = null
            return
        }

        await fetchAPokemon(pokemonName)
    }

    async function fetchAllPokemon() {
        loading.value = true;
        error.value = null;

        try {
            const listResponse = await api.get(POKEMON_ENDPOINTS.list)
            const names = listResponse.data.results

            const settledDetails = await Promise.allSettled(
                names.map((item: { name: string }) => api.get(POKEMON_ENDPOINTS.one(item.name)))
            )

            const pokemons: Pokemon[] = []
            for (const result of settledDetails) {
                if (result.status === 'fulfilled') {
                    pokemons.push(createPokemon(result.value.data))
                }
            }
            pokemonList.value = pokemons

        } catch (caughtError) {
            error.value = caughtError instanceof Error ? caughtError.message : String(caughtError);
        } finally {
            loading.value = false;
        }
    }

    const visiblePokemonList = computed(() => pokemon.value ? [pokemon.value] : pokemonList.value)

    return {
        pokemon,
        pokemonList,
        visiblePokemonList,
        loading,
        error,
        fetchAPokemon,
        findPokemon,
        fetchAllPokemon,
    }
})
