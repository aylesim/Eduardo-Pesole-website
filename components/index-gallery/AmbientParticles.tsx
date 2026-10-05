"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
uniform float uTime;
uniform float uDpr;

void main() {
  vec3 pos = position;
  float time = uTime * aSpeed;
  pos.x += sin(time * 0.22 + aPhase) * 0.28;
  pos.y += cos(time * 0.18 + aPhase * 1.4) * 0.22;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * uDpr;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = /* glsl */ `
void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float alpha = 1.0 - smoothstep(0.18, 0.5, distanceToCenter);
  gl_FragColor = vec4(0.082, 0.078, 0.09, alpha * 0.55);
}
`;

function makeParticles(count: number) {
  let seed = 0x1c28;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (random() - 0.5) * 12;
    positions[i * 3 + 1] = (random() - 0.5) * 6.4;
    positions[i * 3 + 2] = -1.6 - random() * 1.4;
    phases[i] = random() * Math.PI * 2;
    speeds[i] = 0.45 + random() * 0.7;
    sizes[i] = 5 + random() * 8;
  }

  return { positions, phases, speeds, sizes };
}

export default function AmbientParticles({ compact }: { compact: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((state) => state.gl.getPixelRatio());
  const particleCount = compact ? 64 : 110;

  const geometry = useMemo(() => {
    const particles = makeParticles(particleCount);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(particles.positions, 3),
    );
    geo.setAttribute("aPhase", new THREE.BufferAttribute(particles.phases, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(particles.speeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(particles.sizes, 1));
    return geo;
  }, [particleCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDpr: { value: Math.min(dpr, 2) },
    }),
    [dpr],
  );

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value = clock.elapsedTime;
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
