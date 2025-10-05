import { defu } from "defu";
import type { Nitro, NitroModule } from "nitropack";
import { isFunction, isNumber, isString } from "m-type-tools";

type PolyfillFn = (nitro: Nitro, port: number) => string;

interface Options {
  /**
   * @default 3000
   */
  port?: number;
  /**
   * @default Default automatic detection
   */
  polyfill?: string | PolyfillFn;

  /**
   * Always override environment variables
   * This option allows you to modify the port during nuxt development
   * @default true
   */
  override?: boolean;

  /**
   * Determine which is the entry, defaults to automatic inference
   * @param preset
   * @param fileName
   */
  isEntry?(preset: Preset | string, fileName: string): boolean;
}

const defaultOptions: Options = {
  port: 3000,
  override: true,
  polyfill(nitro, port) {
    if (nitro.options.preset === "nitro-prerender") {
      return "";
    }

    return nitro.options.preset.includes("deno")
      ? `Deno.env.set("PORT", "${port}")`
      : `process.env.PORT = '${port}'`;
  },
  isEntry(preset, fileName) {
    return files[preset] === fileName || runtimeEntry === fileName ||
      fileName === "chunks/_/nitro.mjs";
  },
};

const runtimeEntry = "chunks/runtime.mjs";

const files = {
  "bun": "index.mjs",
  "deno": "index.ts",
  "deno-server": "chunks/nitro/deno-server.mjs",
  "node-server": "chunks/nitro/node-server.mjs",
  "node-cluster": "chunks/nitro/node-server.mjs",
} as Record<string, string>;

function nitroPort(options = defaultOptions): NitroModule {
  const { port, polyfill, override, isEntry } = options = defu(
    options,
    defaultOptions,
  );

  if (!isNumber(port)) {
    throw new TypeError("port must be a number");
  }
  if (!isFunction(polyfill) && !isString(polyfill)) {
    throw new TypeError("polyfill must be a function or string");
  }

  if (port === 3000) {
    // default is 3000, so we don't need to do anything
    return {
      name: "nitro-port",
      setup() {},
    };
  }

  if (override) {
    process.env.PORT = String(parseInt(String(port)));
  }

  return {
    name: "nitro-port",
    setup(nitro) {
      const { preset, dev } = nitro.options;
      if (dev || preset === "nitro-prerender") {
        return;
      }
      nitro.options.rollupConfig ??= { output: {} };
      const plugins = nitro.options.rollupConfig.plugins ??= [];

      if (!files[preset]) {
        throw new TypeError(
          `preset "${preset}" is not supported by nitro-port-module`,
        );
      }

      function usePolyfill(fileName: string) {
        if (isEntry!(preset, fileName)) {
          if (isString(polyfill)) {
            return polyfill;
          }
          if (isFunction(polyfill)) {
            return polyfill(nitro, port!);
          }
        }
        return "";
      }

      if (Array.isArray(plugins)) {
        plugins.unshift({
          name: "nitro-port-banner",
          banner: {
            order: "pre",
            handler(ctx) {
              return usePolyfill(ctx.fileName);
            },
          },
        });
        return;
      }

      throw new TypeError(
        `rollupConfig.plugins is not an array, nitro-port-module is not supported`,
      );
    },
  };
}

type Preset = "bun" | "deno" | "deno-server" | "node-server" | "node-cluster";

type VitePolyfillFn = (preset: Preset, port: number) => string;

type ViteOptions = {
  /**
   * @default 3000
   */
  port?: number;
  /**
   * @default Default automatic detection
   */
  polyfill?: string | VitePolyfillFn;

  /**
   * Always override environment variables
   * This option allows you to modify the port during nuxt development
   * @default true
   */
  override?: boolean;

  isEntry?(preset: Preset | string, fileName: string): boolean;
};

const viteDefaultOptions: ViteOptions = {
  port: 3000,
  override: true,
  polyfill(preset, port) {
    return preset.includes("deno")
      ? `Deno.env.set("PORT", "${port}")`
      : `process.env.PORT = '${port}'`;
  },
  isEntry(preset, fileName) {
    return files[preset] === fileName || runtimeEntry === fileName;
  },
};

export function ViteNitroPort(
  options = viteDefaultOptions,
  preset: Preset = "node-server",
) {
  const { port, polyfill, override, isEntry } = options = defu(
    options,
    viteDefaultOptions,
  );

  if (!isNumber(port)) {
    throw new TypeError("port must be a number");
  }
  if (!isFunction(polyfill) && !isString(polyfill)) {
    throw new TypeError("polyfill must be a function or string");
  }
  if (port === 3000) {
    // default is 3000, so we don't need to do anything
    return;
  }

  if (override) {
    process.env.PORT = String(parseInt(String(port)));
  }

  if (process.env.NODE_ENV !== "production") {
    return {
      name: "vite-plugins-nitro-port",
    };
  }

  if (!files[preset]) {
    throw new TypeError(
      `preset "${preset}" is not supported by vite-plugins-nitro-port`,
    );
  }

  function usePolyfill(fileName: string) {
    if (isEntry!(fileName, preset)) {
      if (isString(polyfill)) {
        return polyfill;
      }
      if (isFunction(polyfill)) {
        return polyfill(preset, port!);
      }
    }
    return "";
  }

  return {
    name: "vite-plugins-nitro-port",
    banner(ctx: { fileName: string }) {
      return usePolyfill(ctx.fileName);
    },
  };
}

export default nitroPort;
