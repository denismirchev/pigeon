import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/main/Home.vue';
import UserRegister from '@/components/auth/UserRegister.vue';
import UserLogin from '@/components/auth/UserLogin.vue';
import RouteNotFound from '@/components/RouteNotFound.vue';
import SinglePost from '@/components/main/SinglePost.vue';
import SettingsPage from '@/components/main/SettingsPage.vue';
import UserProfilePage from '@/components/main/UserProfilePage.vue';
import { useCookies } from 'vue3-cookies';

const routes = [
  { path: '/', redirect: '/home' }, // Redirect root path to /home
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  { path: '/home', component: Home },
  { path: '/:username/:id', component: SinglePost },
  { path: '/:username', component: UserProfilePage },
  { path: '/settings', component: SettingsPage },
  { path: '/:pathMatch(.*)*', component: RouteNotFound }, // Catch-all route for 404
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const { cookies } = useCookies();

// Check if the user is authenticated before navigating to certain routes
router.beforeEach((to, from, next) => {
  const hasAccessToken = cookies.get('accessToken');
  const hasRefreshToken = cookies.get('refreshToken');

  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(to.path);
  const is404Path = !routes.some((route) => route.path === to.path);

  const requiresAuth = !isPublicPath && !is404Path;

  if (requiresAuth && !hasAccessToken && !hasRefreshToken) {
    next('/login');
  } else {
    next();
  }
});

export default router;
