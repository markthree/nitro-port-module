import nitroPort from "../../src";

export default defineNuxtConfig({
  nitro: {
    modules: [
      nitroPort({
        port: 5000,
        override: true,
      }),
    ],
  },
});
