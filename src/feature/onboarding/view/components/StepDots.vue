<script setup lang="ts">
defineProps<{
  total: number;
  current: number;
}>();
</script>

<template>
  <div class="step-dots">
    <span
        v-for="step in total"
        :key="step"
        class="step-dot"
        :class="{ 'step-dot-active': step === current }"
    />
  </div>
</template>

<style scoped>
.step-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;

  background: #dbeafe;

  transition: width .2s ease, background-color .2s ease;
}

.step-dot-active {
  width: 32px;
  background: #2563eb;
}
</style>
