import { Atelier, AtelierRef } from "@cobaltinc/atelier";
import { useRef, useState } from "react";
import CanvasSize from "./components/CanvasSize";
import ZoomSlider from "./components/ZoomSlider";

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
          <span className="mx-3 h-4 w-px bg-neutral-400"></span>
          <ZoomSlider initialZoom={1} onChange={setZoom} className="w-56" />
        </div>
        {/* canvas container */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-neutral-500">
          <Atelier
            ref={ref}
            className="bg-white"
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
