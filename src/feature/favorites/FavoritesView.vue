<script setup lang="ts">
import {useFavoritesViewModel} from "./viewmodel/useFavoritesViewModel";
import {useFavoritePokemonStore} from "@/core/store/useFavoritePokemonStore";
import PokemonGrid from "@/components/PokemonGrid.vue";
import SwipeableFavoriteCard from "./components/SwipeableFavoriteCard.vue";
import FavoritesEmptyMessage from "./components/FavoritesEmptyMessage.vue";

const {favoritePokemons, loading} = useFavoritesViewModel();
const favoriteStore = useFavoritePokemonStore();
</script>

<template>
  <div class="favorites-view">
    <h1 class="favorites-title">Favoritos</h1>

    <div v-if="loading" class="favorites-loading">
      <img src="@/assets/pokeball.svg" class="w-8 h-8 animate-spin" alt="Cargando"/>
    </div>

    <FavoritesEmptyMessage v-else-if="!favoritePokemons.length"/>

    <PokemonGrid v-else :pokemons="favoritePokemons">
      <template #default="{ pokemon }">
        <SwipeableFavoriteCard
            :pokemon="pokemon"
            @remove="favoriteStore.toggleFavorite(pokemon.name)"
        />
      </template>
    </PokemonGrid>
  </div>
</template>

<style scoped>
.favorites-view {
  padding: 24px 16px;
}

.favorites-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 24px;
  color: #1a1a1a;

  margin-bottom: 16px;
}

.favorites-loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>
