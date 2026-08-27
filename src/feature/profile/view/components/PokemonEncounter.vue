<script setup lang="ts">
import {ref, watch} from "vue";
import type {Pokemon} from "@/core/models/pokemonModel";
import PokemonCard from "@/feature/home/view/components/PokemonCard.vue";
import {getCachedPokemon} from "../../data/pokemonCache";

const props = defineProps<{
  pokemonIds: number[];
}>();

const emit = defineEmits<{
  capture: [id: number];
  skip: [];
}>();

const pokemons = ref<Pokemon[]>([]);
const loading = ref(true);

watch(
    () => props.pokemonIds,
    async (ids) => {
      loading.value = true;
      pokemons.value = await Promise.all(ids.map(getCachedPokemon));
      loading.value = false;
    },
    {immediate: true},
);
</script>

<template>
  <div class="encounter-overlay">
    <div class="encounter-panel">
      <h2 class="encounter-title">¡Pokémon salvajes!</h2>

      <p v-if="loading" class="encounter-loading">Cargando encuentro...</p>

      <div v-else class="encounter-cards">
        <PokemonCard
            v-for="p in pokemons"
            :key="p.id"
            :pokemon="p"
            :clickable="false"
            @click="emit('capture', p.id)"
        />
      </div>

      <button type="button" class="encounter-skip" @click="emit('skip')">
        Continuar sin capturar
      </button>
    </div>
  </div>
</template>

<style scoped>

.encounter-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, .45);
}

.encounter-panel {
  width: 100%;
  max-width: 360px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  padding: 24px 20px;

  border-radius: 24px;
  background: #ffffff;
}

.encounter-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

.encounter-loading {
  color: #757575;
  font-size: 14px;
}

.encounter-cards {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

.encounter-skip {
  width: 100%;
  height: 48px;

  border-radius: 100px;
  border: 1px solid #e5e7eb;
  background: transparent;

  font-weight: 600;
  color: #757575;

  cursor: pointer;
}

</style>
