<script setup lang="ts">
import { computed } from "vue";
import { Pokemon } from "@/core/models/pokemonModel";
import { POKEMON_TYPES, type PokemonTypeMeta } from "@/core/models/typeMeta";
import TypeChip from "./TypeChip.vue";
import TypeIconBackdrop from "./TypeIconBackdrop.vue";

const props = defineProps<{
  pokemon: Pokemon
}>()

const typeMetas = computed<PokemonTypeMeta[]>(() =>
    props.pokemon.types
        .map(name => POKEMON_TYPES.find(type => type.name === name))
        .filter((type): type is PokemonTypeMeta => !!type)
)

const primaryColor = computed(() => typeMetas.value[0]?.color ?? '#9E9E9E')

const paddedId = computed(() => String(props.pokemon.id).padStart(3, '0'))

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
</script>

<template>
  <div
      class="
    w-full
    max-w-82
    h-25.5
    rounded-2xl
    pl-4
    flex
    items-center
    justify-between
    overflow-hidden
  "
      :style="{ backgroundColor: hexToRgba(primaryColor, 0.42) }"
  >
    <!-- Información -->
    <div class="flex flex-col text-left min-w-0 pr-3 gap-1">
      <p class="text-xs">Nº{{ paddedId }}</p>

      <p
          class="truncate"
          style="font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 21px; line-height: 100%; letter-spacing: 0%;"
      >
        {{ pokemon.name }}
      </p>

      <div class="flex flex-nowrap gap-1 overflow-hidden">
        <TypeChip
            v-for="type in typeMetas"
            :key="type.name"
            :type="type"
            :selected="true"
            compact
            force-white-text
        />
      </div>
    </div>

    <!-- Imagen -->
    <div
        class="
    relative
    w-31.5
    h-full
    shrink-0
    flex
    items-center
    justify-center
    overflow-hidden
    rounded-2xl
  "
        :style="{ backgroundColor: hexToRgba(primaryColor, 0.72) }"
    >
      <TypeIconBackdrop
          v-if="typeMetas[0]"
          :icon-url="typeMetas[0].iconUrl"
      />

      <img
          v-if="pokemon.imageURL"
          :src="pokemon.imageURL"
          :alt="pokemon.name"
          class="
      relative
      z-10
      w-20.5
      h-20.5
      object-contain
    "
      />
    </div>
  </div>
</template>
