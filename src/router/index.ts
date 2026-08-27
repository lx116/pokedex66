import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from "../core/layout/AppLayout.vue";
import HomeView from "../feature/home/view/HomeView.vue";
import ComingSoonView from "@/feature/comingSoon/view/ComingSoonView.vue";
import PokemonDetailView from "@/feature/details/view/PokemonDetailView.vue";
import FavoritesView from "@/feature/favorites/FavoritesView.vue";
import OnboardingView from "@/feature/onboarding/view/OnboardingView.vue";
import ProfileView from "@/feature/profile/view/ProfileView.vue";
import {isOnboardingDone} from "@/core/utils/onboarding";
import NotFoundView from "@/feature/notFound/NotFoundView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/onboarding',
            name: 'onboarding',
            component: OnboardingView,
        },
        {
            path: '/404',
            name: 'notfound',
            component: NotFoundView,
        },
        {
            path: '/',
            name: 'home',
            component: AppLayout,
            children: [
                {path: '', component: HomeView},
                {path: 'regions', component: ComingSoonView},
                {path: 'pokemon/:name', name: 'pokemon-detail', component: PokemonDetailView},
                {path: 'favorites', name: 'favorites', component: FavoritesView},
                {path: 'profile', name: 'profile', component: ProfileView},
            ]
        },
        {path: '/:pathMatch(.*)*', redirect: {name: 'notfound'}},
    ],
})

router.beforeEach((to) => {
    const onboardingDone = isOnboardingDone()

    if (!onboardingDone && to.name !== 'onboarding') {
        return {name: 'onboarding'}
    }

    if (onboardingDone && to.name === 'onboarding') {
        return {name: 'notfound'}
    }
})

export default router
