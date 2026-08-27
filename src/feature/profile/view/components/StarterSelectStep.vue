<script setup lang="ts">
import {ref} from "vue";
import StepDots from "@/feature/onboarding/view/components/StepDots.vue";
import {STARTERS} from "@/core/models/starterMeta";
import pokeball from "@/assets/pokeball.svg";

defineProps<{
  step: number;
  totalSteps: number;
}>();

const emit = defineEmits<{
  continue: [starterId: number];
}>();

const selectedId = ref<number | null>(null);

function select(id: number) {
  selectedId.value = id;
}

function submit() {
  if (selectedId.value === null) return;

  emit("continue", selectedId.value);
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center gap-5 p-6">

    <div class="message-content">
      <h2 class="text-2xl font-bold text-gray-900">
        Elige a tu Pokémon inicial
      </h2>

      <p class="text-gray-500 text-center">
        Este compañero te acompañará en el resto de tu aventura.
      </p>
    </div>

    <div class="starter-options">
      <button
          v-for="starter in STARTERS"
          :key="starter.id"
          type="button"
          class="starter-card"
          :class="{ 'starter-card-selected': selectedId === starter.id }"
          @click="select(starter.id)"
      >
        <img :src="starter.imageUrl" :alt="starter.spanishName" class="starter-sprite"/>
        <img :src="pokeball" alt="" class="starter-pokeball"/>
        <span class="starter-name">{{ starter.spanishName }}</span>
      </button>
    </div>

    <StepDots :total="totalSteps" :current="step"/>

    <button
        type="button"
        class="custom-button"
        :disabled="selectedId === null"
        @click="submit"
    >
      Continuar
    </button>

  </div>
</template>

<style scoped>

.message-content {
  width: 100%;
  max-width: 328px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;
}

.starter-options {
  display: flex;
  gap: 12px;
}

.starter-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  width: 96px;
  padding: 12px 8px;

  border-radius: 16px;
  border: 2px solid #e5e7eb;
  background: white;

  cursor: pointer;

  transition: border-color .2s ease, background-color .2s ease, transform .2s ease;
}

.starter-card-selected {
  border-color: #2563eb;
  background: #eff6ff;
  transform: translateY(-4px);
}

.starter-sprite {
  width: 64px;
  height: 64px;
  object-fit: contain;
  image-rendering: pixelated;
}

.starter-pokeball {
  width: 28px;
  height: 28px;
}

.starter-name {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.starter-card-selected .starter-name {
  color: #2563eb;
}

.custom-button {
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

.custom-button:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

</style>
