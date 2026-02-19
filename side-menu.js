
// Page navigation 
document.querySelectorAll('.side-menu a').forEach(link => {
  link.addEventListener('click', e => {
    if (link.classList.contains('external-link')) return; // allow external links
    e.preventDefault();
    
    const pageId = link.dataset.page;

    // Hide all pages
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    
    // Show clicked page
    const page = document.getElementById(pageId);
    if (page) page.classList.add("active");

    // Close menu
    sideMenu.classList.remove("open");

    // Hide all panels inside the menu
    document.querySelectorAll('.menu-panel').forEach(panel => panel.classList.remove('active-panel'));

  });
});

// Open extra/help/settings panels
document.querySelectorAll('.side-menu a[data-menu]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const menu = link.dataset.menu;
    const panelId = "menu" + menu.charAt(0).toUpperCase() + menu.slice(1); // e.g., "menuHelp"
    const panel = document.getElementById(panelId);

    if (panel) {
      // Hide all panels first
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active-panel'));
      // Show the clicked panel
      panel.classList.add('active-panel');
      // Open side menu if it's closed
      sideMenu.classList.add('open');
    }
  });
});

// Menu toggle
const sideMenu = document.getElementById("sideMenu");
const menuToggle = document.getElementById("menuToggle");

// Toggle side menu
menuToggle.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    sideMenu.classList.remove("open");
    document.querySelectorAll('.menu-panel').forEach(panel => panel.classList.remove('active-panel'));
  }
});

// Extra Study Material Button
const studyButton = document.getElementById("studyButton");
if (studyButton) {
  studyButton.addEventListener("click", () => {
    window.open("https://react.dev/learn", "_blank");
  });
}

const studyButton2 = document.getElementById("studyButton2");
if (studyButton2) {
  studyButton2.addEventListener("click", () => {
    window.open("https://www.typescriptlang.org/docs", "_blank");
  });
}

const studyButton3 = document.getElementById("studyButton3");
if (studyButton3) {
  studyButton3.addEventListener("click", () => {
    window.open("https://jestjs.io/docs/getting-started", "_blank");
  });
}

// Dark / Light Mode
document.querySelectorAll("#themeToggle, #themeToggleMenu").forEach(btn => {
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");

    // update all theme buttons
    document.querySelectorAll("#themeToggle, #themeToggleMenu").forEach(b => {
      b.textContent = isDark ? "☀️" : "🌙";
    });
  });
});

// Inline handlers used intentionally to bypass menu event interception
// and guarantee navigation from animated menu panels.
function goToGame(path) {
  window.location.assign(path);
}

// Help / Troubleshoot
function openTroubleshoot() {
  alert("Troubleshooting guide coming soon!");
}
