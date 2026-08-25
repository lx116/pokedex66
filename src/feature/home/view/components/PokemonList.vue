<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePokemonStore } from "../../store/usePokemonStore"
import PokemonCard from "./PokemonCard.vue"
import PokeballLoader from "@/components/PokeballLoading.vue"

const store = usePokemonStore()
const { visiblePokemonList, loading, error } = storeToRefs(store)
</script>

<template>
    <PokeballLoader :loading="loading" />
    <p v-if="error">{{ error }}</p>

    <div v-if="visiblePokemonList.length" class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <PokemonCard v-for="p in visiblePokemonList" :key="p.id" :pokemon="p" />
    </div>
</template>
<style scoped>

</style>