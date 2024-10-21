import { createApp } from 'vue';
import VueCookies from 'vue-cookies';
import App from './App.vue';
import router from './router';
import './assets/style.css';
import mediumZoom from './plugins/medium-zoom';

const app = createApp(App);

app.use(VueCookies, { expires: '7d' });
app.use(router);
app.use(mediumZoom);
app.mount('#app');
