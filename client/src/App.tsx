import { Atelier, AtelierRef } from "@cobaltinc/atelier";
import { useRef, useState } from "react";
import CanvasSize from "./components/CanvasSize";
import ZoomSlider from "./components/ZoomSlider";
import { Download } from "@phosphor-icons/react";

function App() {
  const ref = useRef<AtelierRef>(null);

  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);

  function setSize(width: number, height: number) {
    ref.current?.canvas;
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
        <div className="z-10 flex flex-none items-center shadow">
          <CanvasSize
            initialHeight={512}
            initialWidth={512}
            onChange={setSize}
            className="w-44"
          />
          <span className="mx-3 h-4 w-0.5 bg-neutral-200"></span>
          <ZoomSlider initialZoom={1} onChange={setZoom} className="w-56" />
          <span className="mx-2 h-4 w-0.5 bg-neutral-200"></span>
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
          />
        </div>
      </div>
    </>
  );
}

export default App;
