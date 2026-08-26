<script setup lang="ts">
import StepDots from "./StepDots.vue";

defineProps<{
  image: string;
  alt: string;
  title: string;
  message: string;
  buttonLabel: string;
  step: number;
  totalSteps: number;
}>();

const emit = defineEmits<{
  continue: [];
}>();
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center gap-5 p-6">

    <Transition name="onboarding-step" mode="out-in">
      <div :key="step" class="onboarding-visual">
        <img
            :src="image"
            :alt="alt"
            class="w-80 h-80 object-contain"
        />

        <div class="message-content">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ title }}
          </h2>

          <p class="text-gray-500 text-center">
            {{ message }}
          </p>
        </div>
      </div>
    </Transition>

    <StepDots :total="totalSteps" :current="step"/>

    <button
        @click="emit('continue')"
        class="custom-button"
    >
      {{ buttonLabel }}
    </button>

  </div>
</template>

<style scoped>

.onboarding-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.message-content {
  width: 100%;
  max-width: 328px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;
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

.onboarding-step-enter-active,
.onboarding-step-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}

.onboarding-step-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.onboarding-step-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

</style>
