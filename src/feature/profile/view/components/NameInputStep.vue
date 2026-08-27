<script setup lang="ts">
import {ref} from "vue";
import StepDots from "@/feature/onboarding/view/components/StepDots.vue";

defineProps<{
  step: number;
  totalSteps: number;
}>();

const emit = defineEmits<{
  continue: [name: string];
}>();

const name = ref("");

function submit() {
  const trimmed = name.value.trim();

  if (!trimmed) return;

  emit("continue", trimmed);
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center gap-5 p-6">

    <div class="message-content">
      <h2 class="text-2xl font-bold text-gray-900">
        ¿Cómo te llamas?
      </h2>

      <p class="text-gray-500 text-center">
        Este será tu nombre de entrenador en tu aventura Pokémon.
      </p>
    </div>

    <form class="name-form" @submit.prevent="submit">
      <input
          v-model="name"
          type="text"
          placeholder="Tu nombre..."
          maxlength="20"
          class="name-input"
      />
    </form>

    <StepDots :total="totalSteps" :current="step"/>

    <button
        type="button"
        class="custom-button"
        :disabled="!name.trim()"
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

.name-form {
  width: 328px;
}

.name-input {
  width: 100%;
  height: 56px;

  padding: 0 20px;

  border-radius: 100px;
  border: 2px solid #e5e7eb;

  font-size: 16px;
  text-align: center;

  outline: none;

  transition: border-color .2s ease;
}

.name-input:focus {
  border-color: #2563eb;
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
