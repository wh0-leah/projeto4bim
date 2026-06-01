// Star rating component
let selectedRating = 0;

export function initRating() {
  const stars = document.querySelectorAll('.star');
  const label = document.getElementById('rating-label');
  const input = document.getElementById('aval-nota');
  selectedRating = 0;

  const labels = {
    1: '1 — Terrível', 2: '2 — Muito ruim', 3: '3 — Ruim',
    4: '4 — Abaixo da média', 5: '5 — Médio',
    6: '6 — Razoável', 7: '7 — Bom',
    8: '8 — Muito bom', 9: '9 — Excelente', 10: '10 — Obra-prima!'
  };

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const val = Number(star.dataset.value);
      stars.forEach(s => s.classList.toggle('active', Number(s.dataset.value) <= val));
      if (label) label.textContent = labels[val] || `Nota: ${val}`;
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.toggle('active', Number(s.dataset.value) <= selectedRating));
      if (label) label.textContent = selectedRating > 0 ? labels[selectedRating] : 'Selecione uma nota (1-10)';
    });

    star.addEventListener('click', () => {
      selectedRating = Number(star.dataset.value);
      if (input) input.value = selectedRating;
      stars.forEach(s => s.classList.toggle('active', Number(s.dataset.value) <= selectedRating));
      if (label) label.textContent = labels[selectedRating];
    });
  });
}

export function setRating(nota) {
  selectedRating = Number(nota);
  const stars = document.querySelectorAll('.star');
  const input = document.getElementById('aval-nota');
  if (input) input.value = selectedRating;
  stars.forEach(s => s.classList.toggle('active', Number(s.dataset.value) <= selectedRating));
}

export function getRating() { return selectedRating; }
