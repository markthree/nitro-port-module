# nitro-port-module

允许改变 nitro 默认 port

<br />

## README 🦉

简体中文 | [English](./README.md)

<br />

## 使用

### 安装

```shell
npm i nitro-port-module -D
```

### 配置模块

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

默认自动检测

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

### 兼容性

在旧版本的 Nuxt3 中，可能没有 Nitro 模块。在这种情况下，您可以尝试使用以下配置。

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
