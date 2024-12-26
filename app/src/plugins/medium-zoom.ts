import { App } from 'vue';
import mediumZoom from 'medium-zoom';

export default {
  install(app: App) {
    // Create a zoom instance and make it globally available
    const zoom = mediumZoom();
    const appConfig = app.config;
    appConfig.globalProperties.$zoom = zoom;

    // You can also set default options globally here
    zoom.update({
      background: 'rgba(0, 0, 0, 0.7)', // for example, setting the background color
      margin: 20,
    });

    // Initialize zoom on mounted images (you can customize the selector as needed)
    app.directive('zoom', {
      mounted(el: HTMLElement) {
        zoom.attach(el);
      },
      unmounted(el: HTMLElement) {
        zoom.detach(el);
      },
    });
  },
};
