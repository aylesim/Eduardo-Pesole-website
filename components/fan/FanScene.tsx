"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RoundedPlaneGeometry } from "maath/geometry";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import {
  MathUtils,
  SRGBColorSpace,
  type Mesh,
  type MeshBasicMaterial,
  type Texture,
} from "three";
import { plateSrc } from "@/lib/content";
import { FAN, clampScroll, fanTransform } from "@/lib/fan";
import { fanScroll } from "@/lib/fan-scroll";
import type { WorkItem } from "@/lib/types";

type FanSceneProps = {
  items: WorkItem[];
  mobile: boolean;
  onActiveChange: (index: number) => void;
  onPlaneClick: (index: number) => void;
};

type FanPlaneProps = {
  index: number;
  geometry: RoundedPlaneGeometry;
  visibleMax: number;
  onPlaneClick: (index: number) => void;
};

function FanPlane({
  index,
  geometry,
  visibleMax,
  onPlaneClick,
  url,
}: FanPlaneProps & { url: string }) {
  const mesh = useRef<Mesh>(null);
  const raw = useTexture(url) as Texture;
  const map = useMemo(() => {
    const t = raw.clone();
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  }, [raw]);

  useLayoutEffect(() => {
    return () => {
      map.dispose();
    };
  }, [map]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const t = index - fanScroll.current;
    if (t < FAN.visibleMin || t > visibleMax) {
      m.visible = false;
      return;
    }
    m.visible = true;
    const xf = fanTransform(t);
    m.position.set(xf.x, xf.y, xf.z);
    m.scale.setScalar(xf.scale);
    const mat = m.material as MeshBasicMaterial;
    mat.opacity = xf.opacity;
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        onPlaneClick(index);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "grab";
      }}
    >
      <meshBasicMaterial
        map={map}
        transparent
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function PlaceholderPlane({
  index,
  geometry,
  visibleMax,
  onPlaneClick,
}: FanPlaneProps) {
  const mesh = useRef<Mesh>(null);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const t = index - fanScroll.current;
    if (t < FAN.visibleMin || t > visibleMax) {
      m.visible = false;
      return;
    }
    m.visible = true;
    const xf = fanTransform(t);
    m.position.set(xf.x, xf.y, xf.z);
    m.scale.setScalar(xf.scale);
    const mat = m.material as MeshBasicMaterial;
    mat.opacity = xf.opacity * 0.92;
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        onPlaneClick(index);
      }}
    >
      <meshBasicMaterial color="#221E1A" transparent depthWrite={false} />
    </mesh>
  );
}

function Planes({
  items,
  geometry,
  visibleMax,
  onPlaneClick,
}: {
  items: WorkItem[];
  geometry: RoundedPlaneGeometry;
  visibleMax: number;
  onPlaneClick: (index: number) => void;
}) {
  return (
    <>
      {items.map((work, index) => {
        const src = plateSrc(work);
        if (!src) {
          return (
            <PlaceholderPlane
              key={work.slug}
              index={index}
              geometry={geometry}
              visibleMax={visibleMax}
              onPlaneClick={onPlaneClick}
            />
          );
        }
        return (
          <Suspense
            key={work.slug}
            fallback={
              <PlaceholderPlane
                index={index}
                geometry={geometry}
                visibleMax={visibleMax}
                onPlaneClick={onPlaneClick}
              />
            }
          >
            <FanPlane
              index={index}
              geometry={geometry}
              visibleMax={visibleMax}
              onPlaneClick={onPlaneClick}
              url={src}
            />
          </Suspense>
        );
      })}
    </>
  );
}

export default function FanScene({
  items,
  mobile,
  onActiveChange,
  onPlaneClick,
}: FanSceneProps) {
  const lastActive = useRef(-1);
  const visibleMax = mobile ? FAN.visibleMaxMobile : FAN.visibleMaxDesktop;
  const geometry = useMemo(
    () => new RoundedPlaneGeometry(FAN.planeW, FAN.planeH, FAN.radius, 16),
    [],
  );

  useLayoutEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((_, dt) => {
    const max = Math.max(items.length - 1, 0);
    fanScroll.target = clampScroll(fanScroll.target, max);
    fanScroll.current = MathUtils.damp(
      fanScroll.current,
      fanScroll.target,
      FAN.damp,
      dt,
    );
    const next = Math.round(clampScroll(fanScroll.current, max));
    if (next !== lastActive.current) {
      lastActive.current = next;
      onActiveChange(next);
    }
  });

  return (
    <>
      <color attach="background" args={["#0C0B0A"]} />
      <group position={[-1.15, -0.4, 0]}>
        <Planes
          items={items}
          geometry={geometry}
          visibleMax={visibleMax}
          onPlaneClick={onPlaneClick}
        />
      </group>
    </>
  );
}
