<script setup lang="ts">
import {ref} from "vue";
import {ArrowLeftIcon, HeartIcon as HeartOutlineIcon} from "@heroicons/vue/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/vue/24/solid";

defineEmits<{
  back: [];
}>();

const isFavorite = ref(false);
</script>

<template>
  <div class="detail-header">
    <button
        type="button"
        class="icon-button"
        aria-label="Volver"
        @click="$emit('back')"
    >
      <ArrowLeftIcon class="icon"/>
    </button>

    <button
        type="button"
        class="icon-button"
        :aria-label="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        @click="isFavorite = !isFavorite"
    >
      <component :is="isFavorite ? HeartSolidIcon : HeartOutlineIcon" class="icon"/>
    </button>
  </div>
</template>

<style scoped>
.detail-header {
  position: relative;
  z-index: 2;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 16px 20px;
}

.icon-button {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  border: none;
  cursor: pointer;

  color: #fff;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
