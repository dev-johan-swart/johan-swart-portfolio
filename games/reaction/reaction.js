const box = document.getElementById("box");
const text = document.getElementById("text");

let startTime, waiting = false;

box.onclick = () => {
  if (!waiting) {
    text.textContent = "Wait for green...";
    box.style.background = "#aa3333";
    waiting = true;

    setTimeout(() => {
      startTime = performance.now();
      box.style.background = "#00ffcc";
      text.textContent = "CLICK!";
    }, Math.random() * 2000 + 1000);
  } else {
    const reaction = Math.round(performance.now() - startTime);
    text.textContent = `Reaction: ${reaction} ms`;
    box.style.background = "#222";
    waiting = false;
  }
};
