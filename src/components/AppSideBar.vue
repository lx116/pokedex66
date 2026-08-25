<script setup lang="ts">
import {
  HomeIcon,
  HeartIcon,
  UserIcon,
    GlobeAltIcon
} from '@heroicons/vue/24/solid'

import pokedexIcon from '../assets/pokedex_icon.png'

const navigation = [
  { name: 'Pokedex', icon: HomeIcon, href: '/' },
  { name: 'Regiones', icon: GlobeAltIcon, href: '/regions' },
  { name: 'Favoritos', icon: HeartIcon, href: '/favorites' },
  { name: 'Perfil', icon: UserIcon, href: '/profile' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Desktop Sidebar -->
    <aside
        class="
        hidden md:flex
        fixed left-0 top-0
        h-screen w-64
        flex-col
        border-r border-gray-200
        bg-white
      "
    >
      <!-- Logo -->
      <div class="flex h-16 gap-3 items-center px-6">
        <img
            :src="pokedexIcon"
            alt="Pokedex 66"
            class="h-8 w-8 object-contain"
        />
        <h1 class="text-xl font-semibold">
          Pokedex 66
        </h1>
      </div>

      <!-- Navigation -->
      <nav class="flex flex-1 flex-col gap-2 px-4 py-4">
        <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="
            flex items-center gap-3
            rounded-lg
            px-3 py-2
            text-gray-600
            transition
            hover:bg-gray-100
            hover:text-gray-900
          "
            active-class="bg-blue-100 text-blue-700"
        >
          <component
              :is="item.icon"
              class="h-5 w-5"
          />

          <span>
            {{ item.name }}
          </span>
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main
        class="
        min-h-screen
        pb-20
        md:pb-0
        md:pl-64
      "
    >
      <div class="p-4 md:p-8">
        <RouterView />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav
        class="
        md:hidden
        fixed bottom-0 left-0 right-0
        z-50
        border-t border-gray-200
        bg-white
      "
    >
      <div class="flex h-16 items-center justify-around">
        <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="
            flex flex-1
            flex-col
            items-center
            justify-center
            gap-1
            text-xs
            text-gray-500
          "
            active-class="text-gray-900"
        >
          <component
              :is="item.icon"
              class="h-5 w-5"
          />

          <span>
            {{ item.name }}
          </span>
        </RouterLink>
      </div>
    </nav>

  </div>
</template>