<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePokemonStore } from "../../../store/usePokemonStore";
import { POKEMON_TYPES } from "@/core/models/typeMeta";
import TypeChip from "../TypeChip/TypeChip.vue";

const store = usePokemonStore()
const { selectedTypes } = storeToRefs(store)
const emit = defineEmits<{'toggle-type': [typeName: string]}>()
</script>

<template>
  <div class="hidden md:flex flex-wrap gap-2 px-4 sm:px-6">
    <TypeChip
        v-for="type in POKEMON_TYPES"
        :key="type.name"
        :type="type"
        :selected="selectedTypes.includes(type.name)"
        @toggle="emit('toggle-type', type.name)"
    />
  </div>
</template>

<style scoped>

</style>
