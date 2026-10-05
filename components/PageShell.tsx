import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  wide?: boolean;
};

export default function PageShell({ children, wide = false }: PageShellProps) {
  return (
    <div
      className={`mx-auto px-5 pb-12 pt-10 ${wide ? "max-w-5xl" : "max-w-3xl"}`}
    >
      {children}
    </div>
  );
}
