// === SMALLER, RELATIVE, ANIMATED TIC TAC TOE WIDGET WITH RESPONSIVE POPUP ===
(function () {

    // -------------------------------------------------
    // CONFIGURATION
    // -------------------------------------------------
    const defaultConfig = {
      position: 'bottom-right', 
      accentColor: '#00ffcc',
      fontSize: '1.1rem',
    };
    let widgetConfig = window.widgetConfig || defaultConfig;
  
    // -------------------------------------------------
    // ADD CSS STYLES
    // -------------------------------------------------
    const style = document.createElement('style');
    style.textContent = `
      #tic-widget-wrapper * { box-sizing: border-box; }
  
      #game-container {
        width: 280px;
        padding: 16px;
        background: rgba(65, 50, 50, 0.62);
        backdrop-filter: blur(4px) saturate(170%);
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 14px;
        color: #f7f3f3;
        box-shadow: 0 0 15px rgba(0,0,0,0.4);
        text-align: center;
        font-family: "Segoe UI", Arial, sans-serif;
        position: relative;
        transition: transform 0.25s ease, opacity 0.25s ease;
      }
  
      .title { font-size: 22px; margin-bottom:4px; color: rgba(211, 221, 119, 0.8); }
      #theme-indicator { font-size:14px; margin-bottom:10px; }
  
      .board { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; justify-items:center; }
      .cell { width:70px; height:70px; display:flex; justify-content:center; align-items:center; background:rgba(255,255,255,0.18); border-radius:12px; cursor:pointer; transition: background 0.2s, transform 0.2s; overflow:hidden; }
      .cell:hover { transform:scale(1.05); background: rgba(235, 220, 220, 0.25); }
      .piece-img { width:70%; height:70%; object-fit:contain; pointer-events:none; }
  
      #reset-btn { margin-top:12px; color: #000; padding:8px 16px; font-size:13px; border:none; border-radius:8px; cursor:pointer; background:rgb(253,253,253); font-weight:bold; }
  
      /* Popup responsive relative to widget */
      .popup {
        position:absolute; 
        left:50%; top:50%;
        transform:translate(-50%,-50%) scale(0.9);
        width:90%;          /* relative to container */
        max-width:100%;
        max-height:90%;     /* relative to container */
        padding:12px;
        background:linear-gradient(180deg,rgba(6,6,10,0.92),rgba(14,8,20,0.85));
        border-radius:12px;
        box-shadow:0 10px 40px rgba(0,0,0,0.5);
        color:#fff;
        opacity:0;
        pointer-events:none;
        transition: transform 0.25s ease, opacity 0.25s ease;
        z-index:2000;
        overflow:auto;
      }
  
      .popup.show { transform:translate(-50%,-50%) scale(1); opacity:1; pointer-events:auto; }
      .popup.hidden { transform:translate(-50%,-50%) scale(0.9); opacity:0; pointer-events:none; }
  
      #winner-text { font-weight:700; margin-top:6px; font-size:16px; text-shadow:0 1px 6px rgba(0,0,0,0.5); }
      #winner-piece-img { width:40%; max-width:96px; height:auto; object-fit:contain; border:1px solid rgba(255,255,255,0.06); box-shadow:0 4px 12px rgba(0,0,0,0.3); display:block; margin:0 auto 6px; }
  
      .tablet-close { position:absolute; top:8px; right:8px; width:32px; height:32px; border-radius:6px; border:none; background:rgba(10,101,238,0.06); color:#4759ff; cursor:pointer; box-shadow:0 4px 16px rgba(0,0,0,0.35); z-index:100; font-size:18px; }
  
      .minimize-circle { position:fixed; bottom:20px; right:20px; width:48px; height:48px; border-radius:50%; background:#4fe4f8; display:flex; justify-content:center; align-items:center; color:#fff; font-size:20px; cursor:grab; z-index:3000; box-shadow:0 10px 30px rgba(0,0,0,0.35); transition: transform 0.2s ease; }
      .minimize-circle:hover { transform:scale(1.1); }
  
      #tic-widget-wrapper { transform:translateY(120%); opacity:0; transition: transform 0.6s ease, opacity 0.6s ease; }
      #tic-widget-wrapper.show { transform:translateY(0); opacity:1; }
  
      .hidden{display:none!important;}
  
      @media(max-width:420px){
        #game-container{width:94%; padding:12px;} 
        .cell{width:min(15vw,60px); height:min(15vw,60px);} 
        .piece-img{width:65%;height:65%;} 
        #winner-piece-img{width:35%;height:auto;}
      }
    `;
    document.head.appendChild(style);
  
    // -------------------------------------------------
    // CREATE WIDGET CONTAINER
    // -------------------------------------------------
    const mount = (selector) => {
      const container = document.querySelector(selector);
      if(!container) return;
  
      const floatWrapper = document.createElement('div');
      floatWrapper.id = 'tic-widget-wrapper';
      floatWrapper.style.position = 'fixed';
      floatWrapper.style.zIndex = 2000;
      floatWrapper.style.pointerEvents = 'auto';
      floatWrapper.style.bottom = widgetConfig.position.includes('bottom') ? '18px' : 'auto';
      floatWrapper.style.top = widgetConfig.position.includes('top') ? '18px' : 'auto';
      floatWrapper.style.right = widgetConfig.position.includes('right') ? '18px' : 'auto';
      floatWrapper.style.left = widgetConfig.position.includes('left') ? '18px' : 'auto';
  
      floatWrapper.innerHTML = `
        <div id="game-container">
          <button class="tablet-close">✕</button>
          <h1 class="title">Fantasy Tic Tac Toe</h1>
          <div id="theme-indicator"></div>
          <div id="board-container"><div id="board" class="board"></div></div>
          <button id="reset-btn">Reset</button>
          <div class="popup hidden">
            <div class="popup-content">
              <img id="winner-piece-img">
              <div id="winner-text"></div>
            </div>
          </div>
        </div>
      `;
  
      container.appendChild(floatWrapper);
  
      // Trigger slide-in animation after DOM insertion
      requestAnimationFrame(() => {
        floatWrapper.classList.add('show');
      });
  
      initializeGame(floatWrapper);
    };
  
    // -------------------------------------------------
    // GAME LOGIC (same as previous)
    // -------------------------------------------------
    const initializeGame = (floatWrapper) => {
      const xImageSrc = "assets/dragon.png";
      const oImageSrc = "assets/knight.png";
      const themes = [
        { file: "assets/theme1.jpg", name: "Ice" },
        { file: "assets/theme2.jpg", name: "Gold" },
        { file: "assets/theme3.jpg", name: "Dark" },
        { file: "assets/theme4.jpg", name: "Legendary" },
        { file: "assets/theme5.jpg", name: "Green" }
      ];
  
      let board = Array(9).fill("");
      let turn = "X";
      let themeIndex = 0;
      let playing = true;
      let autoNextTimer = null;
      let launcher = null;
  
      const gameContainer = floatWrapper.querySelector("#game-container");
      const boardEl = floatWrapper.querySelector("#board");
      const boardContainer = floatWrapper.querySelector("#board-container");
      const themeLabel = floatWrapper.querySelector("#theme-indicator");
      const resetBtn = floatWrapper.querySelector("#reset-btn");
      const winnerPopup = floatWrapper.querySelector(".popup");
      const winnerText = floatWrapper.querySelector("#winner-text");
      const closePopupBtn = floatWrapper.querySelector(".tablet-close");
      const winnerImg = winnerPopup.querySelector("#winner-piece-img");
  
      const preload = src => new Promise(res => { if(!src) return res(null); const img=new Image(); img.onload=()=>res(img); img.onerror=()=>res(null); img.src=src; });
      Promise.all([preload(xImageSrc), preload(oImageSrc), ...themes.map(t=>preload(t.file))]).then(()=>{ drawBoard(); updateTheme(); });
  
      function drawBoard(){ boardEl.innerHTML=''; board.forEach((v,i)=>{ const cell=document.createElement('div'); cell.className='cell'; if(v){ const img=document.createElement('img'); img.src=v==='X'?xImageSrc:oImageSrc; img.className='piece-img'; cell.appendChild(img);} cell.addEventListener('click',()=>onCellClick(i)); boardEl.appendChild(cell);}); }
  
      function onCellClick(i){ if(!playing||board[i]) return; board[i]=turn; turn=turn==='X'?'O':'X'; drawBoard(); const winner=checkWin(); if(winner) return endGame(winner); if(board.every(Boolean)) return endGame('Draw'); }
  
      function checkWin(){ const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for(const [a,b,c] of wins) if(board[a]&&board[a]===board[b]&&board[b]===board[c]) return board[a]; return null; }
  
      function endGame(result){ 
        playing=false; 
        winnerImg.src = result==='Draw'?themes[themeIndex].file:(result==='X'?xImageSrc:oImageSrc); 
        winnerText.textContent = result==='Draw'?"It's a Draw!":`${result} Wins!`; 
        winnerPopup.classList.add('show'); winnerPopup.classList.remove('hidden'); 
        if(autoNextTimer) clearTimeout(autoNextTimer); 
        autoNextTimer=setTimeout(()=>{ winnerPopup.classList.remove('show'); winnerPopup.classList.add('hidden'); nextTheme(); },1600);
      }
  
      function updateTheme(){ const theme=themes[themeIndex]; boardContainer.style.backgroundImage=`url(${theme.file})`; boardContainer.style.backgroundSize='contain'; boardContainer.style.backgroundRepeat='no-repeat'; boardContainer.style.backgroundPosition='center'; themeLabel.textContent=`Theme: ${theme.name}`; }
  
      function nextTheme(){ themeIndex=(themeIndex+1)%themes.length; board=Array(9).fill(''); turn='X'; playing=true; updateTheme(); drawBoard(); }
  
      if(resetBtn) resetBtn.addEventListener('click',()=>{board=Array(9).fill(''); turn='X'; playing=true; drawBoard();});
      if(closePopupBtn) closePopupBtn.addEventListener('click',closeApp);
  
      function closeApp(){ gameContainer.style.opacity='0'; gameContainer.style.transform='scale(0.8)'; setTimeout(()=>{ gameContainer.style.display='none'; showLauncher(); },250); }
  
      function showLauncher(){ 
        if(launcher) return; 
        launcher=document.createElement('div'); 
        launcher.className='minimize-circle'; 
        launcher.style.backgroundImage=`url('assets/theme1.jpg')`;
        launcher.style.backgroundSize='cover'; 
        document.body.appendChild(launcher); 
        makeDraggable(launcher); 
        launcher.addEventListener('click',()=>{ gameContainer.style.display='block'; setTimeout(()=>{ gameContainer.style.opacity='1'; gameContainer.style.transform='scale(1)'; },20); launcher.remove(); launcher=null; });
      }
  
      function makeDraggable(el){ 
        let drag=false,sx=0,sy=0,sl=0,st=0; 
        function down(e){drag=true;const ev=e.touches?e.touches[0]:e; sx=ev.clientX; sy=ev.clientY; const rect=el.getBoundingClientRect(); sl=rect.left; st=rect.top; el.style.position='fixed'; el.style.left=sl+'px'; el.style.top=st+'px'; el.style.cursor='grabbing'; e.preventDefault();}
        function move(e){if(!drag) return; const ev=e.touches?e.touches[0]:e; el.style.left=sl+(ev.clientX-sx)+'px'; el.style.top=st+(ev.clientY-sy)+'px';} 
        function up(){ drag=false; el.style.cursor='grab'; } 
        el.addEventListener('mousedown',down); document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); 
        el.addEventListener('touchstart',down,{passive:false}); document.addEventListener('touchmove',move,{passive:false}); document.addEventListener('touchend',up);
      }
    };
  
    // -------------------------------------------------
    // EXPORT
    // -------------------------------------------------
    window.FantasyTicTacToeWidget={mount};
  
  })();

  