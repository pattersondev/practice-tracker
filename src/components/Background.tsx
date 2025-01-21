import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Background = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          float a = fract(sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453);
          float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453);
          float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
          float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
          
          return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }

        vec2 curl(vec2 p) {
          const float h = 0.01;
          float n = noise(p);
          float a = noise(p + vec2(h, 0.0));
          float b = noise(p + vec2(0.0, h));
          return vec2(b - n, n - a) / h;
        }

        void main() {
          vec2 uv = vUv;
          vec2 pos = (uv * 2.0 - 1.0) * vec2(resolution.x/resolution.y, 1.0);
          
          float t = time * 0.03;
          
          vec2 curl1 = curl(pos * 1.5 + t);
          vec2 curl2 = curl(pos * 2.5 - t * 1.2);
          vec2 curl3 = curl(pos * 1.0 + t * 0.8);
          
          float n1 = noise(pos + curl1 * 0.4);
          float n2 = noise(pos * 1.5 + curl2 * 0.3);
          float n3 = noise(pos * 2.0 + curl3 * 0.2);
          
          float finalNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
          
          vec3 color1 = vec3(0.05, 0.03, 0.1);   // Deep background
          vec3 color2 = vec3(0.15, 0.1, 0.2);    // Dark smoke
          vec3 color3 = vec3(0.3, 0.2, 0.4);     // Medium smoke
          vec3 color4 = vec3(0.4, 0.3, 0.5);     // Light wisps
          
          vec3 color = color1;
          color = mix(color, color2, smoothstep(0.2, 0.3, finalNoise));
          color = mix(color, color3, smoothstep(0.4, 0.6, finalNoise));
          color = mix(color, color4, pow(finalNoise, 2.0) * 0.7);
          
          float edge = 1.0 - smoothstep(0.4, 2.0, length(pos));
          color = mix(color1, color, edge);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    camera.position.z = 1;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      material.uniforms.resolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      material.uniforms.time.value += 0.015;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "#030306",
      }}
    />
  );
};
