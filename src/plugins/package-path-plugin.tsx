import * as esbuild from "esbuild-wasm";

//

export const unpkgPathPlugin = () => {
  return {
    //name for debugging pursposes only
    name: "unpkg-path-plugin",
    //BUILD() called automatically with single argument. represents the bundling process

    //interact with build process by attaching event listeners to listen to onResolve and onLoad events

    //the filter property determines when an onResolve or onLoad method is called. ex. only run on typescript file or on .js etc
    setup(build: esbuild.PluginBuild) {
      //onResolve used to figure out what the actual path is to a particular file
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResole", args);
        return { path: args.path, namespace: "a" };
      });
      //onLoad used to actually load a file from the file_system
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
              import message from 'tiny-test-pkg';
              console.log(message);
            `,
          };
        }
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
