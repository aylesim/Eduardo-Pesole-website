"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GalleryScrollState } from "@/components/index-gallery/GalleryScroll";
import type { GalleryWork } from "@/lib/gallery-works";

const vertexShader = /* glsl */ `
uniform float uCurl;
uniform float uCurlPos;
uniform float uFlip;
uniform float uPlaneH;

vec2 curlPlane(float x, float s, float r, float k, bool flip) {
  float v1 = flip ? s * k : s - s * k;
  float n1 = s > 0.0 ? 1.0 : -1.0;
  float t1 = 0.01;
  float e1 = flip ? n1 * v1 : n1 * x;
  float e2 = flip ? n1 * x : n1 * v1;

  if (r <= t1) {
    return vec2(x, 0.0);
  }
  if (e1 <= e2) {
    return vec2(x, 0.0);
  }

  float r2 = abs(s) / max(r, t1);
  float hp = 1.5707963;

  return vec2(
    v1 / r2 + cos(x / r2 - hp - v1 / r2),
    -sin(x / r2 + hp - v1 / r2) + 1.0
  ) * r2;
}

varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  float s = uPlaneH;
  float y01 = pos.y + s * 0.5;
  float r = abs(uCurl);
  bool flip = uFlip > 0.5;

  if (r > 0.01) {
    vec2 curled = curlPlane(y01, s, r, clamp(uCurlPos, 0.05, 0.95), flip);
    pos.y = curled.x - s * 0.5;
    pos.z += curled.y * (flip ? 1.0 : -1.0) * 0.35;
  }

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
  gap: number;
  onSelect: (work: GalleryWork) => void;
};

export default function CurvedPlane({
  work,
  index,
  store,
  width,
  height,
  gap,
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
      uCurl: { value: 0 },
      uCurlPos: { value: 0.55 },
      uFlip: { value: 0 },
      uPlaneH: { value: height },
      uOpacity: { value: 1 },
    }),
    [texture, height],
  );

  useFrame(() => {
    const mat = matRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh) return;

    const { current: activeIndex, velocity: scrollVel } = store.current;
    const dist = index - activeIndex;
    const abs = Math.abs(dist);

    const targetZ = -dist * gap;
    const targetY = dist * 0.08;
    const targetX = dist * 0.12;
    mesh.position.z += (targetZ - mesh.position.z) * 0.08;
    mesh.position.y += (targetY - mesh.position.y) * 0.08;
    mesh.position.x += (targetX - mesh.position.x) * 0.08;

    const targetScale = abs < 0.15 ? 1 : Math.max(0.88, 1 - abs * 0.06);
    const s = mesh.scale.x + (targetScale - mesh.scale.x) * 0.08;
    mesh.scale.setScalar(s);

    const near = Math.max(0, 1 - abs);
    const vel = THREE.MathUtils.clamp(scrollVel, -2.5, 2.5);
    const curlAmt =
      abs < 1.25
        ? THREE.MathUtils.lerp(
            0,
            1.15,
            Math.min(1, Math.abs(vel) * 0.55 + (1 - near) * 0.85),
          )
        : 0;

    mat.uniforms.uCurl.value = curlAmt;
    mat.uniforms.uFlip.value = vel >= 0 ? 1 : 0;
    mat.uniforms.uCurlPos.value = vel >= 0 ? 0.62 : 0.38;
    mat.uniforms.uOpacity.value =
      abs > 2.2 ? 0 : THREE.MathUtils.clamp(1.15 - abs * 0.35, 0.15, 1);

    mesh.visible = abs < 2.6;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, -index * gap]}
      onClick={(e) => {
        e.stopPropagation();
        if (Math.abs(index - store.current.current) < 0.45) onSelect(work);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <planeGeometry args={[width, height, 48, 48]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
