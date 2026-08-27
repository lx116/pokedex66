<script setup lang="ts">

import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { AdjustmentsHorizontalIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { usePokemonStore } from "../store/usePokemonStore";
import { POKEMON_TYPES } from "@/core/models/typeMeta";
import SearchPokemon from "./components/SearchPokemon.vue";
import TypeFilterChips from "./components/TypeFilterChips/TypeFilterChips.vue";
import TypeFilterModal from "./components/TypeFilterModal/TypeFilterModal.vue";
import PokemonList from "./components/PokemonList/PokemonList.vue";
import PokeballLoader from "@/components/PokeballLoading.vue";
import ErrorMessage from "./components/Messages/ErrorMessage.vue";

const store = usePokemonStore()
const { loading, error, selectedTypes } = storeToRefs(store)
const { applyTypeFilters } = store
const route = useRoute()
const router = useRouter()

const showContent = ref(false)
const showErrorPage = ref(false)
const filterModalOpen = ref(false)
const chipsVisible = ref(true)

function normalizeTypes(raw: typeof route.query.types): string[] {
  const rawList = Array.isArray(raw) ? raw : (raw ?? '').split(',')
  const validNames = new Set(POKEMON_TYPES.map(t => t.name))
  const unique = new Set(rawList.filter((name): name is string => !!name && validNames.has(name)))
  return POKEMON_TYPES.map(t => t.name).filter(name => unique.has(name))
}

let initialLoadDone = false

watch(
    () => route.query.types,
    (rawTypes) => {
      const normalized = normalizeTypes(rawTypes)
      const currentRaw = Array.isArray(rawTypes) ? rawTypes.join(',') : (rawTypes ?? '')

      if (normalized.join(',') !== currentRaw) {
        router.replace({ query: { ...route.query, types: normalized.length ? normalized.join(',') : undefined } })
        return
      }

      if (!initialLoadDone || normalized.join(',') !== selectedTypes.value.join(',')) {
        initialLoadDone = true
        applyTypeFilters(normalized)
      }
    },
    { immediate: true },
)

function pushTypesQuery(nextTypes: string[]) {
  router.push({ query: { ...route.query, types: nextTypes.length ? nextTypes.join(',') : undefined } })
}

function onToggleType(typeName: string) {
  const isSelected = selectedTypes.value.includes(typeName)
  const nextTypes = isSelected
      ? selectedTypes.value.filter(t => t !== typeName)
      : [...selectedTypes.value, typeName]

  pushTypesQuery(nextTypes)
}

function onApplyTypes(typeNames: string[]) {
  pushTypesQuery(typeNames)
}

function clearFilters() {
  pushTypesQuery([])
}

function retry() {
  showErrorPage.value = false
  applyTypeFilters(selectedTypes.value)
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
