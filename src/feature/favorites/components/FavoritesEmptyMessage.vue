<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import PokeballThrow from "@/components/PokeballThrow.vue";

const router = useRouter();
const revealed = ref(false);

function goToPokedex() {
  router.push("/");
}
</script>

<template>
  <div class="min-h-[50vh] flex flex-col items-center justify-center text-center gap-4 p-6">

    <PokeballThrow v-if="!revealed" :show-puff="false" @complete="revealed = true"/>

    <template v-else>
      <img
          src="@/assets/pikachu.png"
          alt="Sin favoritos"
          class="w-64 h-64 object-contain pokemon-disabled"
      />

      <p class="text-gray-500 text-center max-w-xs">
        No has marcado ningún Pokémon como favorito. Haz clic en el ícono de corazón de tus Pokémon favoritos y aparecerán aquí.
      </p>

      <button
          type="button"
          class="go-to-pokedex-button"
          @click="goToPokedex"
      >
        Ir a la Pokedex
      </button>
    </template>

  </div>
</template>

<style scoped>
.pokemon-disabled {
  filter:
      grayscale(100%)
      brightness(1)
      contrast(0.9);
  opacity: 0.65;
}

.go-to-pokedex-button {
  width: 328px;
  height: 56px;

  border-radius: 100px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #2563eb;
  color: white;

  font-weight: 600;

  border: none;
  cursor: pointer;
}
</style>
