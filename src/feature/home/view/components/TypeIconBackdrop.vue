<script setup lang="ts">
import { computed, type CSSProperties } from "vue";

const props = withDefaults(defineProps<{
  iconUrl: string;
  width?: number;
  height?: number;
  maskSize?: string;
  position?: "corner" | "center";
}>(), {
  width: 126,
  height: 102,
  maskSize: "100px 96px",
  position: "corner",
});

const styles = computed<CSSProperties & Record<`--${string}`, string>>(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  "--icon-url": `url("${props.iconUrl}")`,
  "--mask-size": props.maskSize,
}));
</script>

<template>
  <div
      class="type-icon-backdrop"
      :class="`type-icon-backdrop--${position}`"
      :style="styles"
  />
</template>

<style scoped>
.type-icon-backdrop {
  position: absolute;

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
  mask-size: var(--mask-size);
}

.type-icon-backdrop--corner {
  top: 0;
  right: 0;
}

.type-icon-backdrop--center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>