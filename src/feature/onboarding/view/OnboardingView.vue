<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import PokeballLoader from "@/components/PokeballLoading.vue";
import {markOnboardingDone} from "@/core/utils/onboarding";
import OnboardingMessage from "./components/OnboardingMessage.vue";
import welcome01 from "@/assets/onboarding/welcome01.svg";
import welcome02 from "@/assets/onboarding/welvome02.svg";

const STEPS = [
  {
    image: welcome01,
    alt: "Welcome01",
    title: "Todos los Pokémon en un solo lugar",
    message: "Accede a una amplia lista de Pokémon de todas las generaciones creadas por Nintendo",
    buttonLabel: "Continuar",
  },
  {
    image: welcome02,
    alt: "Welcome02",
    title: "Mantén tu Pokédex actualizada",
    message: "Regístrate y guarda tu perfil, Pokémon favoritos, configuraciones y mucho más en la aplicación",
    buttonLabel: "Empecemos",
  },
];

const router = useRouter();
const showMessages = ref(false);
const loading = ref(false);
const stepIndex = ref(0);

const currentStep = computed(() => STEPS[stepIndex.value]);

onMounted(() => {
  loading.value = true;

  setTimeout(() => {
    loading.value = false;
  }, 1200);
});

function handleContinue() {
  if (stepIndex.value < STEPS.length - 1) {
    stepIndex.value += 1;
    return;
  }

  markOnboardingDone();
  router.push("/");
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <PokeballLoader
        v-if="!showMessages"
        :loading="loading"
        @complete="showMessages = true"
    />

    <OnboardingMessage
        v-else
        :image="currentStep.image"
        :alt="currentStep.alt"
        :title="currentStep.title"
        :message="currentStep.message"
        :button-label="currentStep.buttonLabel"
        :step="stepIndex + 1"
        :total-steps="STEPS.length"
        @continue="handleContinue"
    />
  </div>
</template>
