// 3D tilt effect for skill & project cards
function addTiltEffect(selector) {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const boundingRect = card.getBoundingClientRect();
      const offsetX = event.clientX - boundingRect.left - boundingRect.width / 2;
      const offsetY = event.clientY - boundingRect.top - boundingRect.height / 2;
      card.style.transform = `rotateY(${offsetX / 25}deg) rotateX(${-offsetY / 25}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  });
}

// Card shine cursor tracking
function addCardShine(selector) {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      card.style.setProperty("--mx", `${mouseX}px`);
      card.style.setProperty("--my", `${mouseY}px`);
    });
  });
}

// Scroll reveal animations
function setupScrollReveal() {
  const revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length === 0) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

// Cursor glow follower
function setupCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    glow.style.left = `${targetX}px`;
    glow.style.top = `${targetY}px`;
    return;
  }

  function animate() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(animate);
  }
  animate();
}

// Three.js hero visual
function initHero3D() {
  const container = document.getElementById("hero-3d");
  if (!container) return;
  if (typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0.2, 4.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearAlpha(0);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const rimLight = new THREE.DirectionalLight(0xec4899, 1.0);
  rimLight.position.set(-2, 3, 5);
  scene.add(rimLight);
  const keyLight = new THREE.DirectionalLight(0x7b61ff, 0.9);
  keyLight.position.set(2, -1, 3);
  scene.add(keyLight);

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.TorusKnotGeometry(1.05, 0.32, 220, 32, 2, 3);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x7b61ff,
    emissive: 0xa855f7,
    emissiveIntensity: 0.18,
    roughness: 0.35,
    metalness: 0.15,
    clearcoat: 0.6,
    clearcoatRoughness: 0.45,
    sheen: 1.0,
    sheenColor: new THREE.Color(0xec4899),
    sheenRoughness: 0.8,
  });
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  let pointerX = 0;
  let pointerY = 0;
  container.addEventListener("pointermove", (event) => {
    const rect = container.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width * 2 - 1; // -1..1
    const ny = (event.clientY - rect.top) / rect.height * 2 - 1; // -1..1
    pointerX = nx;
    pointerY = ny;
  });

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = Math.max(w / h, 0.01);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tick() {
    if (!prefersReducedMotion) {
      mesh.rotation.y += 0.0035;
      mesh.rotation.x += 0.0015;
      group.rotation.y += (pointerX * 0.35 - group.rotation.y) * 0.08;
      group.rotation.x += (-pointerY * 0.25 - group.rotation.x) * 0.08;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

// Profile image fallback to placeholder if missing
function setupProfileImageFallback() {
  const img = document.getElementById("profile-img");
  if (!img) return;
  img.loading = "lazy";
  img.addEventListener("error", () => {
    img.src = "assets/profile-placeholder.svg";
  });
}

// Init on DOM ready
window.addEventListener("DOMContentLoaded", () => {
  addTiltEffect(".project-card");
  addTiltEffect(".skill-card");
  addCardShine(".project-card");
  addCardShine(".skill-card");
  setupScrollReveal();
  setupCursorGlow();
  setupProfileImageFallback();
  initHero3D();
});
