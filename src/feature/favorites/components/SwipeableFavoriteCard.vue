<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { Pokemon } from "@/core/models/pokemonModel";
import PokemonCard from "@/feature/home/view/components/PokemonCard.vue";
import { openSwipeId } from "../state/swipeState";

const props = defineProps<{
  pokemon: Pokemon;
}>();

const emit = defineEmits<{
  remove: [];
}>();

const DELETE_WIDTH = 72;
const DRAG_THRESHOLD = 7;
const OPEN_THRESHOLD = DELETE_WIDTH * 0.4;
const RESISTANCE = 0.28;

const offsetX = ref(0);
const isDragging = ref(false);
const isDeleting = ref(false);

let dragged = false;
let pointerId: number | null = null;

let startX = 0;
let startOffset = 0;

function applyResistance(raw: number): number {
  // pequeña resistencia hacia la derecha
  if (raw > 0) {
    return raw * 0.08;
  }

  // desplazamiento normal
  if (raw >= -DELETE_WIDTH) {
    return raw;
  }

  // resistencia después del botón
  const overflow = raw + DELETE_WIDTH;

  return -DELETE_WIDTH + overflow * RESISTANCE;
}

function closeSwipe() {
  offsetX.value = 0;

  if (openSwipeId.value === props.pokemon.id) {
    openSwipeId.value = null;
  }
}

function openSwipe() {
  offsetX.value = -DELETE_WIDTH;
  openSwipeId.value = props.pokemon.id;
}

function onPointerDown(event: PointerEvent) {
  if (isDeleting.value) return;

  isDragging.value = true;
  dragged = false;

  pointerId = event.pointerId;

  startX = event.clientX;
  startOffset = offsetX.value;
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value) return;

  const deltaX = event.clientX - startX;

  if (!dragged && Math.abs(deltaX) > DRAG_THRESHOLD) {
    dragged = true;

    const target = event.currentTarget as HTMLElement;

    if (pointerId !== null) {
      target.setPointerCapture(pointerId);
    }

    openSwipeId.value = props.pokemon.id;
  }

  if (!dragged) return;

  offsetX.value = applyResistance(startOffset + deltaX);
}

function onPointerUp(event: PointerEvent) {
  if (!isDragging.value) return;

  isDragging.value = false;

  const target = event.currentTarget as HTMLElement;

  if (
      pointerId !== null &&
      target.hasPointerCapture(pointerId)
  ) {
    target.releasePointerCapture(pointerId);
  }

  pointerId = null;

  if (!dragged) return;

  if (Math.abs(offsetX.value) >= OPEN_THRESHOLD) {
    openSwipe();
  } else {
    closeSwipe();
  }
}

function guardClickAfterDrag(event: MouseEvent) {
  if (dragged) {
    event.preventDefault();
    event.stopPropagation();

    requestAnimationFrame(() => {
      dragged = false;
    });

    return;
  }

  if (offsetX.value !== 0) {
    event.preventDefault();
    event.stopPropagation();

    closeSwipe();
  }
}

function onDeleteClick() {
  if (isDeleting.value) return;

  isDeleting.value = true;

  offsetX.value = -400;

  setTimeout(() => {
    emit("remove");
  }, 240);
}

watch(openSwipeId, (id) => {
  if (
      id !== props.pokemon.id &&
      offsetX.value !== 0 &&
      !isDeleting.value
  ) {
    closeSwipe();
  }
});

const progress = computed(() =>
    Math.min(1, Math.abs(offsetX.value) / DELETE_WIDTH)
);

const contentStyle = computed(() => ({
  transform: `translate3d(${offsetX.value}px, 0, 0)`,
}));

const deleteIconStyle = computed(() => ({
  opacity: 0.45 + progress.value * 0.55,
  transform: `scale(${0.85 + progress.value * 0.15})`,
}));
</script>

<template>
  <div
      class="swipe-item"
      :class="{ 'swipe-item-deleting': isDeleting }"
  >
    <!-- Acción de eliminar -->
    <button
        type="button"
        class="swipe-delete"
        aria-label="Eliminar de favoritos"
        @click.stop="onDeleteClick"
    >
      <TrashIcon
          class="swipe-delete-icon"
          :style="deleteIconStyle"
      />
    </button>

    <!-- Card que se mueve -->
    <div
        class="swipe-content"
        :class="{
        'swipe-content-dragging': isDragging,
        'swipe-content-deleting': isDeleting
      }"
        :style="contentStyle"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @click.capture="guardClickAfterDrag"
    >
      <PokemonCard :pokemon="pokemon" />
    </div>
  </div>
</template>

<style scoped>
.swipe-item {
  position: relative;

  /* MUY IMPORTANTE:
     mismo ancho que PokemonCard */
  width: 100%;
  max-width: 328px;

  overflow: hidden;

  border-radius: 16px;

  isolation: isolate;
}

.swipe-delete {
  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;

  width: 72px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: none;

  background: #ef5350;
  color: white;

  cursor: pointer;

  z-index: 0;

  -webkit-tap-highlight-color: transparent;
}

.swipe-delete-icon {
  width: 24px;
  height: 24px;

  transition:
      opacity 100ms linear,
      transform 100ms linear;
}

.swipe-content {
  position: relative;

  width: 100%;

  z-index: 1;

  will-change: transform;

  touch-action: pan-y;

  transition:
      transform 260ms cubic-bezier(
          0.22,
          0.8,
          0.25,
          1
      );
}

.swipe-content-dragging {
  transition: none;
}

.swipe-content-deleting {
  transition:
      transform 240ms cubic-bezier(
          0.4,
          0,
          0.2,
          1
      );
}

.swipe-item-deleting {
  pointer-events: none;

  animation: remove-item 240ms ease forwards;
}

@keyframes remove-item {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>