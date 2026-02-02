// Random quote on start
const quoteList = [
    "Believe in yourself!",
    "You are stronger than you think.",
    "Every step forward matters.",
    "Today is a fresh start.",
    "Keep going—you’re doing great!"
];

(function(config) {
    const defaults = {
        position: 'bottom-right', 
        accentColor: '#00ffcc',
        fontSize: '1.2rem',
        initialQuote: quoteList[Math.floor(Math.random() * quoteList.length)]
    };
    const settings = Object.assign({}, defaults, config);

    // Container
    const container = document.createElement('div');
    container.className = 'quote-widget-container';
    container.style.position = 'absolute';
    container.style.zIndex = 9999;
    container.style.touchAction = 'none'; 
    container.style.opacity = '0'; 
    const parent = document.getElementById("quote-widget-mount");
    parent.style.position = 'relative';
    parent.appendChild(container);

    // Initial position
    const posMap = {
        'top-left': { top: '10px', left: '10px' },
        'top-right': { top: '10px', right: '10px' },
        'bottom-left': { bottom: '10px', left: '10px' },
        'bottom-right': { bottom: '10px', right: '10px' },
        'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    };

    const pos = posMap[settings.position] || posMap['bottom-right'];
    for (let key in pos) container.style[key] = pos[key];

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        .glass-card {
            width: 260px;
            padding: 18px;
            border-radius: 18px;
            background: rgba(0,0,0,0.05);
            backdrop-filter: blur(4px) saturate(120%);
            border: 1px solid ${settings.accentColor};
            box-shadow: 0 6px 20px rgba(0,0,0,0.2), 0 0 15px ${settings.accentColor} inset;
            text-align: center;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
            position: relative;
            cursor: grab;
            overflow: hidden;
        }
        .glass-card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 12px 30px rgba(0,0,0,0.25), 0 0 20px ${settings.accentColor} inset;
        }
        .drag-handle {
            position: absolute;
            top: 10px;
            left: 12px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: ${settings.accentColor};
            cursor: grab;
        }
        .title {
            font-size: 1.4rem;
            font-weight: 600;
            background: linear-gradient(135deg, rgb(7, 223, 194), rgb(6,213,250));
            -webkit-background-clip: text;
            margin-bottom: 12px;
        }
        .quote-text {
            font-size: ${settings.fontSize};
            font-weight: 400;
            color: ${settings.accentColor};
            line-height: 1.5;
            letter-spacing: 0.3px;
            min-height: 60px;
            position: relative;
            opacity: 0;
            animation: fadeQuote 0.8s ease forwards;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 255, 204, 0.2);
            pointer-events: none;
            transform: scale(0);
            animation: rippleEffect 0.8s ease-out forwards;
        }
        @keyframes rippleEffect {
            0% { transform: scale(0); opacity: 0.6; }
            100% { transform: scale(4); opacity: 0; }
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
            <div class="drag-handle" title="Drag me"></div>
            <button class="close-btn" title="Close">&times;</button>
            <h2 class="title">Quote of the Day</h2>
            <p class="quote-text" id="quote">${settings.initialQuote}</p>
            <button class="new-quote-btn" id="new-quote-btn">New Quote</button>
        </div>
    `;

    const quotes = [
        "Believe you can and you're halfway there.",
        "Every moment is a fresh beginning.",
        "Dream it. Wish it. Do it.",
        "It always seems impossible until it’s done.",
        "Start where you are. Use what you have. Do what you can.",
        "Positive thoughts create positive results.",
        "Your only limit is your mind.",
        "Small steps every day lead to big results.",
        "Act as if what you do makes a difference. It does.",
        "Keep your face always toward the sunshine—and shadows will fall behind you.",
        "The only way to do great work is to love what you do.",
        "Do something today that your future self will thank you for.",
        "Push yourself, because no one else is going to do it for you.",
        "Great things never come from comfort zones.",
        "Success doesn’t just find you. You have to go out and get it.",
        "The harder you work for something, the greater you’ll feel when you achieve it.",
        "Dream bigger. Do bigger.",
        "Don’t wait for opportunity. Create it.",
        "Sometimes later becomes never. Do it now.",
        "Little things make big days.",
        "It’s going to be hard, but hard does not mean impossible.",
        "Don’t stop when you’re tired. Stop when you’re done.",
        "Wake up with determination. Go to bed with satisfaction.",
        "Do something today that your future self will thank you for.",
        "If you can dream it, you can do it.",
        "Motivation is what gets you started. Habit is what keeps you going.",
        "Don’t watch the clock; do what it does. Keep going.",
        "Success is not for the lazy.",
        "Your limitation—it’s only your imagination.",
        "Push yourself, because no one else is going to do it for you.",
        "Great things never come from comfort zones.",
        "Dream it. Wish it. Do it.",
        "Work hard in silence. Let success make the noise.",
        "Little by little, a little becomes a lot.",
        "Stay positive, work hard, make it happen."
    ];

    const quoteText = container.querySelector("#quote");
    const newQuoteBtn = container.querySelector("#new-quote-btn");
    const closeBtn = container.querySelector('.close-btn');
    const dragHandle = container.querySelector('.drag-handle');

    // Fade-in after 3s
    setTimeout(() => {
        container.style.transition = 'opacity 3s ease';
        container.style.opacity = '1';
    }, 3000);

    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
    function displayQuote() {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        quoteText.appendChild(ripple);
        const rect = quoteText.getBoundingClientRect();
        ripple.style.left = (rect.width / 2 - 10) + 'px';
        ripple.style.top = (rect.height / 2 - 10) + 'px';
        setTimeout(() => ripple.remove(), 800);

        quoteText.style.opacity = 0;
        setTimeout(() => {
            quoteText.textContent = getRandomQuote();
            quoteText.style.animation = "none";
            void quoteText.offsetWidth;
            quoteText.style.animation = "fadeQuote 0.8s ease forwards";
        }, 200);
    }

    newQuoteBtn.addEventListener('click', displayQuote);
    closeBtn.addEventListener('click', () => container.remove());

    // Drag logic inside parent container
    let isDragging = false, startX, startY, origX, origY;
    const startDrag = (clientX, clientY) => {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        startX = clientX;
        startY = clientY;
        origX = rect.left - parentRect.left;
        origY = rect.top - parentRect.top;
        container.style.cursor = 'grabbing';
    };
    const drag = (clientX, clientY) => {
        if (!isDragging) return;
        const parentRect = parent.getBoundingClientRect();
        let dx = clientX - startX;
        let dy = clientY - startY;
        let newX = origX + dx;
        let newY = origY + dy;
        newX = Math.max(0, Math.min(newX, parentRect.width - container.offsetWidth));
        newY = Math.max(0, Math.min(newY, parentRect.height - container.offsetHeight));
        container.style.left = newX + 'px';
        container.style.top = newY + 'px';
    };
    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = 'grab';
    };
    dragHandle.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
    document.addEventListener('mousemove', e => drag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);
    dragHandle.addEventListener('touchstart', e => { const t=e.touches[0]; startDrag(t.clientX,t.clientY); });
    document.addEventListener('touchmove', e => { const t=e.touches[0]; drag(t.clientX,t.clientY); });
    document.addEventListener('touchend', endDrag);

    // Smooth bouncing animation constrained inside parent
    let bounceAngle = 0;
    function bounce() {
        if(!isDragging){
            const parentRect = parent.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            let offsetX = Math.cos(bounceAngle/2)*2;
            let offsetY = Math.sin(bounceAngle)*4;

            // Get current left/top relative to parent
            const left = parseFloat(container.style.left) || 0;
            const top = parseFloat(container.style.top) || 0;

            // Constrain within parent
            const maxX = parentRect.width - container.offsetWidth;
            const maxY = parentRect.height - container.offsetHeight;

            const boundedX = Math.max(0, Math.min(left + offsetX, maxX));
            const boundedY = Math.max(0, Math.min(top + offsetY, maxY));

            container.style.transform = `translate(0px, 0px)`; // reset transform for calculation
            container.style.left = boundedX + 'px';
            container.style.top = boundedY + 'px';

            bounceAngle += 0.04;
        }
        requestAnimationFrame(bounce);
    }
    bounce();

})();
