<script setup lang="ts">
import { ref, watch } from "vue"
import { storeToRefs } from "pinia"
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline"

import { usePokemonStore } from "../../store/usePokemonStore"

const pokemonName = ref("")

const store = usePokemonStore()
const { pokemon } = storeToRefs(store)
const { findPokemon } = store

function searchPokemon() {
  const name = pokemonName.value.trim()

  if (!name) return

  findPokemon(name)
}

watch(pokemonName, (value) => {
  if (!value.trim()) {
    pokemon.value = null
  }
})
</script>

<template>
  <div class="w-full p-4 sm:p-6">

    <form
        class="
        flex
        w-full
        items-center
        gap-3
        md:max-w-[50%]
      "
        @submit.prevent="searchPokemon"
    >
      <div class="relative min-w-0 flex-1">

        <MagnifyingGlassIcon
            class="
            pointer-events-none
            absolute
            left-4
            top-1/2
            h-5
            w-5
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
            v-model="pokemonName"
            type="text"
            placeholder="Buscar Pokémon..."
            class="
            h-12
            w-full
            rounded-full
            border
            bg-white
            py-3
            pl-11
            pr-4
            text-sm
            text-gray-900
            outline-none
            transition
            hover:border-gray-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
          "
        />

      </div>

      <button
          type="submit"
          aria-label="Buscar Pokémon"
          class="
            flex
            h-12
            w-13
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-gray-300
            bg-transparent
            text-gray-500
            transition
            hover:border-gray-400
            hover:text-gray-700
            active:scale-95
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/20
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          :disabled="!pokemonName.trim()"
      >
        <MagnifyingGlassIcon class="h-5 w-5" />
      </button>

      <slot name="actions" />

    </form>

  </div>
</template>