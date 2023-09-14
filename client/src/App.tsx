import BrushHint from "@/components/BrushHint";
import CanvasSize from "@/components/CanvasSize";
import HintDisplay from "@/components/HintDisplay";
import PromptInput from "@/components/PromptInput";
import ToolSwitcher from "@/components/ToolSwitcher";
import ZoomSlider from "@/components/ZoomSlider";
import { process } from "@/lib/api";
import { imageBlobToBase64 } from "@/lib/util";
import {
  Atelier,
  AtelierRef,
  EraserPlugin,
  PenPlugin,
} from "@cobaltinc/atelier";
import {
  ArrowUUpLeft,
  ArrowUUpRight,
  Cpu,
  Download,
  Eye,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

enum ClientState {
  IDLE,
  BUSY,
  WAITING_COMPLETION,
}

function App() {
  const ref = useRef<AtelierRef>(null);

  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [command, setCommand] = useState("pen");
  const [lineWidth, setLineWidth] = useState(2);
  const [prompt, setPrompt] = useState("A drawing of a cute cat");
  const [negPrompt, setNegPrompt] = useState("A bad drawing");
  const [hintOpacity, setHintOpacity] = useState(1.0);
  const [clientState, setClientState] = useState(ClientState.IDLE);
  const [hints, setHints] = useState<string[]>([]);
  // refs for use in async request loop
  const requestLoopRef = useRef({
    clientState: clientState,
    prompt: prompt,
    negPrompt: negPrompt,
  });
  useEffect(() => {
    requestLoopRef.current = {
      clientState: clientState,
      prompt: prompt,
      negPrompt: negPrompt,
    };
  }, [clientState, prompt, negPrompt]);

  function setSize(width: number, height: number) {
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

  function downloadImageURI(img: string) {
    const anchor = document.createElement("a");
    anchor.setAttribute("download", "sketch.png");
    anchor.setAttribute("href", img.replace("image/png", "image/octet-stream"));
    anchor.click();
  }

  const shortcutHandler = useCallback((event: KeyboardEvent) => {
    if (event.repeat) return;

    if (event.ctrlKey && !event.shiftKey && event.key === "z") {
      ref.current?.undo();
    } else if (event.ctrlKey && event.shiftKey && event.key === "Z") {
      ref.current?.redo();
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", shortcutHandler);
    return () => document.removeEventListener("keydown", shortcutHandler);
  }, [shortcutHandler]);

  async function startRequests() {
    if (requestLoopRef.current.clientState !== ClientState.IDLE)
      throw "Can only start requests when idle";

    setClientState(ClientState.BUSY);

    while (
      requestLoopRef.current.clientState !== ClientState.WAITING_COMPLETION
    ) {
      let blob: Blob;
      try {
        blob = await process(
          getImageDataURI(),
          requestLoopRef.current.prompt,
          requestLoopRef.current.negPrompt,
        );
      } catch (e) {
        console.error("Error when processing image:");
        console.error(e);
        setClientState(ClientState.IDLE);
        return;
      }

      const img = await imageBlobToBase64(blob);

      setHints((oldHints) => {
        const newHints = [...oldHints, img];
        if (newHints.length > 5) {
          newHints.splice(0, 1);
        }
        return newHints;
      });
    }

    setClientState(ClientState.IDLE);
  }

  async function stopRequests() {
    if (requestLoopRef.current.clientState !== ClientState.BUSY)
      throw "Can only stop requests when busy";

    setClientState(ClientState.WAITING_COMPLETION);
  }

  return (
    <>
      <div className="flex h-screen w-full flex-col">
        {/* toolbar */}
        <div className="z-10 flex flex-none items-center justify-start overflow-x-auto px-2 shadow">
          <div
            className="flex-none"
            onClick={() => {
              if (clientState === ClientState.IDLE) {
                console.log("starting requests");
                startRequests();
              } else if (clientState === ClientState.BUSY) {
                console.log("stopping requests");
                stopRequests();
              }
            }}
          >
            TEST:{" "}
            {clientState === ClientState.IDLE
              ? "IDLE"
              : clientState === ClientState.BUSY
              ? "BUSY"
              : "WAITING"}
          </div>
          <span className="mx-3 h-6 w-0.5 flex-none bg-neutral-100"></span>
          <CanvasSize
            initialHeight={512}
            initialWidth={512}
            onChange={setSize}
            className="w-44 flex-none"
          />
          <span className="mx-3 h-6 w-0.5 flex-none bg-neutral-100"></span>
          <ToolSwitcher
            onChange={(command, width) => {
              setCommand(command);
              setLineWidth(width);
            }}
            className="flex-none"
          />
          <span className="mx-3 h-6 w-0.5 flex-none bg-neutral-100"></span>
          <div className="flex flex-none items-center justify-stretch">
            <button
              className="m-0.5 flex-none rounded p-1 hover:bg-black/10"
              onClick={() => ref.current?.undo()}
            >
              <ArrowUUpLeft size={16} />
            </button>
            <button
              className="m-0.5 flex-none rounded p-1 hover:bg-black/10"
              onClick={() => ref.current?.redo()}
            >
              <ArrowUUpRight size={16} />
            </button>
          </div>
          <span className="mx-3 h-6 w-0.5 flex-none bg-neutral-100"></span>
          <ZoomSlider
            initialZoom={1}
            onChange={setZoom}
            className="w-56 flex-none"
          />
          <span className="mx-3 h-6 w-0.5 flex-none bg-neutral-100"></span>
          <button
            className="m-0.5 flex flex-none items-center gap-2 rounded p-1 px-2 hover:bg-black/10"
            onClick={async () => {
              const img = getImageDataURI();

              const blob = await process(img, prompt, negPrompt);
              const uri = await imageBlobToBase64(blob);
              console.log(uri);
            }}
          >
            Process
            <Cpu size={16} />
          </button>
          <span className="mx-3 h-6 w-0.5 flex-none bg-neutral-100"></span>
          <button
            className="m-0.5 flex flex-none items-center gap-2 rounded p-1 px-2 hover:bg-black/10"
            onClick={() => downloadImageURI(getImageDataURI())}
          >
            Download
            <Download size={16} />
          </button>
          <button
            className="m-0.5 flex flex-none items-center gap-2 rounded p-1 px-2 hover:bg-black/10"
            onClick={() => window.open(getImageDataURI(), "_blank")}
          >
            View
            <Eye size={16} />
          </button>
        </div>
        {/* canvas container */}
        <div className="grid flex-1 overflow-auto bg-neutral-500">
          <HintDisplay
            images={hints}
            width={width * zoom}
            height={height * zoom}
            opacity={hintOpacity}
            className="col-start-1 row-start-1 m-auto"
          />
          <Atelier
            ref={ref}
            className="col-start-1 row-start-1 m-auto bg-white"
            width={width * zoom}
            height={height * zoom}
            canvasWidth={width}
            canvasHeight={height}
            key={`${width}x${height}`}
            command={command}
            plugins={[PenPlugin, EraserPlugin]}
            lineWidth={lineWidth}
          />
        </div>
        <BrushHint lineWidth={lineWidth} zoom={zoom} />
        <PromptInput
          className="z-10"
          initialPrompt={prompt}
          initialNegativePrompt={negPrompt}
          initialOpacity={hintOpacity}
          onChange={(newPrompt, newNegPrompt, newOpacity) => {
            setPrompt(newPrompt);
            setNegPrompt(newNegPrompt);
            setHintOpacity(newOpacity);
          }}
        />
      </div>
    </>
  );
}

export default App;
