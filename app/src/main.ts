import { createApp } from 'vue';
import VueCookies from 'vue-cookies';
import App from './App.vue';
import router from './router';
import './assets/style.css';
import mediumZoom from './plugins/medium-zoom';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App);

app.use(VueCookies, { expires: '7d' });
app.use(router);
app.use(mediumZoom);
app.use(ToastPlugin);
app.mount('#app');
