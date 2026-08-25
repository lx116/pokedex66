import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from "../core/layout/AppLayout.vue";
import HomeView from "../feature/home/view/HomeView.vue";
import ComingSoonView from "@/feature/coming_soon/view/ComingSoonView.vue";

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
            ]
        },
    ],
})

export default router
