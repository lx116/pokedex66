<script setup lang="ts">

import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { AdjustmentsHorizontalIcon } from "@heroicons/vue/24/outline";
import { usePokemonStore } from "../store/usePokemonStore";
import SearchPokemon from "./components/SearchPokemon.vue";
import TypeFilterChips from "./components/TypeFilterChips.vue";
import TypeFilterModal from "./components/TypeFilterModal.vue";
import PokemonList from "./components/PokemonList.vue";
import PokeballLoader from "@/components/PokeballLoading.vue";
import ErrorMessage from "./components/ErrorMessage.vue";

const store = usePokemonStore()
const { loading, error, selectedTypes } = storeToRefs(store)
const { fetchAllPokemon } = store

const showContent = ref(false)
const showErrorPage = ref(false)
const filterModalOpen = ref(false)

onMounted(() => {
  fetchAllPokemon()
})

function retry() {
  showErrorPage.value = false
  fetchAllPokemon()
}
</script>

<template>
<div>
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
      <div class="sticky top-0 z-20 bg-gray-50 pb-2">
        <SearchPokemon>
          <template #actions>
            <button
                type="button"
                aria-label="Filtros"
                class="md:hidden relative flex h-12 w-13 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-transparent text-gray-500 transition hover:border-gray-400 hover:text-gray-700 active:scale-95"
                @click="filterModalOpen = true"
            >
              <AdjustmentsHorizontalIcon class="h-5 w-5" />
              <span
                  v-if="selectedTypes.length"
                  class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white"
              >
                {{ selectedTypes.length }}
              </span>
            </button>
          </template>
        </SearchPokemon>

        <TypeFilterChips/>
      </div>

      <TypeFilterModal :open="filterModalOpen" @close="filterModalOpen = false" />

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
