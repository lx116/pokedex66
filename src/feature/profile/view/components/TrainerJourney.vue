<script setup lang="ts">
import {computed} from "vue";
import {usePokemonJourney} from "../../composables/usePokemonJourney";
import {useTrainerStore} from "../../store/useTrainerStore";
import {STARTERS} from "@/core/models/starterMeta";
import JourneyCircle from "./JourneyCircle.vue";
import PokemonEncounter from "./PokemonEncounter.vue";
import boySprite from "@/assets/profile/boy.png";
import girlSprite from "@/assets/profile/girl.png";

const {status, currentEncounter, resolveEncounter} = usePokemonJourney();
const trainerStore = useTrainerStore();

const avatarSrc = computed(() => (trainerStore.gender === "girl" ? girlSprite : boySprite));
const starter = computed(() =>
    STARTERS.find(s => s.id === trainerStore.starterId) ?? STARTERS[0]
);

function handleCapture(id: number) {
  resolveEncounter(id);
}

function handleSkip() {
  resolveEncounter();
}
</script>

<template>
  <JourneyCircle v-if="status === 'traveling'"/>

  <PokemonEncounter
      v-else-if="status === 'encounter'"
      :pokemon-ids="currentEncounter"
      @capture="handleCapture"
      @skip="handleSkip"
  />

  <div v-else class="team-full">
    <div class="team-full-sprites">
      <img :src="avatarSrc" alt="Tu avatar" class="team-full-avatar"/>
      <img :src="starter.imageUrl" :alt="starter.spanishName" class="team-full-pokemon"/>
    </div>

    <p class="team-full-message">
      ¡Tu equipo está completo! Liberá a alguno si querés seguir explorando.
    </p>
  </div>
</template>

<style scoped>

.team-full {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.team-full-sprites {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.team-full-avatar {
  width: 140px;
  height: auto;

  object-fit: contain;
  image-rendering: pixelated;
}

.team-full-pokemon {
  width: 72px;
  height: 72px;

  object-fit: contain;
  image-rendering: pixelated;
}

.team-full-message {
  max-width: 280px;

  text-align: center;
  font-size: 14px;
  color: #757575;
}

</style>
