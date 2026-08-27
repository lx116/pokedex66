<script setup lang="ts">
import {computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {usePokemonJourney} from "@/feature/profile/composables/usePokemonJourney";

const {status} = usePokemonJourney();
const route = useRoute();
const router = useRouter();

const visible = computed(() => status.value === "encounter" && route.path !== "/profile");

function goToEncounter() {
  router.push("/profile");
}
</script>

<template>
  <Transition name="encounter-toast-fade">
    <div v-if="visible" class="encounter-toast">
      <p class="encounter-toast-title">¡Encontraste Pokémon!</p>
      <p class="encounter-toast-message">
        Hay nuevos Pokémon esperando durante tu recorrido.
      </p>

      <button type="button" class="encounter-toast-button" @click="goToEncounter">
        Ver encuentro
      </button>
    </div>
  </Transition>
</template>

<style scoped>

.encounter-toast {
  position: fixed;
  z-index: 70;

  left: 50%;
  bottom: 84px;

  transform: translateX(-50%);

  width: calc(100% - 40px);
  max-width: 328px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 16px;

  border-radius: 16px;
  background: #1a1a1a;
  color: white;

  box-shadow: 0 8px 24px rgba(0, 0, 0, .25);
}

.encounter-toast-title {
  font-weight: 700;
}

.encounter-toast-message {
  font-size: 13px;
  color: #d1d5db;
}

.encounter-toast-button {
  align-self: flex-start;

  margin-top: 4px;
  padding: 8px 16px;

  border-radius: 100px;
  border: none;
  background: #2563eb;
  color: white;

  font-weight: 600;
  font-size: 13px;

  cursor: pointer;
}

.encounter-toast-fade-enter-active,
.encounter-toast-fade-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}

.encounter-toast-fade-enter-from,
.encounter-toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

@media (min-width: 768px) {
  .encounter-toast {
    bottom: 24px;
    left: 24px;
    transform: none;
  }

  .encounter-toast-fade-enter-from,
  .encounter-toast-fade-leave-to {
    transform: translateY(12px);
  }
}

</style>
