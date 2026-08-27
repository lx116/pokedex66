<script setup lang="ts">
import {computed, ref} from "vue";
import StepDots from "@/feature/onboarding/view/components/StepDots.vue";
import boySprite from "@/assets/profile/boy.png";
import girlSprite from "@/assets/profile/girl.png";

defineProps<{
  step: number;
  totalSteps: number;
}>();

const emit = defineEmits<{
  continue: [gender: "boy" | "girl"];
}>();

// 0 = chico, 1 = chica
const sliderValue = ref(0);

const selectedGender = computed(() => (sliderValue.value === 0 ? "boy" : "girl"));
const currentSprite = computed(() => (selectedGender.value === "boy" ? boySprite : girlSprite));
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center gap-5 p-6">

    <div class="message-content">
      <h2 class="text-2xl font-bold text-gray-900">
        ¿Eres chico o chica?
      </h2>

      <p class="text-gray-500 text-center">
        Deslizá para elegir tu apariencia.
      </p>
    </div>

    <Transition name="gender-fade" mode="out-in">
      <img
          :key="selectedGender"
          :src="currentSprite"
          :alt="selectedGender === 'boy' ? 'Chico' : 'Chica'"
          class="gender-sprite"
      />
    </Transition>

    <div class="gender-slider">
      <span class="gender-label" :class="{ 'gender-label-active': selectedGender === 'boy' }">
        Chico
      </span>

      <input
          v-model.number="sliderValue"
          type="range"
          min="0"
          max="1"
          step="1"
          class="slider-input"
          :class="selectedGender === 'boy' ? 'slider-boy' : 'slider-girl'"
          aria-label="Elegir género"
      />

      <span class="gender-label" :class="{ 'gender-label-active': selectedGender === 'girl' }">
        Chica
      </span>
    </div>

    <StepDots :total="totalSteps" :current="step"/>

    <button
        type="button"
        class="custom-button"
        @click="emit('continue', selectedGender)"
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

.gender-sprite {
  width: 160px;
  height: 224px;

  object-fit: contain;
  image-rendering: pixelated;
}

.gender-fade-enter-active,
.gender-fade-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}

.gender-fade-enter-from {
  opacity: 0;
  transform: scale(.92);
}

.gender-fade-leave-to {
  opacity: 0;
  transform: scale(.92);
}

.gender-slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gender-label {
  font-weight: 600;
  color: #9ca3af;
  transition: color .2s ease;
}

.gender-label-active {
  color: #2563eb;
}

.slider-input {
  -webkit-appearance: none;
  appearance: none;

  width: 160px;
  height: 8px;

  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #ec4899);

  outline: none;
  cursor: pointer;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;

  width: 28px;
  height: 28px;

  border-radius: 50%;
  background: white;
  border: 3px solid #2563eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .2);

  cursor: pointer;

  transition: border-color .2s ease;
}

.slider-input::-moz-range-thumb {
  width: 28px;
  height: 28px;

  border-radius: 50%;
  background: white;
  border: 3px solid #2563eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .2);

  cursor: pointer;

  transition: border-color .2s ease;
}

.slider-girl::-webkit-slider-thumb {
  border-color: #ec4899;
}

.slider-girl::-moz-range-thumb {
  border-color: #ec4899;
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

</style>
