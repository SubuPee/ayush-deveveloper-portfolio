import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { BootSequence } from "@/components/os/BootSequence";
import { Desktop } from "@/components/os/Desktop";
import { OSProvider } from "@/os/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ayush World — Interactive Developer Portfolio OS" },
      {
        name: "description",
        content:
          "Boot into Ayush World: a browser-based desktop operating system that is the portfolio of Ayush Srivastava — apps, terminal, live device services and more.",
      },
      { property: "og:title", content: "Ayush World — Interactive Developer Portfolio OS" },
      {
        property: "og:description",
        content: "A developer portfolio that behaves like a real operating system. Boot in and explore.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div className="h-screen w-screen bg-[#04060a]" />}>
      <AyushWorld />
    </ClientOnly>
  );
}

function AyushWorld() {
  const [booted, setBooted] = useState(false);
  return (
    <OSProvider>
      <main className="h-screen w-screen overflow-hidden bg-black">
        <h1 className="sr-only">Ayush World — interactive developer portfolio operating system</h1>
        {booted ? (
          <DesktopReveal>
            <Desktop />
          </DesktopReveal>
        ) : null}
        {!booted ? <BootSequence onFinish={() => setBooted(true)} /> : null}
        <Toaster />
      </main>
    </OSProvider>
  );
}

function DesktopReveal({ children }: { children: React.ReactNode }) {
  return <div className="desktop-reveal h-full w-full">{children}</div>;
}
