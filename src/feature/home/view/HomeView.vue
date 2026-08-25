<script setup lang="ts">

import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { usePokemonStore } from "../store/usePokemonStore";
import SearchPokemon from "./components/SearchPokemon.vue";
import PokemonList from "./components/PokemonList.vue";
import PokeballLoader from "@/components/PokeballLoading.vue";
import ErrorMessage from "./components/ErrorMessage.vue";

const store = usePokemonStore()
const { loading, error } = storeToRefs(store)
const { fetchAllPokemon } = store

const showContent = ref(false)
const showErrorPage = ref(false)

onMounted(() => {
  fetchAllPokemon()
})

function retry() {
  showErrorPage.value = false
  fetchAllPokemon()
}
</script>

<template>
<div class="p-6">
  <div v-if="!showContent && !showErrorPage" class="min-h-screen flex items-center justify-center">
    <PokeballLoader
        :loading="loading"
        :error="!!error"
        @complete="showContent = true"
        @error-complete="showErrorPage = true"
    />
  </div>

  <ErrorMessage
      v-else-if="showErrorPage"
      :message="error ?? 'Ocurrió un error inesperado'"
      @retry="retry"
  />

  <Transition v-else name="reveal">
    <div v-if="showContent">
      <SearchPokemon/>
      <PokemonList/>
    </div>
  </Transition>
</div>
</template>

<style scoped>

.reveal-enter-active {
  transition: opacity .5s ease, transform .5s ease;
}

.reveal-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

</style>
