import { setStateWithCallback } from "@/lib/util";
import { ArrowsHorizontal, ArrowsVertical } from "@phosphor-icons/react";
import { useState } from "react";

interface Props {
  min?: number;
  max?: number;
  initialWidth?: number;
  initialHeight?: number;
  step?: number;
  onChange?(width: number, height: number): void;
  className?: string;
}

function CanvasSize({
  min = 128,
  max = 2048,
  initialWidth = 512,
  initialHeight = 512,
  step = 64,
  onChange,
  className,
}: Props) {
  const [width, setRawWidth] = useState(initialWidth);
  const [height, setRawHeight] = useState(initialHeight);

  const setWidth = setStateWithCallback(
    width,
    setRawWidth,
    onChange ? (newWidth: number) => onChange(newWidth, height) : undefined,
    (newWidth: number) => Math.max(min, Math.min(newWidth, max)),
  );

  const setHeight = setStateWithCallback(
    height,
    setRawHeight,
    onChange ? (newHeight: number) => onChange(width, newHeight) : undefined,
    (newHeight: number) => Math.max(min, Math.min(newHeight, max)),
  );

  return (
    <div className={"flex items-center justify-stretch" + " " + className}>
      <div className="flex flex-1 items-center justify-stretch">
        <ArrowsHorizontal
          size={16}
          className="m-1 flex-none peer-focus:border"
        />
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          className="w-full min-w-0 flex-1 rounded border border-neutral-100 text-right outline-none focus:border-blue-600"
          value={width}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setWidth(value);
          }}
        />
      </div>
      <div className="flex flex-1 items-center justify-stretch">
        <ArrowsVertical size={16} className="m-1 flex-none peer-focus:border" />
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          className="w-full min-w-0 flex-1 rounded border border-neutral-100 text-right outline-none focus:border-blue-600"
          value={height}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setHeight(value);
          }}
        />
      </div>
    </div>
  );
}

export default CanvasSize;
