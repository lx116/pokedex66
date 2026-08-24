<script setup lang="ts">

import {ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {usePokemonStore} from "../../store/usePokemonStore";

const pokemonName = ref("charmander")

const store = usePokemonStore()
const { pokemon } = storeToRefs(store)
const { findPokemon } = store

function searchPokemon() {
  findPokemon(pokemonName.value)
}

watch(pokemonName, (value) => {
  if (!value.trim()) {
    pokemon.value = null
  }
})
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
  </div>
</template>

<style scoped>

</style>