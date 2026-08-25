<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  uppercaseValue?: boolean;
}>();
</script>

<template>
  <div class="stat-card">

    <div class="stat-card-label">
      <div class="stat-card-icon">
        <slot name="icon" />
      </div>

      <span>
        {{ label }}
      </span>
    </div>

    <div class="stat-card-box">
      <span
          class="stat-card-value"
          :class="{ uppercase: uppercaseValue }"
      >
        {{ value }}
      </span>
    </div>

  </div>
</template>

<style scoped>
.stat-card {
  min-width: 0;
  width: 100%;
}

.stat-card-label {
  display: flex;
  align-items: center;

  gap: 6px;

  margin-bottom: 6px;

  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.05em;

  text-transform: uppercase;

  color: #757575;
}

.stat-card-icon {
  width: 16px;
  height: 16px;

  flex-shrink: 0;

  color: #757575;
}

.stat-card-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.stat-card-box {
  width: 100%;
  max-width: 154px;
  height: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  padding: 8px;

  border: 1px solid #E0E0E0;
  border-radius: 15px;

  background: transparent;
}

.stat-card-value {
  min-width: 0;

  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0;

  color: #212121;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.uppercase {
  text-transform: uppercase;
}
</style>