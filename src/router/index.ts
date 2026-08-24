import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from "../core/layout/AppLayout.vue";
import HomeView from "../feature/home/view/HomeView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: AppLayout,
            children: [
                {path: '', component: HomeView},
            ]
        },
    ],
})

export default router
