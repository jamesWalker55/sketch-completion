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

  function setWidth(callback: number | ((zoom: number) => number)) {
    let newValue;
    if (typeof callback === "number") {
      newValue = callback;
    } else {
      newValue = callback(width);
    }
    newValue = Math.max(min, Math.min(newValue, max));

    setRawWidth(newValue);
    if (onChange !== undefined) onChange(newValue, height);
  }

  function setHeight(callback: number | ((zoom: number) => number)) {
    let newValue;
    if (typeof callback === "number") {
      newValue = callback;
    } else {
      newValue = callback(height);
    }
    newValue = Math.max(min, Math.min(newValue, max));

    setRawHeight(newValue);
    if (onChange !== undefined) onChange(width, newValue);
  }

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
