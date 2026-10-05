"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GalleryScrollState } from "@/components/index-gallery/GalleryScroll";
import type { GalleryWork } from "@/lib/gallery-works";

/**
 * Bend the plane onto the same circle the mesh center rides, so the
 * carousel reads as a curved wheel even while it is standing still.
 */
const vertexShader = /* glsl */ `
uniform float uRadius;
varying vec2 vUv;

void main() {
  vUv = uv;
  float a = position.y / max(uRadius, 0.001);
  vec3 pos = vec3(position.x, sin(a) * uRadius, (cos(a) - 1.0) * uRadius);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uMap;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uMap, vUv);
  gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
}
`;

type CurvedPlaneProps = {
  work: GalleryWork;
  index: number;
  store: { current: GalleryScrollState };
  width: number;
  height: number;
  radius: number;
  step: number;
  onSelect: (work: GalleryWork) => void;
};

export default function CurvedPlane({
  work,
  index,
  store,
  width,
  height,
  radius,
  step,
  onSelect,
}: CurvedPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const tex = loader.load(work.poster);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [work.poster]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uRadius: { value: radius },
      uOpacity: { value: 1 },
    }),
    [texture, radius],
  );

  const theta0 = index * step;

  useFrame(() => {
    const mat = matRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh) return;

    mat.uniforms.uRadius.value = radius;

    const theta = (index - store.current.current) * step;
    const abs = Math.abs(theta);

    mesh.position.y = Math.sin(theta) * radius;
    mesh.position.z = (Math.cos(theta) - 1) * radius;
    mesh.rotation.x = -theta;

    const fade = 1 - THREE.MathUtils.smoothstep(abs, step * 0.65, step * 2.15);
    mat.uniforms.uOpacity.value = fade;
    mat.depthWrite = fade > 0.9;
    mesh.visible = fade > 0.03;
    mesh.renderOrder = 100 - Math.round(abs * 20);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, Math.sin(theta0) * radius, (Math.cos(theta0) - 1) * radius]}
      rotation={[-theta0, 0, 0]}
      onClick={(event) => {
        event.stopPropagation();
        if (Math.abs(index - store.current.current) < 0.45) onSelect(work);
      }}
      onPointerOver={() => {
        if (Math.abs(index - store.current.current) < 0.45) {
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <planeGeometry args={[width, height, 1, 72]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        toneMapped={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}
