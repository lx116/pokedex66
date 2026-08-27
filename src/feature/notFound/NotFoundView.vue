<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import PokeballLoader from "@/components/PokeballLoading.vue";
import NotFoundMessage from "@/feature/home/view/components/Messages/NotFoundMessage.vue";

const router = useRouter();
const revealed = ref(false);
const loading = ref(false);
const notFound = ref(false);

onMounted(() => {
  loading.value = true;

  setTimeout(() => {
    notFound.value = true;
    loading.value = false;
  }, 1200);
});

function goToPokedex() {
  router.push("/");
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-5 p-6">
    <PokeballLoader
        v-if="!revealed"
        :loading="loading"
        :not-found="notFound"
        @not-found-complete="revealed = true"
    />

    <template v-else>
      <NotFoundMessage/>

      <button
          type="button"
          class="back-button"
          @click="goToPokedex"
      >
        Volver a la Pokedex
      </button>
    </template>
  </div>
</template>

<style scoped>
.back-button {
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
