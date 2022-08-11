//copy and paste "esbuild.wasm" file from node modules to the public directory and import all as esbuild
import * as esbuild from "esbuild-wasm";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
//esBuild plugin to address where files will be sourced instead of from the local file system
import { unpkgPathPlugin } from "./plugins/package-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState("");

  useEffect(() => {
    startService();
  }, []);

  const startService = async () => {
    //ref.current created a reference to anything wed like to use within a component in this case, the bundler/transpiler service through esBuild
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    iframe.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };
  //we can use "postMessaging" to communicate in a "safe" way between the iframe and the parent DOM
  const html = `
    <html>
     <head></head>
     <body>
      <div id='root'></div>
      <script>
        window.addEventListener('message',(event) => {
          try{
         eval(event.data)
          }catch(err){
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          }
       }, false)
        </script>
      </body>
    </html>
  `;
  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      {/** iframe used to embed one HTML element inside of another!
       *
       * sandbox property must be set to 'allow-same-origin'
       * OTHERWISE NO COMMUNICATION IS ALLOWED
       */}
      <iframe
        title='code window'
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
      />
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

//option to refactor iFrame.. use seperate server ie.localHost:4006 etc to serve HTML doc and create complete seperation of concerns
