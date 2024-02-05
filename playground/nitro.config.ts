import nitroPort from "../src";

export default defineNitroConfig({
  modules: [
    nitroPort({
      port: 4000,
    }),
  ],
});
