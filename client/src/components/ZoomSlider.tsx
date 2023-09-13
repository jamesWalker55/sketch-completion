import { setStateWithCallback } from "@/lib/util";
import {
  ArrowClockwise,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";
import { useState } from "react";

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

  const setZoom = setStateWithCallback(
    zoom,
    setRawZoom,
    onChange,
    (newWidth: number) => Math.max(minZoom, Math.min(newWidth, maxZoom)),
  );

  const zoomMultiplier = 1.1;

  return (
    <div className={"flex items-center justify-stretch" + " " + className}>
      <div className="w-10 flex-none text-center text-sm font-semibold text-neutral-500">
        {Math.round(zoom * 100)}%
      </div>
      <button
        className="m-0.5 flex-none rounded p-1 hover:bg-black/10"
        onClick={() => setZoom(initialZoom)}
      >
        <ArrowClockwise size={16} />
      </button>
      <button
        className="m-0.5 flex-none rounded p-1 hover:bg-black/10"
        onClick={() => setZoom((zoom) => zoom / zoomMultiplier)}
      >
        <MagnifyingGlassMinus size={16} />
      </button>
      <input
        type="range"
        className="m-0.5 min-w-0 flex-1 cursor-pointer bg-transparent"
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
        className="m-0.5 flex-none rounded p-1 hover:bg-black/10"
        onClick={() => setZoom((zoom) => zoom * zoomMultiplier)}
      >
        <MagnifyingGlassPlus size={16} />
      </button>
    </div>
  );
}

export default ZoomSlider;
