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
  onActiveChange: (index: number) => void;
};

function Scene({
  works,
  onSelect,
}: {
  works: GalleryWork[];
  onSelect: (work: GalleryWork) => void;
}) {
  const { store } = useGalleryScroll();

  const width = 2.35;
  const height = 3.15;
  const gap = 2.85;

  return (
    <group position={[-1.15, 0, 0]}>
      <color attach="background" args={["#eeeeee"]} />
      <ambientLight intensity={1} />
      {works.map((work, i) => (
        <CurvedPlane
          key={work.slug}
          work={work}
          index={i}
          store={store}
          width={width}
          height={height}
          gap={gap}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

export default function IndexGalleryCanvas({ works, onActiveChange }: Props) {
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
        className="h-full w-full touch-none"
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        camera={{ position: [0, 0, 6.2], fov: 32, near: 0.1, far: 80 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#eeeeee", 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Scene works={works} onSelect={onSelect} />
      </Canvas>
    </GalleryScrollProvider>
  );
}
