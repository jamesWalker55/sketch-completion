import { setStateWithCallback } from "@/lib/util";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";

interface Props {
  initialPrompt?: string;
  initialNegativePrompt?: string;
  onChange?(prompt: string, negativePrompt: string): void;
  className?: string;
}

function PromptInput({
  initialPrompt = "",
  initialNegativePrompt = "",
  className = "",
  onChange,
}: Props) {
  const [prompt, setRawPrompt] = useState(initialPrompt);
  const [negativePrompt, setRawNegativePrompt] = useState(
    initialNegativePrompt,
  );

  const setPrompt = setStateWithCallback(
    prompt,
    setRawPrompt,
    onChange ? (newPrompt) => onChange(newPrompt, negativePrompt) : undefined,
  );

  const setNegativePrompt = setStateWithCallback(
    negativePrompt,
    setRawNegativePrompt,
    onChange ? (newNegPrompt) => onChange(prompt, newNegPrompt) : undefined,
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
      <div className="flex gap-1">
        <div
          className="cursor-pointer rounded hover:bg-neutral-200"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <CaretRight size={24} /> : <CaretDown size={24} />}
        </div>
        <span className="italic text-neutral-500">Prompt</span>
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
