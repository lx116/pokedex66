<script setup lang="ts">
</script>

<template>
  <div class="min-h-[50vh] flex flex-col items-center justify-center text-center gap-4 p-6">

    <div class="relative">
      <img
          src="../../../../../assets/404psy.png"
          alt="No encontrado"
          class="w-64 h-64 object-contain pokemon-disabled"
      />

      <span class="question question-one">?</span>
      <span class="question question-two">?</span>
      <span class="question question-three">?</span>
    </div>

    <h2 class="text-2xl font-bold text-gray-900">
      404
    </h2>

    <p class="text-gray-500 text-center">
      No se ha encontrado lo que buscabas.
    </p>
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

.question {
  position: absolute;
  font-weight: 700;
  color: #9ca3af;
  opacity: 0.8;
  line-height: 1;
}

.question-one {
  font-size: 2rem;
  top: 8px;
  right: 38px;
  transform: rotate(12deg);
}

.question-two {
  font-size: 1.5rem;
  top: 38px;
  right: 10px;
  transform: rotate(20deg);
}

.question-three {
  font-size: 1.2rem;
  top: 5px;
  right: 5px;
  transform: rotate(-10deg);
}
</style>