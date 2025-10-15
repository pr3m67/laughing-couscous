// 3D tilt effect for skill & project cards
function addTiltEffect(selector) {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `rotateY(${x / 25}deg) rotateX(${-y / 25}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  });
}

addTiltEffect(".project-card");
addTiltEffect(".skill-card");
