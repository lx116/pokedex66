<script setup lang="ts">

const emit = defineEmits<{
  retry: []
}>()

</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center gap-5 p-6">

    <img
        src="../../../../../assets/magickarp.svg"
        alt="Magikarp"
        class="w-80 h-80 object-contain"
    />

    <div class="error-content">
      <h2 class="text-2xl font-bold text-gray-900">
        Algo salió mal...
      </h2>

      <p class="text-gray-500 text-center">
        No pudimos cargar la información en este momento. Verifica tu conexión o intenta nuevamente más tarde.
      </p>
    </div>

    <button
        @click="emit('retry')"
        class="retry-button"
    >
      Reintentar
    </button>

  </div>
</template>

<style scoped>

.error-content {
  width: 100%;
  max-width: 328px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;
}

.retry-button {
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