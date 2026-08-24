import {ref} from "vue";
import api from "../../core/api/api.js";
import {POKEMON_ENDPOINTS} from "../../core/network/ApiEndpoints.js";


export function usePokemonViewModel(){
    const pokemon = ref(null);
    const pokemonList = ref([]);
    const loading = ref(false);
    const error = ref(false);


    async function fetchAPokemon(pokemonName){
        loading.value = true;
        error.value = null;

        try {
            const response = await api.get(POKEMON_ENDPOINTS.one(pokemonName))
            pokemon.value = response.data;

        }catch(caughtError){
            error.value = caughtError.message;
        }finally{
            loading.value = false;
        }
    }

    async function fetchAllPokemon(){
        loading.value = true;
        error.value = null;

        try {
            const response = await api.get(POKEMON_ENDPOINTS.list)
            pokemonList.value = response.data.results;
        }catch(caughtError){
            error.value = caughtError.message;
        }finally{
            loading.value = false;
        }
    }

    return {
        pokemon,
        pokemonList,
        loading,
        error,
        fetchAPokemon,
        fetchAllPokemon
    }
}
