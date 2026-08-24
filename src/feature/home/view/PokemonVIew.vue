<script setup lang="ts">
import { ref } from 'vue'
import { usePokemonViewModel } from "../viewmodel/usePokemonViewModel"

const pokemonName = ref("charmander")

const {
  pokemon,
  pokemonList,
  loading,
  error,
  fetchAPokemon,
  fetchAllPokemon

} = usePokemonViewModel()

function searchPokemon() {
  fetchAPokemon(pokemonName.value)
}

function searchPokemonList() {
  fetchAllPokemon()
}

</script>

<template>
  <div class="p-6">
    <input
        v-model="pokemonName"
        type="text"
        placeholder="Nombre del Pokémon"
        class="border px-2 py-1"
    />
    <button @click="searchPokemon" class="border px-2 py-1 ml-2">
      Buscar
    </button>

    <p v-if="loading">Cargando...</p>
    <p v-else-if="error">{{ error }}</p>

    <div v-else-if="pokemon" class="mt-4">
      <h2 class="font-bold">{{ pokemon.name }} (#{{ pokemon.id }})</h2>
      <img v-if="pokemon.imageURL" :src="pokemon.imageURL" :alt="pokemon.name" />
      <p>Tipos: {{ pokemon.types.join(', ') }}</p>
      <p>Peso: {{ pokemon.weight }} · Altura: {{ pokemon.height }}</p>
    </div>

    <div class="mt-8">
      <button @click="searchPokemonList" class="border px-2 py-1">
        Cargar lista
      </button>

      <div v-if="pokemonList.length" class="mt-4 grid grid-cols-4 gap-4">
        <div v-for="p in pokemonList" :key="p.id" class="border p-2 text-center">
          <img v-if="p.imageURL" :src="p.imageURL" :alt="p.name" />
          <p class="font-bold">{{ p.name }} (#{{ p.id }})</p>
          <p>{{ p.types.join(', ') }}</p>
          <p>Peso: {{ p.weight }} · Altura: {{ p.height }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>

</style>