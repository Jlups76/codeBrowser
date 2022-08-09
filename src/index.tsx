//copy and paste "esbuild.wasm" file from node modules to the public directory and import all as esbuild
import * as esbuild from "esbuild-wasm";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
//esBuild plugin to address where files will be sourced instead of from the local file system
import { unpkgPathPlugin } from "./plugins/package-path-plugin";

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    startService();
  }, []);

  const startService = async () => {
    //ref.current created a reference to anything wed like to use within a component in this case, the bundler/transpiler service through esBuild
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });
    // console.log(result);
    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));

// const result = await ref.current.transform(input, {
//   //the type of code being put into the transpiler
//   loader: "jsx",
//   //target = what options the transpiler will use. in this case es2015 syntax
//   target: "es2015",
// });
