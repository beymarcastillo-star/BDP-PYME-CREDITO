// DÍA 1
// Lógica del slider de fondo con cambio automático cada 3 segundos.

const slides = document.querySelectorAll('.bg-slide');
let currentSlide = 0;

function changeBackground() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

setInterval(changeBackground, 3000);