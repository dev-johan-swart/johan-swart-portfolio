(function () {
    // -------------------------
    //  Inject CSS
    // -------------------------
    const style = document.createElement("style");
    style.textContent = `
      .neon-radio {
        width: 220px;
        height: 300px;
        padding: 16px;
        border-radius: 14px;
        background: rgba(15, 49, 77, 0.7);
        border: 1px solid #0ffcf0;
        box-shadow: 0 0 12px #0ffcf0;
        font-family: Poppins, sans-serif;
        color: #e9e1f1;
        display: flex;
        flex-direction: column;
        gap: 15px;
        backdrop-filter: blur(6px);
        transition: transform 0.25s ease;
      }
        
      .neon-radio:hover {
        transform: scale(1.02);
        box-shadow: 0 0 18px #07d0f3ee;
      }
  
      .radio-title {
        font-size: 1.2rem;
        background: linear-gradient(90deg, #0ffcf0, #25acc4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        margin: 0;
      }
  
      .eq-bars {
        display: flex;
        gap: 4px;
        justify-content: center;
        height: 20px;
        padding: 2px;
      }
  
      .eq-bars span {
        width: 4px;
        background: #0ffcf0;
        animation: pulse 1s infinite ease-in-out;
        border-radius: 2px;
        opacity: 0.8;
      }
      .eq-bars span:nth-child(2) { animation-delay: .2s; }
      .eq-bars span:nth-child(3) { animation-delay: .4s; }
      .eq-bars span:nth-child(4) { animation-delay: .6s; }
      .eq-bars span:nth-child(5) { animation-delay: .8s; }
  
      @keyframes pulse {
        0% { height: 4px; }
        50% { height: 18px; }
        100% { height: 4px; }
      }
  
      .radio-btn {
        background: #0ffcf0;
        color: #0a1a28;
        border: none;
        padding: 10px;
        font-size: 1.1rem;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        margin: 0 auto;
        cursor: pointer;
        box-shadow: 0 0 12px #0ffcf0;
        transition: transform 0.2s;
      }
  
      .radio-btn:hover {
        transform: scale(1.1);
      }
  
      .radio-select {
        width: 100%;
        padding: 8px;
        border-radius: 8px;
        background: #132b46;
        color: #0ffcf0;
        border: 1px solid #0ffcf0;
        cursor: pointer;
      }
  
      .radio-volume {
        width: 100%;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  
    // -------------------------
    //  Create HTML structure
    // -------------------------
    
    const container = document.getElementById("neon-radio-widget");
    container.innerHTML = `
      <div class="neon-radio">
        <h3 class="radio-title">Neon Radio</h3>
  
        <select id="radio-channel" class="radio-select">
        <option value="https://stream.radioparadise.com/rock-192">Radio Paradise – Rock</option>
        <option value="https://ice1.somafm.com/dronezone-128-mp3">SomaFM – Groove Salad</option>
        <option value="https://stream.radioparadise.com/mp3-192">Radio Paradise</option>
          <option value="https://icecast.dancewave.online/dance.mp3">Dance Wave</option>
          <option value="https://us2internetrelay.dhserver.net:8443/live">Deep House Lounge</option>
        </select>
  
        <div class="eq-bars">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
  
        <button id="radio-toggle" class="radio-btn">▶</button>
  
        <input type="range" id="radio-volume" class="radio-volume"
        min="0" max="1" step="0.01" value="0.7">
        <p>Volume</p>
  
        <audio id="radio-audio"></audio>
      </div>
    `;
  
    // -------------------------
    //  Logic
    // -------------------------
    const audio = document.getElementById("radio-audio");
    const toggleBtn = document.getElementById("radio-toggle");
    const volume = document.getElementById("radio-volume");
    const channel = document.getElementById("radio-channel");
  
    audio.src = channel.value;
  
    toggleBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        toggleBtn.textContent = "⏸";
      } else {
        audio.pause();
        toggleBtn.textContent = "▶";
      }
    });
  
    channel.addEventListener("change", () => {
      audio.src = channel.value;
      audio.play();
      toggleBtn.textContent = "⏸";
    });
  
    volume.addEventListener("input", () => {
      audio.volume = volume.value;
    });
  })();
  