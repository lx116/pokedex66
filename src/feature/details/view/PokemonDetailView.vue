<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ArrowsUpDownIcon, ScaleIcon, Squares2X2Icon} from "@heroicons/vue/24/outline";
import {POKEMON_TYPES, type PokemonTypeMeta} from "@/core/models/typeMeta";
import {formatDecimalEs} from "@/core/utils/format";
import {usePokemonDetailViewModel} from "@/feature/details/viewmodel/usePokemonDetailViewModel";
import TypeChip from "@/feature/home/view/components/TypeChip.vue";
import TypeIconBackdrop from "@/feature/home/view/components/TypeIconBackdrop.vue";
import PokeballLoader from "@/components/PokeballLoading.vue";
import ErrorMessage from "@/feature/home/view/components/ErrorMessage.vue";
import NotFoundMessage from "@/feature/home/view/components/NotFoundMessage.vue";
import DetailHeader from "./components/DetailHeader.vue";
import StatCard from "./components/StatCard.vue";
import GenderBar from "./components/GenderBar.vue";
import PokeballThrow from "@/components/PokeballThrow.vue";

const route = useRoute();
const router = useRouter();
const {pokemon, loading, error, notFound, findPokemon} = usePokemonDetailViewModel();

const revealed = ref(false);
const showErrorPage = ref(false);
const showNotFoundPage = ref(false);
const spriteRevealed = ref(false);

watch(loading, (isLoading) => {
  if (isLoading) {
    revealed.value = false;
    showErrorPage.value = false;
    showNotFoundPage.value = false;
  }
});

watch(
    () => route.params.name,
    (newName) => {
      if (typeof newName === "string") {
        spriteRevealed.value = false;
        findPokemon(newName);
      }
    },
    {immediate: true},
);

function retry() {
  showErrorPage.value = false;
  const name = route.params.name;
  if (typeof name === "string") findPokemon(name);
}

function goBack() {
  router.back();
}

function lookupTypes(names: string[]): PokemonTypeMeta[] {
  return names
      .map(name => POKEMON_TYPES.find(type => type.name === name))
      .filter((type): type is PokemonTypeMeta => !!type);
}

const typeMetas = computed(() => lookupTypes(pokemon.value?.types ?? []));
const weaknessMetas = computed(() => lookupTypes(pokemon.value?.weaknesses ?? []));

const primaryColor = computed(() => typeMetas.value[0]?.color ?? "#9E9E9E");
const paddedId = computed(() => String(pokemon.value?.id ?? 0).padStart(3, "0"));
const weightKg = computed(() => formatDecimalEs((pokemon.value?.weight ?? 0) / 10));
const heightM = computed(() => formatDecimalEs((pokemon.value?.height ?? 0) / 10));
</script>

