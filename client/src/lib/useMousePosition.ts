import React from "react";

interface MousePos {
  x: number | null;
  y: number | null;
}

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = React.useState<MousePos>({
    x: null,
    y: null,
  });
  React.useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  return mousePosition;
};

export default useMousePosition;
