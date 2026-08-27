<script setup lang="ts">

import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { AdjustmentsHorizontalIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { usePokemonStore } from "../store/usePokemonStore";
import { POKEMON_TYPES } from "@/core/models/typeMeta";
import SearchPokemon from "./components/SearchPokemon/SearchPokemon.vue";
import TypeFilterChips from "./components/TypeFilterChips/TypeFilterChips.vue";
import TypeFilterModal from "./components/TypeFilterModal/TypeFilterModal.vue";
import PokemonList from "./components/PokemonList/PokemonList.vue";
import PokeballLoader from "@/components/PokeballLoading.vue";
import ErrorMessage from "./components/Messages/ErrorMessage.vue";

const store = usePokemonStore()
const { loading, error, notFound, selectedTypes } = storeToRefs(store)
const { syncFromQuery } = store
const route = useRoute()
const router = useRouter()

const showContent = ref(false)
const showErrorPage = ref(false)
const filterModalOpen = ref(false)
const chipsVisible = ref(true)

function normalizeQuery(raw: typeof route.query.q): string {
  return (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? ''
}

function normalizeTypes(raw: typeof route.query.types): string[] {
  const rawList = Array.isArray(raw) ? raw : (raw ?? '').split(',')
  const validNames = new Set(POKEMON_TYPES.map(t => t.name))
  const unique = new Set(rawList.filter((name): name is string => !!name && validNames.has(name)))
  return POKEMON_TYPES.map(t => t.name).filter(name => unique.has(name))
}

let initialLoadDone = false
let lastAppliedQuery = ''
let lastAppliedTypes: string[] = []

watch(
    () => [route.query.q, route.query.types],
    ([rawQuery, rawTypes]) => {
      const normalizedQuery = normalizeQuery(rawQuery)
      const normalizedTypes = normalizeTypes(rawTypes)
      const currentRawQuery = Array.isArray(rawQuery) ? (rawQuery[0] ?? '') : (rawQuery ?? '')
      const currentRawTypes = Array.isArray(rawTypes) ? rawTypes.join(',') : (rawTypes ?? '')

      if (normalizedQuery !== currentRawQuery || normalizedTypes.join(',') !== currentRawTypes) {
        router.replace({
          query: {
            ...route.query,
            q: normalizedQuery || undefined,
            types: normalizedTypes.length ? normalizedTypes.join(',') : undefined,
          },
        })
        return
      }

      const changed = normalizedQuery !== lastAppliedQuery
          || normalizedTypes.join(',') !== lastAppliedTypes.join(',')

      if (!initialLoadDone || changed) {
        initialLoadDone = true
        lastAppliedQuery = normalizedQuery
        lastAppliedTypes = normalizedTypes
        syncFromQuery(normalizedQuery, normalizedTypes)
      }
    },
    { immediate: true },
)

function updateQuery(overrides: { q?: string; types?: string[] }) {
  const nextQuery = overrides.q !== undefined ? overrides.q : normalizeQuery(route.query.q)
  const nextTypes = overrides.types !== undefined ? overrides.types : normalizeTypes(route.query.types)

  router.push({
    query: {
      ...route.query,
      q: nextQuery || undefined,
      types: nextTypes.length ? nextTypes.join(',') : undefined,
    },
  })
}

function onSearch(query: string) {
  updateQuery({ q: query })
}

function onToggleType(typeName: string) {
  const isSelected = selectedTypes.value.includes(typeName)
  const nextTypes = isSelected
      ? selectedTypes.value.filter(t => t !== typeName)
      : [...selectedTypes.value, typeName]

  updateQuery({ types: nextTypes })
}

function onApplyTypes(typeNames: string[]) {
  updateQuery({ types: typeNames })
}

function clearFilters() {
  updateQuery({ types: [] })
}

function retry() {
  showErrorPage.value = false
  syncFromQuery(normalizeQuery(route.query.q), normalizeTypes(route.query.types))
}
</script>

<template>
<div>
  <div v-if="!showContent && !showErrorPage" class="min-h-screen flex items-center justify-center">
    <PokeballLoader
        :loading="loading"
        :error="!!error"
        :not-found="notFound"
        @complete="showContent = true"
        @error-complete="showErrorPage = true"
        @not-found-complete="showContent = true"
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
        <SearchPokemon :initial-query="normalizeQuery(route.query.q)" @search="onSearch">
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

            <button
                v-if="selectedTypes.length"
                type="button"
                class="hidden md:inline-flex h-12 shrink-0 items-center gap-1.5 rounded-full border border-blue-200 bg-transparent px-4 text-sm font-medium text-blue-600 transition hover:border-blue-300 hover:bg-blue-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                @click="clearFilters"
            >
              <XMarkIcon class="h-4 w-4" />
              Borrar filtros
            </button>

            <button
                type="button"
                class="hidden md:inline-flex h-12 shrink-0 items-center gap-1.5 rounded-full border border-gray-300 bg-transparent px-4 text-sm font-medium text-gray-500 transition hover:border-gray-400 hover:text-gray-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                @click="chipsVisible = !chipsVisible"
            >
              <ChevronUpIcon v-if="chipsVisible" class="h-4 w-4" />
              <ChevronDownIcon v-else class="h-4 w-4" />
              {{ chipsVisible ? 'Ocultar filtros' : 'Mostrar filtros' }}
            </button>
          </template>
        </SearchPokemon>

        <button
            v-if="selectedTypes.length"
            type="button"
            class="md:hidden -mt-1 mb-2 inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-blue-600 sm:px-6"
            @click="clearFilters"
        >
          <XMarkIcon class="h-4 w-4" />
          Borrar filtros
        </button>

        <TypeFilterChips v-if="chipsVisible" @toggle-type="onToggleType" />
      </div>

      <TypeFilterModal :open="filterModalOpen" @close="filterModalOpen = false" @apply="onApplyTypes" />

      <PokemonList @retry="retry"/>
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
