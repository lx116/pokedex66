<script setup lang="ts">
import {computed} from "vue";
import {usePokemonJourney} from "../../composables/usePokemonJourney";
import {useTrainerStore} from "../../store/useTrainerStore";
import boyWalk from "@/assets/profile/boyWalkAnimation.gif";
import girlWalk from "@/assets/profile/girlWalkAnimation.gif";
import grassIcon from "@/assets/icons/leaf.svg";
import fireIcon from "@/assets/icons/fire.svg";
import waterIcon from "@/assets/icons/water.svg";

const {terrain, remainingSeconds} = usePokemonJourney();
const trainerStore = useTrainerStore();

const walkGif = computed(() => (trainerStore.gender === "girl" ? girlWalk : boyWalk));

const TERRAIN_META = {
  grass: {icon: grassIcon, label: "Zona de hierba", bg: "#dcfce7"},
  fire: {icon: fireIcon, label: "Zona de fuego", bg: "#ffe4d6"},
  water: {icon: waterIcon, label: "Zona de agua", bg: "#dbeafe"},
};

const terrainMeta = computed(() => TERRAIN_META[terrain.value]);
</script>

<template>
  <div class="journey-wrap">
    <div class="journey-circle" :style="{ backgroundColor: terrainMeta.bg }">
      <img :src="terrainMeta.icon" :alt="terrainMeta.label" class="journey-terrain-icon"/>

      <div class="journey-walk-frame">
        <img :src="walkGif" alt="Caminando" class="journey-walk-gif"/>
      </div>
    </div>

    <p class="journey-terrain-label">{{ terrainMeta.label }}</p>

    <p class="journey-timer">
      Próximo encuentro en <strong>{{ remainingSeconds }}s</strong>
    </p>
  </div>
</template>

<style scoped>

.journey-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.journey-circle {
  position: relative;

  width: 220px;
  height: 220px;

  border-radius: 50%;
  border: 1px solid #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  transition: background-color .4s ease;
}

.journey-terrain-icon {
  position: absolute;
  top: 16px;
  right: 24px;

  width: 28px;
  height: 28px;
}

.journey-walk-frame {
  display: flex;
  align-items: center;
  justify-content: center;
}

.journey-walk-gif {
  width: 140px;
  height: auto;

  image-rendering: pixelated;
}

.journey-terrain-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.journey-timer {
  font-size: 14px;
  color: #757575;
}

.journey-timer strong {
  color: #2563eb;
}

</style>
