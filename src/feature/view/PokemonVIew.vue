<script setup>
import { ref } from 'vue'
import { usePokemonViewModel } from "../viewmodel/usePokemonViewModel.js"

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
  <div>
    <input
        v-model="pokemonName"
        type="text"
        placeholder="Nombre del Pokémon"
    />

    <button @click="searchPokemon">
      Buscar
    </button>

    <p v-if="loading">
      Cargando...
    </p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <div v-else-if="pokemon">
      <h2> {{ pokemon.name }}</h2>

      <img
          :src="pokemon.sprites.front_default"
          :alt="pokemon.name"
      />
    </div>

    <div>
      <h3>PokeLista</h3>
      <button @click="searchPokemonList">CARGAR LISTA</button>
    </div>

    <div v-if="pokemonList === 0" class="pokemon-list">
      <p>NO HAY NADA PARA MOSTRAR</p>
    </div>

    <div v-if="pokemonList.length > 0" class="pokemon-list">
      <ul>
        <li v-for="pokemon in pokemonList" :key="pokemon.id">
            <h2> {{ pokemon.name }}</h2>
        </li>
      </ul>
    </div>



  </div>
</template>
<style scoped>

</style>