<template>
  <div class="-m-4 md:-m-8">
  <div
      v-if="!revealed && !showErrorPage && !showNotFoundPage"
      class="min-h-screen flex items-center justify-center"
  >
    <PokeballLoader
        :loading="loading"
        :error="!!error"
        :not-found="notFound"
        @complete="revealed = true"
        @error-complete="showErrorPage = true"
        @not-found-complete="showNotFoundPage = true"
    />
  </div>

  <ErrorMessage v-else-if="showErrorPage" @retry="retry"/>

  <NotFoundMessage v-else-if="showNotFoundPage"/>

  <div v-else-if="pokemon" class="pokemon-detail">
    <div class="pokemon-detail-hero-wrap">
      <div class="pokemon-detail-hero" :style="{ backgroundColor: primaryColor }">
        <DetailHeader @back="goBack"/>

        <TypeIconBackdrop
            v-if="typeMetas[0]"
            :icon-url="typeMetas[0].iconUrl"
            :width="260"
            :height="260"
            mask-size="220px 220px"
            position="center"
        />
      </div>

      <div class="pokemon-detail-sprite-slot">
        <PokeballThrow v-if="!spriteRevealed" :show-puff="false" @complete="spriteRevealed = true"/>

        <img
            v-else
            class="pokemon-detail-sprite pokemon-detail-sprite-reveal"
            :src="pokemon.imageURL ?? ''"
            :alt="pokemon.name"
        />
      </div>
    </div>

    <div class="pokemon-detail-content">
      <h1 class="pokemon-detail-name">{{ pokemon.name }}</h1>
      <p class="pokemon-detail-number">Nº{{ paddedId }}</p>

      <div class="pokemon-detail-types">
        <TypeChip
            v-for="type in typeMetas"
            :key="type.name"
            :type="type"
            :selected="true"
            force-white-text
        />
      </div>

      <p v-if="pokemon.description" class="pokemon-detail-description">
        {{ pokemon.description }}
      </p>

      <hr class="pokemon-detail-divider"/>

      <div class="pokemon-detail-stats">
        <StatCard label="Peso" :value="`${weightKg} kg`">
          <template #icon>
            <ScaleIcon/>
          </template>
        </StatCard>

        <StatCard label="Altura" :value="`${heightM} m`">
          <template #icon>
            <ArrowsUpDownIcon/>
          </template>
        </StatCard>

        <StatCard label="Categoría" :value="pokemon.category" uppercase-value>
          <template #icon>
            <Squares2X2Icon/>
          </template>
        </StatCard>

        <StatCard label="Habilidad" :value="pokemon.ability">
          <template #icon>

          </template>
        </StatCard>
      </div>

      <GenderBar v-if="pokemon.genderRate >= 0" class="pokemon-detail-gender" :gender-rate="pokemon.genderRate"/>

      <template v-if="weaknessMetas.length">
        <h2 class="pokemon-detail-weaknesses-title">Debilidades</h2>

        <div class="pokemon-detail-weaknesses">
          <TypeChip
              v-for="type in weaknessMetas"
              :key="type.name"
              :type="type"
              :selected="true"
              force-white-text
          />
        </div>
      </template>
    </div>
  </div>
  </div>
</template>

<style scoped>
.pokemon-detail {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;

  background: #fff;
}

.pokemon-detail-hero-wrap {
  position: relative;
  width: 100%;
}

.pokemon-detail-hero {
  position: relative;
  width: 100%;
  padding-bottom: 220px;

  display: flex;
  flex-direction: column;
  align-items: center;

  border-bottom-left-radius: 50% 22%;
  border-bottom-right-radius: 50% 22%;

  overflow: hidden;
}

.pokemon-detail-sprite-slot {
  position: absolute;
  left: 50%;
  bottom: -200px;
  z-index: 2;

  width: 400px;
  height: 400px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translateX(-50%);
}

.pokemon-detail-sprite {
  width: 400px;
  height: 400px;

  object-fit: contain;
}

.pokemon-detail-sprite-reveal {
  animation: spriteReveal .35s cubic-bezier(.22, .8, .3, 1) both;
}

@keyframes spriteReveal {
  from {
    opacity: 0;
    transform: scale(.85);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.pokemon-detail-content {
  width: 100%;

  display: flex;
  flex-direction: column;

  margin-top: 96px;

  padding: 20px 16px;
}

.pokemon-detail-name {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 32px;
  color: #1a1a1a;

  text-transform: capitalize;
}

.pokemon-detail-number {
  font-size: 14px;
  color: #757575;
  margin-top: 4px;
}

.pokemon-detail-types {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.pokemon-detail-description {
  margin-top: 20px;
  font-size: 15px;
  line-height: 1.5;
  color: #424242;
}

.pokemon-detail-divider {
  margin: 24px 0;
  border: none;
  border-top: 1px solid #e0e0e0;
}

.pokemon-detail-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 16px 12px;
}

.pokemon-detail-gender {
  margin-top: 28px;
}

.pokemon-detail-weaknesses-title {
  margin-top: 32px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 22px;
  color: #1a1a1a;
}

.pokemon-detail-weaknesses {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

@media (min-width: 768px) {
  .pokemon-detail-content {
    max-width: 640px;

    margin-left: auto;
    margin-right: auto;

    padding-left: 32px;
    padding-right: 32px;
  }
}

</style>
