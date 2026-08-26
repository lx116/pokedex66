<script setup lang="ts">
import {Pokemon} from "@/core/models/pokemonModel";

defineProps<{
  pokemons: Pokemon[];
}>();
</script>

<template>
  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-4 px-4 sm:px-6">
    <slot
        v-for="pokemon in pokemons"
        :key="pokemon.id"
        :pokemon="pokemon"
    />
  </div>
</template>
