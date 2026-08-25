<script setup lang="ts">
import { ref, watch } from "vue";
import { usePokemonStore } from "../../store/usePokemonStore";
import { POKEMON_TYPES } from "@/core/models/typeMeta";

const props = defineProps<{
  open: boolean;
}>()

const emit = defineEmits<{
  close: [];
}>()

const store = usePokemonStore()
const { applyTypeFilters } = store

const draftSelection = ref<string[]>([])
const typeSectionExpanded = ref(true)

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    draftSelection.value = [...store.selectedTypes]
  }
})

function toggleDraft(typeName: string) {
  const index = draftSelection.value.indexOf(typeName)

  if (index === -1) {
    draftSelection.value.push(typeName)
  } else {
    draftSelection.value.splice(index, 1)
  }
}

async function apply() {
  await applyTypeFilters(draftSelection.value)
  emit('close')
}

function cancel() {
  emit('close')
}
</script>

<template>
  <Transition name="sheet">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/50" @click="cancel"></div>

      <div class="relative bg-white w-full rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
        <button type="button" @click="cancel" class="absolute top-4 left-4 text-2xl leading-none text-gray-500">
          &times;
        </button>

        <h2 class="text-xl font-bold text-center mt-2 mb-6">
          Filtra por tus preferencias
        </h2>

        <button
            type="button"
            class="flex items-center justify-between w-full py-2 font-semibold border-b border-gray-200"
            @click="typeSectionExpanded = !typeSectionExpanded"
        >
          Tipo
          <span>{{ typeSectionExpanded ? '▲' : '▼' }}</span>
        </button>

        <ul v-if="typeSectionExpanded" class="divide-y divide-gray-100">
          <li
              v-for="type in POKEMON_TYPES"
              :key="type.name"
              class="flex items-center justify-between py-3"
          >
            <label class="flex items-center gap-3">
              <img :src="type.iconUrl" :alt="type.spanishName" class="w-5 h-5" />
              {{ type.spanishName }}
            </label>

            <input
                type="checkbox"
                :checked="draftSelection.includes(type.name)"
                @change="toggleDraft(type.name)"
            />
          </li>
        </ul>

        <div class="mt-6 flex flex-col gap-3">
          <button
              type="button"
              @click="apply"
              class="bg-blue-600 text-white font-bold py-3 rounded-full"
          >
            Aplicar
          </button>
          <button
              type="button"
              @click="cancel"
              class="bg-gray-100 text-gray-900 font-bold py-3 rounded-full"
          >
            Cancelar
          </button>
        </div>

        <div class="mx-auto mt-4 h-1 w-10 rounded-full bg-gray-300"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity .25s ease;
}

.sheet-enter-active .relative,
.sheet-leave-active .relative {
  transition: transform .25s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .relative,
.sheet-leave-to .relative {
  transform: translateY(100%);
}

</style>
