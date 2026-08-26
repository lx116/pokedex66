<script setup lang="ts">
import {computed} from "vue";
import {ArrowLeftIcon, HeartIcon as HeartOutlineIcon} from "@heroicons/vue/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/vue/24/solid";
import {useFavoritePokemonStore} from "@/core/store/useFavoritePokemonStore";

const props = defineProps<{
  pokemonName: string;
}>();

defineEmits<{
  back: [];
}>();

const favoriteStore = useFavoritePokemonStore();

const isFavorite = computed(() => favoriteStore.isFavorite(props.pokemonName));
</script>

<template>
  <div class="detail-header">
    <button
        type="button"
        class="icon-button"
        aria-label="Volver"
        @click="$emit('back')"
    >
      <ArrowLeftIcon class="icon"/>
    </button>

    <button
        type="button"
        class="icon-button"
        :class="{ 'icon-button-favorite': isFavorite }"
        :aria-label="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        @click="favoriteStore.toggleFavorite(pokemonName)"
    >
      <component :is="isFavorite ? HeartSolidIcon : HeartOutlineIcon" class="icon"/>
    </button>
  </div>
</template>

<style scoped>
.detail-header {
  position: relative;
  z-index: 2;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 16px 20px;
}

.icon-button {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  border: none;
  cursor: pointer;

  color: #fff;
}

.icon-button-favorite {
  color: #E53935;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
