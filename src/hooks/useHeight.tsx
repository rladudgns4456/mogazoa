import { useEffect, useState } from "react";

interface Height {
  height: number;
}

function getWindowHeight() {
  return {
    height: window.innerHeight,
  };
}

export function useHeight(): Height {
  const [isHeight, setIsHeight] = useState<Height>(getWindowHeight());
  useEffect(() => {
    function handleResize() {
      setIsHeight(getWindowHeight());
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isHeight;
}
