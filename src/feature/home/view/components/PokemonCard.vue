<script setup lang="ts">
import {Pokemon} from "../../../../core/models/pokemonModel";

defineProps<{
  pokemon: Pokemon
}>()
</script>

<template>
  <div class="border p-2 text-center grid">
    <img v-if="pokemon.imageURL" :src="pokemon.imageURL" :alt="pokemon.name" />
    <p class="font-bold">{{ pokemon.name }} (#{{ pokemon.id }})</p>
    <p>{{ pokemon.types.join(', ') }}</p>
    <p>Peso: {{ pokemon.weight }} · Altura: {{ pokemon.height }}</p>
  </div>
</template>

<style scoped>

</style>
