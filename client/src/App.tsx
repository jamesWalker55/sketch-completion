import {
  Atelier,
  AtelierRef,
  EraserPlugin,
  PenPlugin,
} from "@cobaltinc/atelier";
import { Download } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import BrushHint from "./components/BrushHint";
import CanvasSize from "./components/CanvasSize";
import ToolSwitcher from "./components/ToolSwitcher";
import ZoomSlider from "./components/ZoomSlider";

function App() {
  const ref = useRef<AtelierRef>(null);

  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [command, setCommand] = useState("pen");
  const [lineWidth, setLineWidth] = useState(2);

  function setSize(width: number, height: number) {
    setWidth(width);
    setHeight(height);
  }

  function getImageDataURI() {
    const atelier = ref.current;
    if (atelier === null) {
      throw { message: "attempted to get image when canvas isn't initialised" };
    }

    return atelier.canvas.toDataURL("image/png");
  }

  return (
    <>
      <div className="flex h-screen w-full flex-col">
        {/* toolbar */}
        <div className="z-10 flex flex-none items-center justify-start overflow-x-auto px-2 shadow">
          <CanvasSize
            initialHeight={512}
            initialWidth={512}
            onChange={setSize}
            className="w-44 flex-none"
          />
          <span className="mx-3 h-6 w-0.5 flex-none bg-neutral-100"></span>
          <ToolSwitcher
            onChange={(command, width) => {
              setCommand(command);
              setLineWidth(width);
            }}
            className="flex-none"
          />
          <span className="mx-3 h-6 w-0.5 flex-none bg-neutral-100"></span>
          <ZoomSlider
            initialZoom={1}
            onChange={setZoom}
            className="w-56 flex-none"
          />
          <span className="mx-3 h-6 w-0.5 flex-none bg-neutral-100"></span>
          <button
            className="m-0.5 flex flex-none items-center gap-2 rounded p-1 px-2 hover:bg-black/10"
            onClick={() => {
              const img = getImageDataURI();

              const anchor = document.createElement("a");
              anchor.setAttribute("download", "sketch.png");
              anchor.setAttribute(
                "href",
                img.replace("image/png", "image/octet-stream"),
              );

              anchor.click();
            }}
          >
            Download
            <Download size={16} />
          </button>
        </div>
        {/* canvas container */}
        <div className="flex flex-1 overflow-auto bg-neutral-500">
          <Atelier
            ref={ref}
            className="m-auto bg-white"
            width={width * zoom}
            height={height * zoom}
            canvasWidth={width}
            canvasHeight={height}
            key={`${width}x${height}`}
            command={command}
            plugins={[PenPlugin, EraserPlugin]}
            lineWidth={lineWidth}
          />
        </div>
        <BrushHint lineWidth={lineWidth} zoom={zoom} />
      </div>
    </>
  );
}

export default App;
