import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/style.css';
import VueCookies from 'vue-cookies';

console.log(process.env);

createApp(App).use(VueCookies, { expires: '7d' }).use(router).mount('#app');
