"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { GalleryScrollState } from "@/components/index-gallery/GalleryScroll";

const vertexShader = /* glsl */ `
attribute float aSpeed;
attribute float aSize;
uniform float uScroll;
uniform float uVelocity;
uniform float uDpr;
uniform vec2 uCenter;

void main() {
  vec2 p = position.xy;
  vec2 center = uCenter;
  vec2 offset = p - center;
  float radius = max(length(offset), 0.001);
  float angle = atan(offset.y, offset.x) + uScroll * aSpeed * 0.72;
  vec3 pos = vec3(center + vec2(cos(angle), sin(angle)) * radius, position.z);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (1.0 + min(abs(uVelocity), 2.2) * 0.85) * uDpr;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = /* glsl */ `
uniform float uVelocity;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float stretch = 1.0 + min(abs(uVelocity), 2.2) * 2.4;
  uv.y /= stretch;
  float distanceToCenter = length(uv);
  float alpha = 1.0 - smoothstep(0.04, 0.5, distanceToCenter);
  float presence = 0.34 + min(abs(uVelocity), 1.6) * 0.18;
  gl_FragColor = vec4(0.07, 0.075, 0.09, alpha * presence);
}
`;

function makeParticles(count: number, centerX: number, centerY: number) {
  let seed = 0x1c28;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 0.55 + random() * 3.15;
    positions[i * 3] = centerX + Math.cos(angle) * radius;
    positions[i * 3 + 1] = centerY + Math.sin(angle) * radius;
    positions[i * 3 + 2] = -1.35 - random() * 1.5;
    speeds[i] = 0.65 + random() * 0.7;
    sizes[i] = 2.6 + random() * 2.4;
  }

  return { positions, speeds, sizes };
}

type Props = {
  compact: boolean;
  store: { current: GalleryScrollState };
  centerX: number;
  centerY: number;
};

export default function AmbientParticles({
  compact,
  store,
  centerX,
  centerY,
}: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((state) => state.gl.getPixelRatio());
  const particleCount = compact ? 42 : 72;

  const geometry = useMemo(() => {
    const particles = makeParticles(particleCount, centerX, centerY);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(particles.positions, 3),
    );
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(particles.speeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(particles.sizes, 1));
    return geo;
  }, [centerX, centerY, particleCount]);

  const uniforms = useMemo(
    () => ({
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uDpr: { value: Math.min(dpr, 2) },
      uCenter: { value: new THREE.Vector2(centerX, centerY) },
    }),
    [centerX, centerY, dpr],
  );

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uScroll.value = store.current.current;
    material.uniforms.uVelocity.value = store.current.velocity;
    material.uniforms.uCenter.value.set(centerX, centerY);
  });

  return (
    <points geometry={geometry} frustumCulled={false} renderOrder={-10}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </points>
  );
}
