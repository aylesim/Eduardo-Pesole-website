"use client";

import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import * as THREE from "three";
import AmbientParticles from "@/components/index-gallery/AmbientParticles";
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
    ? { width: 1.9, height: 1.069, radius: 2.6, step: 0.44, x: 0, y: 0.34 }
    : {
        width: 2.4,
        height: 1.35,
        radius: 2.35,
        step: 0.58,
        x: -0.85,
        y: -0.28,
      };

  return (
    <>
      <AmbientParticles
        compact={compact}
        store={store}
        centerX={layout.x - layout.radius}
        centerY={layout.y}
      />
      <group position={[layout.x, layout.y, 0]}>
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
    </>
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
        resize={{ scroll: false }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        camera={{
          position: [0, compact ? 0.2 : 0, compact ? 5.5 : 7.5],
          fov: compact ? 40 : 30,
          near: 0.1,
          far: 40,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Scene works={works} compact={compact} onSelect={onSelect} />
      </Canvas>
    </GalleryScrollProvider>
  );
}
