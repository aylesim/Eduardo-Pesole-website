"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GalleryScrollState } from "@/components/index-gallery/GalleryScroll";
import type { GalleryWork } from "@/lib/gallery-works";

const vertexShader = /* glsl */ `
uniform float uProgress;
uniform float uPlaneH;
varying vec2 vUv;

vec2 curlPlane(float x, float s, float r, float k, bool flip) {
  float v1 = flip ? s * k : s - s * k;
  float n1 = s > 0.0 ? 1.0 : -1.0;
  float e1 = flip ? n1 * v1 : n1 * x;
  float e2 = flip ? n1 * x : n1 * v1;

  if (r <= 0.25) return vec2(x, 0.0);
  if (e1 <= e2) return vec2(x, 0.0);

  float r2 = abs(s) / r;
  float hp = 1.5707963;
  return vec2(
    v1 / r2 + cos(x / r2 - hp - v1 / r2),
    -sin(x / r2 + hp - v1 / r2) + 1.0
  ) * r2;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  float progress = clamp(abs(uProgress), 0.0, 1.0);
  vec2 curled = curlPlane(
    pos.y + uPlaneH * 0.5,
    uPlaneH,
    progress * 1.15,
    progress,
    uProgress > 0.0
  );
  pos.y = curled.x - uPlaneH * 0.5;
  pos.z += curled.y * 0.32;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uMap;
uniform float uOpacity;
uniform float uImageAspect;
uniform float uPlaneAspect;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;

  // CSS object-fit: cover in shader space: crop, never stretch.
  if (uImageAspect > uPlaneAspect) {
    uv.x *= uPlaneAspect / uImageAspect;
  } else {
    uv.y *= uImageAspect / uPlaneAspect;
  }

  vec4 tex = texture2D(uMap, uv + 0.5);
  gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
}
`;

type CurvedPlaneProps = {
  work: GalleryWork;
  index: number;
  count: number;
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
  count,
  store,
  width,
  height,
  radius,
  step,
  onSelect,
}: CurvedPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const aspectRef = useRef(0);

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
      uProgress: { value: 0 },
      uPlaneH: { value: height },
      uOpacity: { value: 1 },
      uImageAspect: { value: 16 / 9 },
      uPlaneAspect: { value: width / height },
    }),
    [texture, width, height],
  );

  const theta0 = index * step;

  useFrame(() => {
    const mat = matRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh) return;

    let distance = index - store.current.current;
    distance -= Math.round(distance / count) * count;
    const theta = distance * step;
    const abs = Math.abs(theta);
    const fade = 1 - THREE.MathUtils.smoothstep(abs, step * 1.6, step * 4.2);

    const image = texture.image as
      | {
          naturalWidth?: number;
          naturalHeight?: number;
          width?: number;
          height?: number;
        }
      | undefined;
    const imageWidth = image?.naturalWidth ?? image?.width ?? 0;
    const imageHeight = image?.naturalHeight ?? image?.height ?? 0;
    if (imageWidth > 0 && imageHeight > 0) {
      const aspect = imageWidth / imageHeight;
      if (aspect !== aspectRef.current) {
        aspectRef.current = aspect;
        mat.uniforms.uImageAspect.value = aspect;
      }
    }

    // A face-on disc: every plane sits tangent to the same circle in XY.
    mesh.position.x = (Math.cos(theta) - 1) * radius;
    mesh.position.y = Math.sin(theta) * radius;
    mesh.position.z = -abs * 0.025;
    mesh.rotation.z = theta;

    mat.uniforms.uProgress.value =
      Math.abs(distance) < 0.2 ? 0 : THREE.MathUtils.clamp(distance, -1, 1);
    mat.uniforms.uOpacity.value = fade;
    mesh.visible = fade > 0.02;
    mesh.renderOrder = 100 - Math.round(abs * 20);
    mesh.updateMatrixWorld();
  });

  return (
    <mesh
      ref={meshRef}
      position={[(Math.cos(theta0) - 1) * radius, Math.sin(theta0) * radius, 0]}
      rotation={[0, 0, theta0]}
      onClick={(event) => {
        event.stopPropagation();
        let distance = index - store.current.current;
        distance -= Math.round(distance / count) * count;
        if (Math.abs(distance) < 0.45) onSelect(work);
      }}
      onPointerOver={() => {
        let distance = index - store.current.current;
        distance -= Math.round(distance / count) * count;
        if (Math.abs(distance) < 0.45) {
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
      frustumCulled={false}
    >
      <planeGeometry args={[width, height, 1, 28]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        toneMapped={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}
