import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    //name for debugging pursposes only
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // onResolve used to figure out what the actual path is to a particular file/module
      // Handle root entry file of index.js
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });
      //  filter: /^\.+\//    (checks if path includes "./" or "../")
      // Handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });
      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};

/**
 * Please bundle index.js!
 *
 * ESBuild Bundling Process
 *
 * - Figure ut where the index.js file is stores (onResolve step)
 *
 * - Attempt to load up the index.js file (onLoad step)
 *
 * - Parse the index.js file, find any import/require/exports
 *
 * - If there are any import/require/exports, figure out
 *   where the requested file is (onResolve step)
 *
 * - Attempt to load that file up (onLoad step)
 */

/**onResolve args:
 *
 * - importer ("who" is importing the file ie. index.js)
 * - namespace
 * - path (current path to the file)
 * - resolveDir
 */

/**onLoad args:
 *
 * - namespace
 * - path: (path provided by on resolve)
 */
