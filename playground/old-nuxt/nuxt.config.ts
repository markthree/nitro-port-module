import { ViteNitroPort } from "nitro-port-module";

export default defineNuxtConfig({
  devServer: {
    port: 5000,
  },
  vite: {
    plugins: [
      ViteNitroPort({
        port: 5000,
      }),
    ],
  },
});
