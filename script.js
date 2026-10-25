
"use strict";

// Cập nhật năm tự động
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Đánh dấu trang đang mở
const currentPage =
  window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-links a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

// Menu điện thoại
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

// Bầu trời sao
const canvas = document.getElementById("stars");
const ctx = canvas ? canvas.getContext("2d") : null;

let stars = [];
let width = 0;
let height = 0;
let animationId = null;

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function resizeCanvas() {
  if (!canvas || !ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(
    150,
    Math.floor((width * height) / 8500)
  );

  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.3 + 0.3,
    alpha: Math.random() * 0.65 + 0.15,
    speed: Math.random() * 0.008 + 0.002,
    phase: Math.random() * Math.PI * 2
  }));

  if (reduceMotion) drawStaticStars();
}

function drawStaticStars() {
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(
      star.x, star.y, star.radius, 0, Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(240, 220, 169, ${star.alpha})`;

    ctx.fill();
  });
}

function drawStars(time) {
  if (!ctx || reduceMotion) return;

  ctx.clearRect(0, 0, width, height);

  stars.forEach(star => {
    const alpha = star.alpha * (
      0.65 +
      0.35 * Math.sin(time * star.speed + star.phase)
    );

    ctx.beginPath();
    ctx.arc(
      star.x, star.y, star.radius, 0, Math.PI * 2
    );

    ctx.fillStyle = `rgba(240, 220, 169, ${alpha})`;
    ctx.fill();
  });

  animationId = requestAnimationFrame(drawStars);
}

function startAnimation() {
  if (!reduceMotion && animationId === null) {
    animationId = requestAnimationFrame(drawStars);
  }
}

function stopAnimation() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

if (canvas && ctx) {
  resizeCanvas();

  if (reduceMotion) {
    drawStaticStars();
  } else {
    startAnimation();
  }

  window.addEventListener("resize", resizeCanvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    // THAY BẰNG EMAIL NHẬN THƯ CỦA EM
    const destination = "huuduydang2206@gmail.com";


    const subject = encodeURIComponent(
      `Portfolio message from ${name}`
    );

    const body = encodeURIComponent(
      `Tên: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href =
      `mailto:${destination}?subject=${subject}&body=${body}`;
  });
}
const meteorLayer = document.createElement("div");
meteorLayer.id = "shooting-stars";
document.body.appendChild(meteorLayer);

function createMeteor() {
  const meteor = document.createElement("span");
  meteor.className = "shooting-star";

  const startX = 20 + Math.random() * 100;
  const startY = Math.random() * 75;

  meteor.style.left = `${startX}vw`;
  meteor.style.top = `${startY}vh`;
  meteor.style.setProperty(
    "--length",
    `${80 + Math.random() * 130}px`
  );
  meteor.style.setProperty(
    "--duration",
    `${0.8 + Math.random() * 0.8}s`
  );

  meteorLayer.appendChild(meteor);

  meteor.addEventListener("animationend", () => {
    meteor.remove();
  });
}

function meteorShower() {
  // Mỗi đợt có 2–5 sao băng
  const count = 2 + Math.floor(Math.random() * 4);

  for (let i = 0; i < count; i++) {
    setTimeout(createMeteor, i * (100 + Math.random() * 250));
  }

  // Đợt tiếp theo sau khoảng 2–3 giây
  const nextDelay = 2000 + Math.random() * 1000;
  setTimeout(meteorShower, nextDelay);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  meteorShower();
}