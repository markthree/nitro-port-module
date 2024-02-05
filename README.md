# nitro-port-module

Allow changing the nitro default port

<br />

## Usage

### install

```shell
npm i nitro-port-module -D
```

### Configuration Module

> nuxt

```ts
// nuxt.config.ts
import nitroPort from "nitro-port-module";

export default defineNuxtConfig({
  nitro: {
    modules: [
      nitroPort({
        port: 4000,
      }),
    ],
  },
});
```

> nitro

```ts
// nitro.config.js
import nitroPort from "nitro-port-module";

export default defineNitroConfig({
  modules: [
    nitroPort({
      port: 4000,
    }),
  ],
});
```

<br />

## License

Made with [markthree](https://github.com/markthree)

Published under [MIT License](./LICENSE).
