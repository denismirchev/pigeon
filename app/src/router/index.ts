import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../components/auth/UserLogin.vue';
import UserRegister from "@/components/auth/UserRegister.vue";
import RouteNotFound from '../components/RouteNotFound.vue';
import HomePage from "@/components/HomePage.vue";

const routes = [
    { path: '/login', component: UserLogin },
    { path: '/register', component: UserRegister },

    { path: '/', component: HomePage },

    { path: '/:pathMatch(.*)*', component: RouteNotFound } // Catch-all route for 404
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;