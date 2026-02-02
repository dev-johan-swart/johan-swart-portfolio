const icons = ["🍀","🍀","🔥","🔥","⚡","⚡","🌙","🌙"];
let first, lock;

function start() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  lock = false;
  first = null;

  icons.sort(() => Math.random() - 0.5).forEach(icon => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.icon = icon;
    card.onclick = () => flip(card);
    grid.appendChild(card);
  });
}

function flip(card) {
  if (lock || card.classList.contains("flipped")) return;

  card.textContent = card.dataset.icon;
  card.classList.add("flipped");

  if (!first) {
    first = card;
  } else {
    lock = true;
    setTimeout(() => {
      if (first.dataset.icon !== card.dataset.icon) {
        first.textContent = "";
        card.textContent = "";
        first.classList.remove("flipped");
        card.classList.remove("flipped");
      }
      first = null;
      lock = false;
    }, 600);
  }
}

start();
