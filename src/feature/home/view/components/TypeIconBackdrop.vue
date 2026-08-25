<script setup lang="ts">
import { computed, type CSSProperties } from "vue";

const props = withDefaults(defineProps<{
  iconUrl: string;
  width?: number;
  height?: number;
}>(), {
  width: 126,
  height: 102,
});

const styles = computed<CSSProperties & Record<`--${string}`, string>>(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  "--icon-url": `url("${props.iconUrl}")`,
}));
</script>

<template>
  <div
      class="type-icon-backdrop"
      :style="styles"
  />
</template>

<style scoped>
.type-icon-backdrop {
  position: absolute;
  top: 0;
  right: 0;

  pointer-events: none;

  opacity: 1;

  background: linear-gradient(
      147.44deg,
      #ffffff 0.68%,
      rgba(255, 255, 255, 0) 101.63%
  );

  -webkit-mask-image: var(--icon-url);
  mask-image: var(--icon-url);

  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  -webkit-mask-position: center;
  mask-position: center;

  -webkit-mask-size: 108px 108px;
  mask-size: 100px 96px;
}
</style>