/* ═══════════════════════════════════════════════════
   BLACK WATER SHADER — WebGL Hero Background
   Adapted from effect-wavefield skill
   Dark water surface with purple light reflections
   ═══════════════════════════════════════════════════ */

import * as THREE from 'three';

const canvas = document.getElementById('hero-water');
if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

  let scene, camera, renderer, material, clock;
  let mouse = new THREE.Vector2(0.5, 0.5);
  let targetMouse = new THREE.Vector2(0.5, 0.5);

  const uniforms = {
    t: { value: 0.0 },
    r: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    mouse: { value: new THREE.Vector2(0.5, 0.5) }
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec2 r;
    uniform float t;
    uniform vec2 mouse;
    varying vec2 vUv;

    #define PI 3.14159265359

    mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
    }

    // Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= (1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h));
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Water ripple wave
    float waterWave(vec2 p, float phase, float freq) {
      return sin(p.x * freq + phase) * 0.15 * sin(p.y * freq * 0.7 + phase * 0.5);
    }

    // Soft reflection line
    float reflectionLine(float dist, float thickness, float intensity) {
      return intensity * thickness / (abs(dist) + thickness * 0.8);
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;
      uv.x *= r.x / r.y;
      vec2 uv0 = uv;

      float time = t * 0.25; // Slow, meditative

      // Base: pure black
      vec3 col = vec3(0.0);

      // Water noise layers — dark, subtle undulation
      float n1 = snoise(uv * 1.5 + time * 0.15) * 0.5 + 0.5;
      float n2 = snoise(uv * 3.0 - time * 0.1 + 10.0) * 0.5 + 0.5;
      float n3 = snoise(uv * 6.0 + time * 0.08 + 20.0) * 0.5 + 0.5;

      // Very subtle surface variation (barely visible dark grays)
      float surface = n1 * 0.4 + n2 * 0.35 + n3 * 0.25;
      col += vec3(surface * 0.04);

      // Mouse-reactive distortion (gravity pull on water)
      vec2 mouse_uv = (mouse - 0.5) * 2.0;
      mouse_uv.x *= r.x / r.y;
      float mouseDist = length(uv - mouse_uv);
      uv += (mouse_uv - uv) * (0.15 / (mouseDist + 0.6));

      // Mouse glow — subtle purple reflection at cursor
      float mouseGlow = 0.06 / (mouseDist + 0.15);
      mouseGlow *= (sin(t * 1.2) * 0.3 + 0.7);
      col += mouseGlow * vec3(0.45, 0.2, 0.65) * 0.5;

      // Slow rotation for organic feel
      uv *= rot(time * 0.03);
      float waveNoise = snoise(uv * 2.5 + time * 0.15) * 0.08;

      // Purple accent (#A855F7) = vec3(0.659, 0.333, 0.969)
      vec3 purpleAccent = vec3(0.659, 0.333, 0.969);
      vec3 dimPurple = purpleAccent * 0.25;

      // Water reflection lines — very thin, dim, like moonlight on water
      float y1 = uv.y - waterWave(uv, time * 1.2, 2.2) + waveNoise;
      float line1 = reflectionLine(y1, 0.015, 0.4);
      col += dimPurple * line1;

      float y2 = uv.y + 0.5 - waterWave(uv + vec2(1.5, 0.3), time * 0.9, 2.8) + waveNoise * 0.8;
      float line2 = reflectionLine(y2, 0.012, 0.35);
      col += dimPurple * 0.7 * line2;

      float y3 = uv.y - 0.5 - waterWave(uv + vec2(-0.8, 1.2), time * 1.5, 1.6) + waveNoise * 1.2;
      float line3 = reflectionLine(y3, 0.01, 0.3);
      col += dimPurple * 0.5 * line3;

      // Additional faint ripple lines
      float y4 = uv.y + 0.25 - waterWave(uv + vec2(2.0, -0.5), time * 0.7, 3.2) + waveNoise * 0.6;
      float line4 = reflectionLine(y4, 0.008, 0.2);
      col += vec3(0.3, 0.25, 0.4) * line4;

      // Concentric ripple from center — very subtle
      float dist = length(uv0);
      float ripple = abs(sin(dist * 5.0 - t * 0.8)) * exp(-dist * 1.2);
      col += purpleAccent * ripple * 0.04;

      // Center glow — very faint purple luminance
      float centerGlow = exp(-dist * 0.8) * 0.08;
      col += centerGlow * dimPurple;

      // Vignette — darken edges heavily
      float vignette = 1.0 - dist * 0.6;
      vignette = smoothstep(0.0, 1.0, vignette);
      col *= vignette;

      // Gamma
      col = pow(col, vec3(0.95));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.PlaneGeometry(2, 2);
    material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('resize', onResize);
  }

  function onMouseMove(e) {
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      targetMouse.x = e.touches[0].clientX / window.innerWidth;
      targetMouse.y = 1.0 - (e.touches[0].clientY / window.innerHeight);
    }
  }

  function onResize() {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    renderer.setSize(w, h);
    uniforms.r.value.set(w, h);
  }

  function animate() {
    requestAnimationFrame(animate);
    uniforms.t.value = clock.getElapsedTime();
    mouse.lerp(targetMouse, 0.04);
    uniforms.mouse.value.copy(mouse);
    renderer.render(scene, camera);
  }

  init();
  animate();
}
