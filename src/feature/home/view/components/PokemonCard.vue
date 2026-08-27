<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Pokemon } from "@/core/models/pokemonModel";
import { POKEMON_TYPES, type PokemonTypeMeta } from "@/core/models/typeMeta";
import { hexToRgba } from "@/core/utils/color";
import { useFavoritePokemonStore } from "@/core/store/useFavoritePokemonStore";
import TypeChip from "./TypeChip/TypeChip.vue";
import TypeIconBackdrop from "./TypeIconBackdrop.vue";
import favoriteIcon from "@/assets/favorite.svg";
import favoriteEmptyIcon from "@/assets/favorite_empty.svg";

const props = defineProps<{
  pokemon: Pokemon
}>()

const router = useRouter();
const favoriteStore = useFavoritePokemonStore();

const isFavorite = computed(() => favoriteStore.isFavorite(props.pokemon.name));

function goToDetail() {
  router.push({ name: 'pokemon-detail', params: { name: props.pokemon.name } })
}

function toggleFavorite() {
  favoriteStore.toggleFavorite(props.pokemon.name)
}

const typeMetas = computed<PokemonTypeMeta[]>(() =>
    props.pokemon.types
        .map(name => POKEMON_TYPES.find(type => type.name === name))
        .filter((type): type is PokemonTypeMeta => !!type)
)

const primaryColor = computed(() => typeMetas.value[0]?.color ?? '#9E9E9E')

const paddedId = computed(() => String(props.pokemon.id).padStart(3, '0'))

const cardStyle = computed(() => ({
  backgroundColor: hexToRgba(primaryColor.value, 0.42),
  '--pokemon-color': primaryColor.value,
  '--pokemon-glow': hexToRgba(primaryColor.value, 0.45),
}))
</script>

<template>
  <div
      class="
      pokemon-card
      w-full
      max-w-82
      h-25.5
      rounded-2xl
      pl-4
      flex
      items-center
      justify-between
      overflow-hidden
      cursor-pointer
      isolate
    "
      :style="cardStyle"
      @click="goToDetail"
  >
    <!-- Información -->
    <div class="flex flex-col text-left min-w-0 pr-3 gap-1">
      <p class="text-xs">Nº{{ paddedId }}</p>

      <p
          class="truncate leading-6"
          style="font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 21px;"
      >
        {{ pokemon.name }}
      </p>

      <div class="flex flex-nowrap gap-1 overflow-hidden mt-1">
        <TypeChip
            v-for="type in typeMetas"
            :key="type.name"
            :type="type"
            :selected="true"
            compact
            force-white-text
        />
      </div>
    </div>

    <!-- Imagen -->
    <div
        class="
    relative
    w-31.5
    h-full
    shrink-0
    flex
    items-center
    justify-center
    overflow-hidden
    rounded-2xl
  "
        :style="{ backgroundColor: hexToRgba(primaryColor, 0.72) }"
    >
      <TypeIconBackdrop
          v-if="typeMetas[0]"
          :icon-url="typeMetas[0].iconUrl"
      />

      <img
          v-if="pokemon.imageURL"
          :src="pokemon.imageURL"
          :alt="pokemon.name"
          class="
      pokemon-image
      relative
      z-10
      w-20.5
      h-20.5
      object-contain
    "
      />

      <button
          type="button"
          class="absolute top-2 right-2 z-20 w-8 h-8"
          :aria-label="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          @click.stop="toggleFavorite"
      >
        <img
            :src="isFavorite ? favoriteIcon : favoriteEmptyIcon"
            alt=""
            class="w-full h-full"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>

.pokemon-card {
  border: 1px solid transparent;

  transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      border-color 180ms ease;

  will-change: transform;
}

@media (hover: hover) and (pointer: fine) {
  .pokemon-card:hover {
    transform: scale(1.025);

    border-color: var(--pokemon-color);

    box-shadow:
        0 0 0 1px var(--pokemon-color),
        0 4px 14px var(--pokemon-glow),
        0 0 18px var(--pokemon-glow);
  }
}

.pokemon-card:active {
  transform: scale(0.985);
}

.pokemon-image {
  transition: transform 220ms cubic-bezier(0.22, 0.8, 0.25, 1);
}

@media (hover: hover) and (pointer: fine) {
  .pokemon-card:hover .pokemon-image {
    transform: scale(1.5) translateY(-1px);
  }
}
</style>
