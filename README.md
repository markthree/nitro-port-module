# nitro-port-module

Allow changing the nitro default port

<br />

## README 🦉

[简体中文](./README_CN.md) | English

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

#### polyfill

Default automatic detection

```ts
// nuxt.config.ts
import nitroPort from "nitro-port-module";

export default defineNuxtConfig({
  nitro: {
    modules: [
      nitroPort({
        port: 4000,
        polyfill(nitro, port) {
          return nitro.options.preset.includes("deno")
            ? `Deno.env.set("PORT", "${port}")`
            : `process.env.PORT = '${port}'`;
        },
      }),
    ],
  },
});
```

### compatible

In older versions of Nuxt3, there might not be Nitro modules. In this case, you
can try using the following configuration.

```ts
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
```

<br />

## License

Made with [markthree](https://github.com/markthree)

Published under [MIT License](./LICENSE).
