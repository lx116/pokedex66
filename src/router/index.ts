import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from "../core/layout/AppLayout.vue";
import HomeView from "../feature/home/view/HomeView.vue";
import ComingSoonView from "@/feature/coming_soon/view/ComingSoonView.vue";
import PokemonDetailView from "@/feature/details/view/PokemonDetailView.vue";
import FavoritesView from "@/feature/favorites/FavoritesView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: AppLayout,
            children: [
                {path: '', component: HomeView},
                {path: 'regions', component: ComingSoonView},
                {path: 'pokemon/:name', name: 'pokemon-detail', component: PokemonDetailView},
                {path: 'favorites', name: 'favorites', component: FavoritesView},
            ]
        },
    ],
})

export default router
