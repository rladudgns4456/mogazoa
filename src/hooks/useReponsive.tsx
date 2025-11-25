import { useIsClient } from "@uidotdev/usehooks";
import { useMediaQuery } from "react-responsive";

export function useResponsive() {
  const isClient = useIsClient();

  const isMobile = useMediaQuery({ query: "(min-width: 768px)" });
  const isTablet = useMediaQuery({
    query: "(max-width: 768px) and (max-width: 1280px)",
  });
  const isDesktop = useMediaQuery({ query: "(min-width: 1280px)" });

  if (!isClient) {
    return { isMobile: false, isTablet: false, isDesktop: false };
  }

  return { isMobile, isTablet, isDesktop };
}
