import { setStateWithCallback } from "@/lib/util";
import { Eraser, Pencil } from "@phosphor-icons/react";
import { useState } from "react";

interface Props {
  initialPenWidth?: number;
  initialEraserWidth?: number;
  onChange?(command: Command, width: number): void;
  className?: string;
}

enum Command {
  pen = "pen",
  eraser = "eraser",
}

function ToolSwitcher({
  initialPenWidth = 2,
  initialEraserWidth = 10,
  onChange,
  className,
}: Props) {
  const [penWidth, setRawPenWidth] = useState(initialPenWidth);
  const [eraserWidth, setRawEraserWidth] = useState(initialEraserWidth);
  const [command, setRawCommand] = useState(Command.pen);

  const setPenWidth = setStateWithCallback(
    penWidth,
    setRawPenWidth,
    onChange
      ? (newWidth: number) => onChange(Command.pen, newWidth)
      : undefined,
  );

  const setEraserWidth = setStateWithCallback(
    eraserWidth,
    setRawEraserWidth,
    onChange
      ? (newWidth: number) => onChange(Command.eraser, newWidth)
      : undefined,
  );

  const setCommand = setStateWithCallback(
    command,
    setRawCommand,
    onChange
      ? (newCommand: Command) =>
          onChange(
            newCommand,
            newCommand == Command.pen ? penWidth : eraserWidth,
          )
      : undefined,
  );

  return (
    <div
      className={"flex items-center justify-stretch gap-1" + " " + className}
    >
      <div
        className={
          "flex flex-none items-center justify-stretch rounded p-0.5 hover:bg-neutral-300" +
          " " +
          (command === Command.pen
            ? "text-blue-700 outline outline-blue-500"
            : "opacity-50")
        }
        onClick={() => setCommand(Command.pen)}
      >
        <Pencil size={24} className="flex-none peer-focus:border" />
      </div>
      <div
        className={
          "flex flex-none items-center justify-stretch rounded p-0.5 hover:bg-neutral-300" +
          " " +
          (command === Command.eraser
            ? "text-blue-700 outline outline-blue-500"
            : "opacity-50")
        }
        onClick={() => setCommand(Command.eraser)}
      >
        <Eraser size={24} className="flex-none peer-focus:border" />
      </div>
      <input
        type="range"
        className="m-0.5 min-w-0 flex-1 cursor-pointer bg-transparent"
        min={0}
        max={10}
        step={1}
        value={command == Command.pen ? penWidth : eraserWidth}
        onChange={(e) => {
          if (command == Command.pen) {
            setPenWidth(parseFloat(e.target.value));
          } else {
            setEraserWidth(parseFloat(e.target.value));
          }
        }}
        onDoubleClick={() => {
          if (command == Command.pen) {
            setPenWidth(initialPenWidth);
          } else {
            setEraserWidth(initialEraserWidth);
          }
        }}
      />
      <div className="flex-none">
        <input
          type="text"
          className="w-6 text-right"
          value={command == Command.pen ? penWidth : eraserWidth}
          onChange={(e) => {
            if (command == Command.pen) {
              setPenWidth(parseFloat(e.target.value));
            } else {
              setEraserWidth(parseFloat(e.target.value));
            }
          }}
        />
        <span className="ml-1">px</span>
      </div>
    </div>
  );
}

export default ToolSwitcher;
