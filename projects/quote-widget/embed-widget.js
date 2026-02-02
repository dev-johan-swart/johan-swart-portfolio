(function(config) {
    const defaults = {
        position: 'center',
        accentColor: '#00ffcc',
        fontSize: '1.2rem',
        initialQuote: 'Believe in yourself!'
    };
    const settings = Object.assign({}, defaults, config);

    // Container
    const container = document.createElement('div');
    container.className = 'quote-widget-container';
    document.body.appendChild(container);

    // Position
    const posMap = {
        'top-left': 'top:20px; left:20px; transform:none;',
        'top-right': 'top:20px; right:20px; transform:none;',
        'bottom-left': 'bottom:20px; left:20px; transform:none;',
        'bottom-right': 'bottom:20px; right:20px; transform:none;',
        'center': 'top:50%; left:50%; transform:translate(-50%, -50%);'
    };
    container.style.position = 'fixed';
    container.style.zIndex = 9999;
    container.style.cssText += posMap[settings.position] || posMap['center'];

    // Styles
    const style = document.createElement('style');
    style.textContent = `

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
}

body, button, p, h2 {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    background: #0f313d;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.glass-card {
     width: 320px;
    padding: 25px;
    border-radius: 20px;
    background: rgba(0,0,0,0.15);
    backdrop-filter: blur(18px) saturate(160%);
    border: 1px solid ${settings.accentColor};
    box-shadow: 0 8px 30px rgba(0,0,0,0.25), 0 0 20px ${settings.accentColor} inset;
    text-align: center;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    position: relative;
    cursor: grab;
}
        .glass-card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 28px ${settings.accentColor} inset;
        }
        .title {
            font-size: 1.6rem;
            font-weight: 600;
            background: linear-gradient(135deg, rgb(15,49,77), rgb(6,213,250));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 15px;
        }
        .quote-text {
            font-size: ${settings.fontSize};
            font-weight: 400;
            color: ${settings.accentColor};
            line-height: 1.5;
            letter-spacing: 0.3px;
            min-height: 60px;
            opacity: 0;
            animation: fadeQuote 0.8s ease forwards;
        }
        .new-quote-btn {
            margin-top: 15px;
            padding: 10px 20px;
            font-size: 1rem;
            cursor: pointer;
            background: rgba(0,255,204,0.2);
            border: 1px solid ${settings.accentColor};
            border-radius: 14px;
            color: ${settings.accentColor};
            font-weight: 500;
            transition: 0.3s ease, transform 0.3s ease;
        }
        .new-quote-btn:hover {
            background: rgba(6,213,250,0.3);
            transform: scale(1.08);
            box-shadow: 0 6px 18px rgba(6,213,250,0.4), 0 0 8px ${settings.accentColor} inset;
        }
        .close-btn {
            position: absolute;
            top: 10px;
            right: 12px;
            background: transparent;
            border: none;
            font-size: 1.2rem;
            color: ${settings.accentColor};
            cursor: pointer;
        }
        @keyframes fadeQuote {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // HTML
    container.innerHTML = `
        <div class="glass-card">
            <button class="close-btn" title="Close">&times;</button>
            <h2 class="title">Quote of the Day</h2>
            <p class="quote-text" id="quote">${settings.initialQuote}</p>
            <button class="new-quote-btn" id="new-quote-btn">New Quote</button>
        </div>
    `;

    // Quotes array
    const quotes = [
        "Believe you can and you're halfway there.",
        "Every moment is a fresh beginning.",
        "Dream it. Wish it. Do it.",
        "It always seems impossible until it’s done.",
        "Start where you are. Use what you have. Do what you can.",
        "Positive thoughts create positive results.",
        "Your only limit is your mind.",
        "Small steps every day lead to big results."
    ];

    const quoteText = document.getElementById("quote");
    const newQuoteBtn = document.getElementById("new-quote-btn");
    const closeBtn = container.querySelector('.close-btn');
    const card = container.querySelector('.glass-card');

    // Display random quote
    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    function displayQuote() {
        quoteText.style.opacity = 0;
        setTimeout(() => {
            quoteText.textContent = getRandomQuote();
            quoteText.style.animation = "none";
            void quoteText.offsetWidth;
            quoteText.style.animation = "fadeQuote 0.8s ease forwards";
        }, 200);
    }

    newQuoteBtn.addEventListener('click', displayQuote);

    // Close widget
    closeBtn.addEventListener('click', () => {
        container.remove();
    });

    // Draggable functionality
    let isDragging = false, offsetX, offsetY;
    card.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - card.getBoundingClientRect().left;
        offsetY = e.clientY - card.getBoundingClientRect().top;
        card.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        card.style.left = `${e.clientX - offsetX}px`;
        card.style.top = `${e.clientY - offsetY}px`;
        card.style.transform = 'none';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        card.style.cursor = 'grab';
    });

})();
