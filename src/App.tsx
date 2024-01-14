import { useEffect, useRef } from "react";
import { Nodebox } from "@codesandbox/nodebox";
import "./App.css";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const thisEffect = async () => {
      if (!iframeRef.current) {
        return;
      }
      const emulator = new Nodebox({
        iframe: iframeRef.current,
      });

      await emulator.connect();

      await emulator.fs.init({
        "package.json": JSON.stringify({
          name: "my-app",
        }),
        "main.js": `
import http from 'http'

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  res.end('Hello from Nodebox')
})

server.listen(3000, () => {
  console.log('Server is ready!')
})
  `,
      });

      const shell = emulator.shell.create();
      const serverCommand = await shell.runCommand("node", ["main.js"]);

      const { url } = await emulator.preview.getByShellId(serverCommand.id);

      // Preview Iframe to see output of code
      iframeRef.current.setAttribute("src", url);
    };
    thisEffect();
  });

  return (
    <>
      <div>
        <iframe ref={iframeRef} id="nodebox-runtime-iframe" />
      </div>
    </>
  );
}

export default App;
