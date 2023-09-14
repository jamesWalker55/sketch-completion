interface Props {
  // list of image URIs
  images: string[];
  width: number;
  height: number;
  opacity?: number;
  className?: string;
}

function HintDisplay({
  images = [],
  width = 512,
  height = 512,
  opacity = 1,
  className = "",
}: Props) {
  return (
    <div
      className={"pointer-events-none grid" + ` ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {images.map((uri) => (
        <img
          className="col-start-1 row-start-1 h-full w-full mix-blend-multiply"
          style={{ opacity: opacity }}
          src={uri}
          key={uri}
        />
      ))}
    </div>
  );
}

export default HintDisplay;
