# nitro-port-module

允许改变 nitro 默认 port

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
    modules: [nitroPort()],
  },
});
```

> nitro

```ts
// nitro.config.js
import nitroPort from "nitro-port-module";

export default defineNitroConfig({
  modules: [nitroPort()],
});
```

<br />

### preset

```ts
// nitro.config.js
import nitroPort from "nitro-port-module";

export default defineNitroConfig({
  modules: [
    nitroPort({
      // 支持 "spa", "ssg"，"fallback" and false (禁用)，默认为 "fallback"
      preset: "fallback",
    }),
  ],
});
```

#### fallback

支持在生产环境中回滚任何文件 (即使是动态的 添加到 public 中的文件)

#### spa

允许跑 `spa` 在 `public` 中

#### ssg

允许跑 `ssg` 在 `public` 中

<br />

#### 自定义

1. 先禁用预设

```ts
// nitro.config.js
import nitroPort from "nitro-port-module";

export default defineNitroConfig({
  modules: [
    nitroPort({
      preset: false,
    }),
  ],
});
```

2. 创建一个中间件

```ts
// middleware/public-fallback.ts
import { createPublicFallbackMiddleware } from "#nitro-public";

export default createPublicFallbackMiddleware((withoutSlashPathname) => {
  // 一些逻辑 ...

  return {
    file: "index.html", // 你的文件
    contentType: "text/html", // 如果没有设置，将自动从文件后缀名推断
    withPublicDir: true, // 默认为 true，自动帮你设置正确路径
  };
});
```

##### virtual

除了提供 `createPublicFallbackMiddleware` 之外, `#nitro-public` 也提供了
`publicDir` 和 `serverDir`

```ts
import {
  createPublicFallbackMiddleware,
  publicDir,
  serverDir,
} from "#nitro-public";
```

所有的函数都是 `类型安全` 并且支持 `开发` 和 `生产` 环境的 (纯 node 运行时)

<br />

## License

Made with [markthree](https://github.com/markthree)

Published under [MIT License](./LICENSE).
