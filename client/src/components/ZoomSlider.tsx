import { useRef, useState } from "react";

interface Props {
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  onChange?(zoom: number): void;
  className?: string;
}

function ZoomSlider({
  initialZoom = 1,
  minZoom = 0.25,
  maxZoom = 4,
  onChange,
  className,
}: Props) {
  const [zoom, setRawZoom] = useState(initialZoom);

  function setZoom(callback: number | ((zoom: number) => number)) {
    let newZoom;

    // calculate new zoom
    if (typeof callback === "number") {
      newZoom = callback;
    } else {
      newZoom = callback(zoom);
    }

    // clamp between min and max zoom
    newZoom = Math.max(minZoom, Math.min(newZoom, maxZoom));

    // update zoom
    setRawZoom(newZoom);

    // do callback
    if (onChange !== undefined) onChange(newZoom);
  }

  const zoomMultiplier = 1.1;

  return (
    <div className={"flex items-center justify-stretch" + " " + className}>
      <span className="flex-none">{(zoom * 100).toPrecision(3)}%</span>
      <button
        className="flex-none p-2 hover:bg-black/10"
        onClick={() => setZoom((zoom) => zoom / zoomMultiplier)}
      >
        -
      </button>
      <input
        type="range"
        className="flex-1"
        min={minZoom ** 0.5}
        max={maxZoom ** 0.5}
        step={0.01}
        value={zoom ** 0.5}
        onChange={(e) => {
          const sliderValue = parseFloat(e.target.value);
          const newZoom = sliderValue ** 2;
          setZoom(newZoom);
        }}
        onDoubleClick={() => setZoom(1)}
      />
      <button
        className="flex-none p-2 hover:bg-black/10"
        onClick={() => setZoom((zoom) => zoom * zoomMultiplier)}
      >
        +
      </button>
    </div>
  );
}

export default ZoomSlider;
