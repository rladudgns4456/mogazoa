import { ReactNode } from "react";

export default function HeaderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header>헤더</header>
      {children}
    </>
  );
}
