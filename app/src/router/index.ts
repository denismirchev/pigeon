import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../components/auth/UserLogin.vue';
import RouteNotFound from '../components/RouteNotFound.vue';
import HomePage from "@/components/HomePage.vue";

const routes = [
    { path: '/', component: HomePage },
    { path: '/login', component: UserLogin },
    { path: '/:pathMatch(.*)*', component: RouteNotFound } // Catch-all route for 404
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;