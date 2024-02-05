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
}

const defaultOptions: Options = {
  port: 3000,
  polyfill(nitro, port) {
    return nitro.options.preset.includes("deno")
      ? `Deno.env.set("PORT", "${port}")`
      : `process.env.PORT = '${port}'`;
  },
};

function nitroPort(options = defaultOptions): NitroModule {
  return {
    name: "nitro-port",
    setup(nitro) {
      const { preset, dev } = nitro.options;
      const { port, polyfill } = options = defu(options, defaultOptions);
      const logger = nitro.logger.withTag("nitro");
      if (!isNumber(port)) {
        logger.error("port must be a number");
        return;
      }

      if (!isFunction(polyfill) && !isString(polyfill)) {
        logger.error("polyfill must be a function or string");
        return;
      }

      if (port === 3000) {
        // default is 3000, so we don't need to do anything
        return;
      }

      if (dev) {
        process.env.PORT = String(parseInt(String(port)));
        return;
      }

      nitro.options.rollupConfig ??= { output: {} };
      const plugins = nitro.options.rollupConfig.plugins ??= [];

      const files = {
        "bun": "index.mjs",
        "deno": "index.ts",
        "deno-server": "chunks/nitro/deno-server.mjs",
        "node-server": "chunks/nitro/node-server.mjs",
        "node-cluster": "chunks/nitro/node-server.mjs",
      } as Record<string, string>;

      if (!files[preset]) {
        logger.warn(
          `preset "${preset}" is not supported by nitro-port-module`,
        );
        return;
      }

      function usePolyfill(fileName: string) {
        if (files[preset] === fileName) {
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

      logger.warn(
        `rollupConfig.plugins is not an array, nitro-port-module is not supported`,
      );
    },
  };
}

export default nitroPort;
