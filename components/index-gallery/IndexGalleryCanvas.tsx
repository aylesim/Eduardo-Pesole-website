"use client";

import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import * as THREE from "three";
import CurvedPlane from "@/components/index-gallery/CurvedPlane";
import {
  GalleryScrollProvider,
  useGalleryScroll,
} from "@/components/index-gallery/GalleryScroll";
import type { GalleryWork } from "@/lib/gallery-works";

type Props = {
  works: GalleryWork[];
  compact: boolean;
  onActiveChange: (index: number) => void;
};

function Scene({
  works,
  compact,
  onSelect,
}: {
  works: GalleryWork[];
  compact: boolean;
  onSelect: (work: GalleryWork) => void;
}) {
  const { store } = useGalleryScroll();

  const layout = compact
    ? { width: 2.35, height: 1.32, radius: 3.4, step: 0.5, x: 0, y: 0.62 }
    : { width: 3.25, height: 1.62, radius: 5.4, step: 0.42, x: -1.05, y: 0.08 };

  return (
    <group position={[layout.x, layout.y, 0]}>
      <color attach="background" args={["#eeeeec"]} />
      {works.map((work, index) => (
        <CurvedPlane
          key={work.slug}
          work={work}
          index={index}
          count={works.length}
          store={store}
          width={layout.width}
          height={layout.height}
          radius={layout.radius}
          step={layout.step}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

export default function IndexGalleryCanvas({
  works,
  compact,
  onActiveChange,
}: Props) {
  const router = useRouter();

  const onSelect = useMemo(
    () => (work: GalleryWork) => {
      if (work.external) {
        window.open(work.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(work.href);
      }
    },
    [router],
  );

  return (
    <GalleryScrollProvider count={works.length} onActiveChange={onActiveChange}>
      <Canvas
        key={compact ? "compact" : "desk"}
        className="h-full w-full touch-none"
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        camera={{
          position: [0, compact ? 0.2 : 0, compact ? 5.5 : 8.6],
          fov: compact ? 40 : 30,
          near: 0.1,
          far: 40,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#eeeeec", 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Scene works={works} compact={compact} onSelect={onSelect} />
      </Canvas>
    </GalleryScrollProvider>
  );
}
