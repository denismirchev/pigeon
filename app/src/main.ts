import { createApp } from 'vue';
import VueCookies from 'vue-cookies';
import ToastPlugin from 'vue-toast-notification';
import router from './router';
import './assets/style.css';
import mediumZoom from './plugins/medium-zoom';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import App from './App.vue';

const app = createApp(App);

app.use(VueCookies, { expires: '7d' });
app.use(router);
app.use(mediumZoom);
app.use(ToastPlugin);

app.config.globalProperties.$apiUrl = process.env.VUE_APP_API_URL;

app.mount('#app');
