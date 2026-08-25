<script setup lang="ts">
import {computed} from "vue";
import {formatDecimalEs} from "@/core/utils/format";

const props = defineProps<{
  genderRate: number;
}>();

const femalePercent = computed(() => (props.genderRate / 8) * 100);
const malePercent = computed(() => 100 - femalePercent.value);
</script>

<template>
  <div class="gender">
    <p class="gender-title">Género</p>

    <div class="gender-bar">
      <div class="gender-bar-male" :style="{ width: `${malePercent}%` }"/>
      <div class="gender-bar-female" :style="{ width: `${femalePercent}%` }"/>
    </div>

    <div class="gender-labels">
      <span>♂ {{ formatDecimalEs(malePercent) }}%</span>
      <span>♀ {{ formatDecimalEs(femalePercent) }}%</span>
    </div>
  </div>
</template>

<style scoped>
.gender {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.gender-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #757575;
}

.gender-bar {
  display: flex;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
}

.gender-bar-male {
  background: #2196f3;
}

.gender-bar-female {
  background: #f48fb1;
}

.gender-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;

  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}
</style>
