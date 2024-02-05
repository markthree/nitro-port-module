import { defu } from "defu";
import type { NitroModule } from "nitropack";

interface Options {
  /**
   * @default 3000
   */
  port?: number;
}

const defaultOptions: Options = {
  port: 3000,
};

function nitroPort(options = defaultOptions): NitroModule {
  return {
    name: "nitro-port",
    setup(nitro) {
      const { preset, dev } = nitro.options;
      const { port } = options = defu(options, defaultOptions);

      if (port === 3000) {
        // default is 3000, so we don't need to do anything
        return;
      }

      if (dev) {
        process.env.PORT = String(parseInt(String(port)));
        return;
      }

      const logger = nitro.logger.withTag("nitro");
      nitro.options.rollupConfig ??= { output: {} };
      const plugins = nitro.options.rollupConfig.plugins ??= [];
      const polyfill = preset.includes("deno")
        ? `Deno.env.set("PORT", "${port}")`
        : `process.env.PORT = '${port}'`;

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
          return polyfill;
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
