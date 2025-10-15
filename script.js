// Initialize interactive effects
(function () {
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };

  onReady(() => {
    // 1) Scroll reveal
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // 2) Tilt effect on cards
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tiltTargets = document.querySelectorAll('.skill-card, .project-card');

    if (!prefersReducedMotion) {
      tiltTargets.forEach((card) => {
        let raf = 0;
        const onMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width; // 0..1
          const y = (e.clientY - rect.top) / rect.height; // 0..1
          const rotY = (x - 0.5) * 16; // deg
          const rotX = (0.5 - y) * 10; // deg
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            card.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
            card.style.boxShadow = `0 18px 45px rgba(0,0,0,0.12)`;
          });
        };
        const onLeave = () => {
          cancelAnimationFrame(raf);
          card.style.transform = '';
          card.style.boxShadow = '';
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
      });
    }

    // 3) Three.js background in hero
    const threeContainer = document.getElementById('three-container');
    const hero = document.querySelector('.hero');

    if (threeContainer && hero && window.THREE) {
      const { THREE } = window;
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const resize = () => {
        const w = hero.clientWidth;
        const h = hero.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      threeContainer.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.set(0, 0, 6);

      // TorusKnot centerpiece
      const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 220, 30);
      const material = new THREE.MeshStandardMaterial({
        color: 0x8a63f4,
        metalness: 0.7,
        roughness: 0.2,
        transparent: true,
        opacity: 0.95,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Subtle wireframe overlay for a tech look
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const wire = new THREE.Mesh(geometry, wireMaterial);
      scene.add(wire);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const light1 = new THREE.PointLight(0xff66cc, 1.0);
      light1.position.set(3, 3, 3);
      scene.add(light1);
      const light2 = new THREE.PointLight(0x6b8cff, 0.8);
      light2.position.set(-3, -2, 2);
      scene.add(light2);

      // Animate
      let animId = 0;
      const animate = () => {
        mesh.rotation.x += 0.004;
        mesh.rotation.y += 0.006;
        wire.rotation.copy(mesh.rotation);
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };

      // Parallax from pointer
      const onPointerMove = (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        camera.position.x = x * 0.8;
        camera.position.y = -y * 0.8;
        camera.lookAt(0, 0, 0);
      };

      // Lifecycle
      const onVisibilityChange = () => {
        if (document.hidden) {
          cancelAnimationFrame(animId);
        } else {
          animId = requestAnimationFrame(animate);
        }
      };

      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', onVisibilityChange);
      hero.addEventListener('pointermove', onPointerMove);

      resize();
      animId = requestAnimationFrame(animate);
    }
  });
})();
