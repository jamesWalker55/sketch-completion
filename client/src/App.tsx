import { useRef, useState } from "react";
import { Atelier, AtelierRef } from "@cobaltinc/atelier";
import ZoomSlider from "./components/ZoomSlider";

function App() {
  const ref = useRef<AtelierRef>(null);

  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);

  function getImageDataURI() {
    return ref.current?.canvas.toDataURL("image/png");
  }

  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <ZoomSlider
          className="flex-none shadow"
          initialZoom={1}
          onChange={setZoom}
        />
        {/* canvas container */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-neutral-500">
          <Atelier
            ref={ref}
            className="bg-white"
            width={width * zoom}
            height={height * zoom}
            canvasWidth={width}
            canvasHeight={height}
          />
        </div>
      </div>
    </>
  );
}

export default App;
