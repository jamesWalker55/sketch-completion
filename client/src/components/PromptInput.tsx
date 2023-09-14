import { setStateWithCallback } from "@/lib/util";
import { CaretDown, CaretRight, Eye } from "@phosphor-icons/react";
import { useState } from "react";

interface Props {
  initialPrompt?: string;
  initialNegativePrompt?: string;
  initialOpacity?: number;
  onChange?(prompt: string, negativePrompt: string, opacity: number): void;
  className?: string;
}

function PromptInput({
  initialPrompt = "",
  initialNegativePrompt = "",
  initialOpacity = 1,
  className = "",
  onChange,
}: Props) {
  const [prompt, setRawPrompt] = useState(initialPrompt);
  const [negativePrompt, setRawNegativePrompt] = useState(
    initialNegativePrompt,
  );
  const [opacity, setRawOpacity] = useState(initialOpacity);

  const setPrompt = setStateWithCallback(
    prompt,
    setRawPrompt,
    onChange
      ? (newPrompt) => onChange(newPrompt, negativePrompt, opacity)
      : undefined,
  );

  const setNegativePrompt = setStateWithCallback(
    negativePrompt,
    setRawNegativePrompt,
    onChange
      ? (newNegPrompt) => onChange(prompt, newNegPrompt, opacity)
      : undefined,
  );

  const setOpacity = setStateWithCallback(
    opacity,
    setRawOpacity,
    onChange
      ? (newOpacity) => onChange(prompt, negativePrompt, newOpacity)
      : undefined,
  );

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={
        "pointer-events-auto rounded bg-white px-4 py-2 drop-shadow-md" +
        " " +
        className
      }
    >
      <div className="flex items-center justify-center gap-1">
        <div
          className="cursor-pointer rounded hover:bg-neutral-200"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <CaretRight size={24} /> : <CaretDown size={24} />}
        </div>
        <span className="italic text-neutral-500">Prompt</span>
        <span className="flex-1"></span>
        {/* opacity slider */}
        <div className="flex items-center justify-center gap-1">
          <Eye size={16} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            className="w-32"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {!collapsed ? (
        <>
          <textarea
            className="mt-1 h-12 w-full rounded border border-neutral-500 p-1 focus:border-blue-500 focus:outline focus:outline-1 focus:outline-blue-500"
            placeholder="A cute drawing of a cat"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="mb-1 mt-1 italic text-neutral-500">
            Negative Prompt
          </div>
          <textarea
            className="h-12 w-full rounded border border-neutral-500 p-1 focus:border-blue-500 focus:outline focus:outline-1 focus:outline-blue-500"
            placeholder="Bad drawing"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
          />
        </>
      ) : null}
    </div>
  );
}

export default PromptInput;
