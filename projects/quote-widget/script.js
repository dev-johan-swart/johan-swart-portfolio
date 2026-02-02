// Quotes Array
const quotes = [
    "Believe you can and you're halfway there.",
    "Every moment is a fresh beginning.",
    "Dream it. Wish it. Do it.",
    "It always seems impossible until it’s done.",
    "Start where you are. Use what you have. Do what you can.",
    "Positive thoughts create positive results.",
    "Your only limit is your mind.",
    "Small steps every day lead to big results.",
];

// Select HTML elements
const quoteText = document.getElementById("quote");
const newQuoteBtn = document.getElementById("new-quote-btn");

// Function to get a random quote
function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

// Display first quote
function displayQuote() {
    quoteText.style.opacity = 0; // reset fade
    setTimeout(() => {
        quoteText.textContent = getRandomQuote();
        quoteText.style.animation = "none"; // reset animation
        void quoteText.offsetWidth; // magic trick to restart CSS animation
        quoteText.style.animation = "fadeQuote 0.8s ease forwards";
    }, 200);
}

// Event Listener for button
newQuoteBtn.addEventListener("click", displayQuote);

// Show first quote on page load
displayQuote();
