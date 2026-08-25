import {ref} from "vue";
import axios from "axios";
import {PokemonDetail} from "@/core/models/pokemonDetailModel";
import {getPokemonDetailByName} from "@/core/api/services/pokemonService";

export function usePokemonDetailViewModel() {
    const pokemon = ref<PokemonDetail | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const notFound = ref(false);

    async function findPokemon(name: string) {
        loading.value = true;
        error.value = null;
        notFound.value = false;
        pokemon.value = null;

        try {
            pokemon.value = await getPokemonDetailByName(name);
        } catch (caughtError) {
            if (axios.isAxiosError(caughtError) && caughtError.response?.status === 404) {
                notFound.value = true;
            } else {
                error.value = caughtError instanceof Error ? caughtError.message : String(caughtError);
            }
        } finally {
            loading.value = false;
        }
    }

    return {pokemon, loading, error, notFound, findPokemon};
}
