import useMousePosition from "@/lib/useMousePosition";

interface Props {
  lineWidth: number;
  zoom: number;
}

function BrushHint({ lineWidth, zoom }: Props) {
  const mousePos = useMousePosition();

  return (
    <div
      className="pointer-events-none absolute rounded-full border border-white mix-blend-difference"
      style={{
        left: `${(mousePos.x || 0) - (lineWidth * zoom) / 2}px`,
        top: `${(mousePos.y || 0) - (lineWidth * zoom) / 2}px`,
        width: `${lineWidth * zoom + 1}px`,
        height: `${lineWidth * zoom + 1}px`,
      }}
    ></div>
  );
}

export default BrushHint;
