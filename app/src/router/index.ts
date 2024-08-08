import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/main/Home.vue';
import UserRegister from '@/components/auth/UserRegister.vue';
import UserLogin from '@/components/auth/UserLogin.vue';
import RouteNotFound from '@/components/RouteNotFound.vue';
import SinglePost from '@/components/main/SinglePost.vue';
import { inject } from 'vue';
import { VueCookies } from 'vue-cookies';

const routes = [
  { path: '/', redirect: '/home' }, // Redirect root path to /home
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  { path: '/home', component: Home },
  { path: '/:username/:id', component: SinglePost },
  { path: '/:pathMatch(.*)*', component: RouteNotFound }, // Catch-all route for 404
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const cookies = inject<VueCookies>('$cookies');
  if (!cookies) {
    throw new Error('Vue cookies module not found');
  }

  const hasAccessToken = cookies.get('accessToken');
  const hasRefreshToken = cookies.get('refreshToken');

  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(to.path);
  const is404Path = !routes.some((route) => route.path === to.path);

  const requiresAuth = !isPublicPath && !is404Path;

  console.log('requiresAuth', requiresAuth);

  if (requiresAuth && !hasAccessToken && !hasRefreshToken) {
    next('/login');
  } else {
    next();
  }
});

export default router;