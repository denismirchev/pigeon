import mediumZoom from 'medium-zoom';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $apiUrl: string;
    $zoom: ReturnType<typeof mediumZoom>;
  }
}
