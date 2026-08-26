import {ref, watch} from "vue";
import {Pokemon} from "@/core/models/pokemonModel";
import {getPokemonByName} from "@/core/api/services/pokemonService";
import {useFavoritePokemonStore} from "@/core/store/useFavoritePokemonStore";

export function useFavoritesViewModel() {
    const favoriteStore = useFavoritePokemonStore();
    const favoritePokemons = ref<Pokemon[]>([]);
    const loading = ref(false);

    async function loadFavorites() {
        loading.value = true;

        try {
            const settled = await Promise.allSettled(
                favoriteStore.favoriteNames.map(name => getPokemonByName(name))
            );

            favoritePokemons.value = settled
                .filter((result): result is PromiseFulfilledResult<Pokemon> => result.status === "fulfilled")
                .map(result => result.value);
        } finally {
            loading.value = false;
        }
    }

    watch(() => favoriteStore.favoriteNames, loadFavorites, {deep: true, immediate: true});

    return {favoritePokemons, loading};
}
