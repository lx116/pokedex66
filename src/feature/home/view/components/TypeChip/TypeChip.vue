<script setup lang="ts">
import type { PokemonTypeMeta } from "@/core/models/typeMeta";

const props = defineProps<{
  type: PokemonTypeMeta;
  selected: boolean;
  compact?: boolean;
  forceWhiteText?: boolean;
}>()

defineEmits<{
  toggle: [];
}>()

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6
}

function textColor(): string {
  if (props.forceWhiteText) return '#fff'
  return isLightColor(props.type.color) ? '#1a1a1a' : '#fff'
}
</script>

<template>
  <button
      type="button"
      class="type-chip"
      :class="{ compact }"
      :style="selected ? {
        backgroundColor: type.color,
        color: textColor(),
      } : {}"
      @click="$emit('toggle')"
  >
    <span class="icon-badge">
      <img
          :src="type.iconUrl"
          :alt="type.spanishName"
          :class="{ 'icon-muted': !selected }"
      />
    </span>
    <span :class="{ 'compact-label': compact }">{{ type.spanishName }}</span>
  </button>
</template>

<style scoped>

.type-chip {
  display: inline-flex;
  align-items: center;

  border-radius: 48.61px;

  padding: 2.9px 6px;
  gap: 5.8px;

  background-color: #E0E0E0;
  color: #757575;

  border: none;
  cursor: pointer;

  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;

  transition: background-color .2s ease, color .2s ease;
}

.icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;
  flex-shrink: 0;

  border-radius: 50%;
  background: #fff;
}

.icon-badge img {
  width: 13px;
  height: 13px;

  transition: filter .2s ease, opacity .2s ease;
}

.icon-muted {
  filter: grayscale(1);
  opacity: .45;
}

.type-chip.compact {
  padding: 2px 5px;
  gap: 4px;
  font-size: 11px;
}

.type-chip.compact .icon-badge {
  width: 15px;
  height: 15px;
}

.type-chip.compact .icon-badge img {
  width: 9px;
  height: 9px;
}

.compact-label {
  display: inline-block;
  max-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
