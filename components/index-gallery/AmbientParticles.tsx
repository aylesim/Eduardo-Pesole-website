"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
uniform float uTime;

void main() {
  vec3 pos = position;
  float time = uTime * aSpeed;
  pos.x += sin(time * 0.18 + aPhase) * 0.11;
  pos.y += cos(time * 0.14 + aPhase * 1.7) * 0.09;
  pos.z += sin(time * 0.1 + aPhase * 0.7) * 0.04;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (18.0 / max(1.0, -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = /* glsl */ `
void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float alpha = 1.0 - smoothstep(0.08, 0.5, distanceToCenter);
  gl_FragColor = vec4(0.082, 0.078, 0.09, alpha * 0.16);
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
    positions[i * 3] = (random() - 0.5) * 11;
    positions[i * 3 + 1] = (random() - 0.5) * 5.2;
    positions[i * 3 + 2] = -0.8 - random() * 2.4;
    phases[i] = random() * Math.PI * 2;
    speeds[i] = 0.55 + random() * 0.9;
    sizes[i] = 0.55 + random() * 1.1;
  }

  return { positions, phases, speeds, sizes };
}

export default function AmbientParticles({ compact }: { compact: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const particleCount = compact ? 48 : 76;
  const particles = useMemo(
    () => makeParticles(particleCount),
    [particleCount],
  );
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points frustumCulled={false} renderOrder={-10}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[particles.phases, 1]}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          args={[particles.speeds, 1]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
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
