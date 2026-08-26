import {defineStore} from "pinia";
import {ref} from "vue";

const STORAGE_KEY = "pokedex66:favorites";

function loadFavoriteNames(): string[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export const useFavoritePokemonStore = defineStore("favoritePokemon", () => {
    const favoriteNames = ref<string[]>(loadFavoriteNames());

    function persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteNames.value));
    }

    function isFavorite(name: string): boolean {
        return favoriteNames.value.includes(name);
    }

    function toggleFavorite(name: string) {
        const index = favoriteNames.value.indexOf(name);

        if (index === -1) {
            favoriteNames.value.push(name);
        } else {
            favoriteNames.value.splice(index, 1);
        }

        persist();
    }

    return {favoriteNames, isFavorite, toggleFavorite};
});
