<script setup lang="ts">
import PokeballThrow from "@/components/PokeballThrow.vue";
</script>

<template>
  <div class="screen min-h-screen flex flex-col items-center justify-center text-center p-6">

    <PokeballThrow />

    <div class="Notice">
      <h2 class="text-2xl font-bold text-gray-900">
        ¡Muy pronto disponible!
      </h2>

      <p class="text-gray-500 text-center">
        Estamos trabajando para traerte esta sección.
        Vuelve más adelante para descubrir todas las novedades.
      </p>
    </div>

  </div>
</template>

<style scoped>

.screen {
  overflow: hidden;
}

/* ============================= */
/* Message */
/* ============================= */

.Notice {
  width: 400px;
  max-width: 100%;

  display: flex;
  flex-direction: column;

  gap: 12px;

  opacity: 0;

  transform: translateY(20px);

  animation:
      noticeAppear .7s
      ease-out
      2s
      forwards;
}

@keyframes noticeAppear {

  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
