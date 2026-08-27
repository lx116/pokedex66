<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import PokeballLoader from "@/components/PokeballLoading.vue";
import ProfileHomeView from "./ProfileHomeView.vue";
import OnboardingMessage from "@/feature/onboarding/view/components/OnboardingMessage.vue";
import GenderSelectStep from "./components/GenderSelectStep.vue";
import NameInputStep from "./components/NameInputStep.vue";
import StarterSelectStep from "./components/StarterSelectStep.vue";
import docOak from "@/assets/profile/docOak.png";
import docOak2 from "@/assets/profile/oak2.png";
import docOak3 from "@/assets/profile/oak3.png";
import {isProfileSetupDone, saveProfileSetup} from "@/core/utils/profileSetup";

type MessageStep = {
  type: "message";
  image: string;
  alt: string;
  title: string;
  message: string;
  buttonLabel: string;
};

type GenderStep = { type: "gender" };
type NameStep = { type: "name" };
type StarterStep = { type: "starter" };

type Step = MessageStep | GenderStep | NameStep | StarterStep;

const STEPS: Step[] = [
  {
    type: "message",
    image: docOak,
    alt: "Profesor Oak",
    title: "¡Bienvenido al mundo Pokémon!",
    message: "Mi nombre es Oak, aunque todos me llaman el Profesor Pokémon.",
    buttonLabel: "Continuar",
  },
  {
    type: "message",
    image: docOak2,
    alt: "Profesor Oak",
    title: "Este mundo está habitado por unas criaturas llamadas Pokémon",
    message: "Para algunos, los Pokémon son mascotas. Otros los usan para pelear entre ellos. En mi caso, dedico mi vida a estudiarlos.",
    buttonLabel: "Continuar",
  },
  {
    type: "message",
    image: docOak3,
    alt: "Profesor Oak",
    title: "¡Tu propia aventura Pokémon está por comenzar!",
    message: "Quiero que tú también te sumes a esta aventura, explorando y estudiando a los Pokémon junto a mí. ¿Aceptas el desafío?",
    buttonLabel: "Continuar",
  },
  {type: "gender"},
  {type: "name"},
  {type: "starter"},
];

// Ya configuraste tu perfil: no repetimos el wizard, mostramos la vista real.
const setupDone = ref(isProfileSetupDone());

const showMessages = ref(false);
const loading = ref(false);
const stepIndex = ref(0);

const selectedGender = ref<"boy" | "girl">("boy");
const playerName = ref("");

const currentStep = computed(() => STEPS[stepIndex.value]);

onMounted(() => {
  if (setupDone.value) return;

  loading.value = true;

  setTimeout(() => {
    loading.value = false;
  }, 1200);
});

function advanceStep() {
  if (stepIndex.value < STEPS.length - 1) {
    stepIndex.value += 1;
  }
}

function handleGenderContinue(gender: "boy" | "girl") {
  selectedGender.value = gender;
  advanceStep();
}

function handleNameContinue(name: string) {
  playerName.value = name;
  advanceStep();
}

function handleStarterContinue(starterId: number) {
  saveProfileSetup({
    gender: selectedGender.value,
    name: playerName.value,
    starterId,
  });

  setupDone.value = true;
}
</script>

<template>
  <ProfileHomeView v-if="setupDone"/>

  <div v-else class="min-h-screen flex items-center justify-center">
      <PokeballLoader
          v-if="!showMessages"
          :loading="loading"
          @complete="showMessages = true"
      />

      <OnboardingMessage
          v-else-if="currentStep.type === 'message'"
          :image="currentStep.image"
          :alt="currentStep.alt"
          :title="currentStep.title"
          :message="currentStep.message"
          :button-label="currentStep.buttonLabel"
          :step="stepIndex + 1"
          :total-steps="STEPS.length"
          @continue="advanceStep"
      />

      <GenderSelectStep
          v-else-if="currentStep.type === 'gender'"
          :step="stepIndex + 1"
          :total-steps="STEPS.length"
          @continue="handleGenderContinue"
      />

      <NameInputStep
          v-else-if="currentStep.type === 'name'"
          :step="stepIndex + 1"
          :total-steps="STEPS.length"
          @continue="handleNameContinue"
      />

      <StarterSelectStep
          v-else
          :step="stepIndex + 1"
          :total-steps="STEPS.length"
          @continue="handleStarterContinue"
      />
  </div>
</template>
