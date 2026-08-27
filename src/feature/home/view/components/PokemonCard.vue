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
</script>

<template>
  <div
      class="
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
      :style="{ backgroundColor: hexToRgba(primaryColor, 0.42) }"
      @click="goToDetail"
  >
    <!-- Información -->
    <div class="flex flex-col text-left min-w-0 pr-3 gap-1">
      <p class="text-xs">Nº{{ paddedId }}</p>

      <p
          class="truncate"
          style="font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 21px; line-height: 100%; letter-spacing: 0;"
      >
        {{ pokemon.name }}
      </p>

      <div class="flex flex-nowrap gap-1 overflow-hidden">
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
