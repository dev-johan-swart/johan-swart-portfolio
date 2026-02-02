# Modern E-Commerce Demo (HTML • CSS • JS)

A clean, modern, and fully functional **e-commerce demo app** built using **HTML, CSS, and minimal JavaScript**. This project is designed to demonstrate front‑end fundamentals, API-style data fetching, UI structure, component layout, and cart logic — all while keeping the code easy to follow and modify.

Perfect for showcasing in a **portfolio** or using as a **starter template** for real client work.

---

## 🚀 Features

- **Responsive product grid** styled with modern, clean CSS.
- **Dynamic product loading** via a `products.json` file (represents a mini API).
- **Add to Cart** functionality using simple JavaScript.
- **Cart sidebar** updates totals in real-time.
- **Currency adapted for South Africa (R)**.
- Clear component structure for easy customization.

---

## 📁 Project Structure

```
root/
│
├── index.html
├── style.css
├── script.js
├── products.json
└── /images
```

---

## 🖥️ How It Works

### 1️⃣ **index.html**
- Defines the layout (header, product grid, cart sidebar).
- Lightweight and easy to style.

### 2️⃣ **products.json**
- Acts like a small API.
- JavaScript fetches products from this file dynamically.

### 3️⃣ **script.js**
- Fetches product data.
- Renders product cards.
- Manages cart logic.
- Updates totals using the `currency` variable:

```js
const currency = "R"; 
```

### 4️⃣ **styles.css**
- Handles layout, grid, cards, cart sidebar, and responsive spacing.
- Fully customizable.

---

## 🛠️ Tech Used

- **HTML5** (semantic structure)
- **CSS3** (modern UI, responsive grid)
- **Vanilla JavaScript** (minimal, clean logic)
- **JSON** for mock API data fetching

No frameworks required — runs in any browser.

---

## 📦 How to Run Locally

1. Download or clone the repository.
2. Ensure your folder contains:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `products.json`
3. Simply open `index.html` in your browser.

> If you're using **VS Code**, you can run with Live Server (recommended).

---

## 🎨 Customizing the App

### Currency:
const currency = "R";
```

### Replace product images:
Update file paths inside `products.json` (store images in `/images`).

### Change layout or theme:
All UI design is located in **styles.css**.

---

## 💬 Interview Talking Points

- "I built the application as modular components: product cards, cart UI, and a JSON-driven product feed."
- "I used JSON as a mock API to demonstrate how real e-commerce apps fetch product data."
- "The UI is responsive and minimal by design, focusing on readability and UX."
- "Cart and totals work entirely with clean JavaScript, no frameworks needed."

Use these when explaining the project to employers.

---

## 🛒 Future Improvements

Potential additions for future versions:
- Product filtering or category tabs.
- Search bar.
- Quantity selector inside cart.
- LocalStorage support.
- User login.

---

## 🟢 About Shopify
Shopify is widely used in the real world for:
- Small to large stores.
- Rapid deployment.
- Secure hosting.
- Payment gateways.
- Inventory + admin tools.

As a **front‑end developer**, Shopify skills are valuable:
- Editing storefront themes.
- Writing CSS/JS improvements.
- Customizing Liquid templates.
- Building app integrations.

You don't need Shopify for this demo — but learning it can definitely boost job opportunities.

---

## ✔️ Project Ready
Your e-commerce demo is now fully structured, clean, and portfolio-ready.
Feel free to ask for new features, styling upgrades, or improvements!
