import { createApp } from 'vue';
import VueCookies from 'vue-cookies';
import App from './App.vue';
import router from './router';
import './assets/style.css';

console.log(process.env);

createApp(App).use(VueCookies, { expires: '7d' }).use(router).mount('#app');
