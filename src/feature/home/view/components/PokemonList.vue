<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePokemonStore } from "../../store/usePokemonStore"
import PokemonCard from "./PokemonCard.vue"
import PokemonGrid from "@/components/PokemonGrid.vue"
import PokeballLoader from "@/components/PokeballLoading.vue"
import ErrorMessage from "./ErrorMessage.vue"
import NotFoundMessage from "./NotFoundMessage.vue"

const store = usePokemonStore()
const {
  pokemon,
  visiblePokemonList,
  loading,
  loadingMore,
  error,
  notFound,
  hasMore,
} = storeToRefs(store)
const { loadMore, fetchAllPokemon } = store


const revealed = ref(true)
const showErrorPage = ref(false)
const showNotFoundPage = ref(false)

watch(loading, (isLoading) => {
  if (isLoading) {
    revealed.value = false
    showErrorPage.value = false
    showNotFoundPage.value = false
  }
})

function retry() {
  showErrorPage.value = false
  fetchAllPokemon()
}

const sentinel = ref<HTMLElement | null>(null)

const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !pokemon.value) {
        loadMore()
      }
    },
    { rootMargin: '400px' }
)

watch(sentinel, (node, previousNode) => {
  if (previousNode) observer.unobserve(previousNode)
  if (node) observer.observe(node)
})

onBeforeUnmount(() => {
  observer.disconnect()
})

watch(loadingMore, (isLoadingMore) => {
  if (!isLoadingMore && !error.value && sentinel.value) {
    observer.unobserve(sentinel.value)
    observer.observe(sentinel.value)
  }
})

</script>

<template>
  <div
      v-if="!revealed && !showErrorPage && !showNotFoundPage"
      class="flex items-center justify-center py-16"
  >
    <PokeballLoader
        :loading="loading"
        :error="!!error"
        :not-found="notFound"
        @complete="revealed = true"
        @error-complete="showErrorPage = true"
        @not-found-complete="showNotFoundPage = true"
    />
  </div>

  <ErrorMessage
      v-else-if="showErrorPage"
      :message="error ?? 'Ocurrió un error inesperado'"
      @retry="retry"
  />

  <NotFoundMessage v-else-if="showNotFoundPage" />

  <template v-else>
    <PokemonGrid v-if="visiblePokemonList.length" :pokemons="visiblePokemonList">
      <template #default="{ pokemon: p }">
        <PokemonCard :pokemon="p" />
      </template>
    </PokemonGrid>

    <div v-if="!pokemon && hasMore" ref="sentinel" class="h-4"></div>

    <div v-if="loadingMore" class="flex justify-center py-6">
      <img src="@/assets/pokeball.svg" class="w-8 h-8 animate-spin" alt="Cargando más" />
    </div>
  </template>
</template>
<style scoped>

</style>
