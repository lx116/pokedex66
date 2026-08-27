<script setup lang="ts">
import {ref, watch} from "vue";
import type {Pokemon} from "@/core/models/pokemonModel";
import PokemonCard from "@/feature/home/view/components/PokemonCard.vue";
import PokemonGrid from "@/components/PokemonGrid.vue";
import SwipeableCard from "@/components/SwipeableCard.vue";
import {useTrainerStore} from "../../store/useTrainerStore";
import {getCachedPokemon} from "../../data/pokemonCache";

const trainerStore = useTrainerStore();
const teamPokemons = ref<Pokemon[]>([]);

watch(
    () => trainerStore.team.slice(),
    async (ids) => {
      teamPokemons.value = await Promise.all(ids.map(getCachedPokemon));
    },
    {immediate: true},
);

function release(id: number) {
  trainerStore.releasePokemon(id);
}
</script>

<template>
  <div class="team-box">
    <div class="team-header">
      <span class="team-title">Tu equipo</span>
      <span class="team-count">{{ trainerStore.team.length }}/6</span>
    </div>

    <PokemonGrid :pokemons="teamPokemons">
      <template #default="{ pokemon: p }">
        <!-- El starter no se puede liberar: sin swipe, tarjeta normal. -->
        <PokemonCard v-if="p.id === trainerStore.starterId" :pokemon="p"/>

        <SwipeableCard
            v-else
            :pokemon="p"
            delete-label="Liberar Pokémon"
            @remove="release(p.id)"
        />
      </template>
    </PokemonGrid>
  </div>
</template>

<style scoped>

.team-box {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
}

.team-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  padding: 0 4px;
}

.team-title {
  font-size: 12px;
  font-weight: 600;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: .02em;
}

.team-count {
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
}

</style>
