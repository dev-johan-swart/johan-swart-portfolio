(function() {
    function mount(selector) {
      const host = document.querySelector(selector);
      if (!host) return console.error("Mount point not found");
  
      const iframe = document.createElement("iframe");
      iframe.style.width = "550px";
      iframe.style.height = "650px";
      iframe.style.border = "0";
      iframe.style.borderRadius = "14px";
      iframe.style.overflow = "hidden";
      host.appendChild(iframe);
  
      iframe.srcdoc = `
        <html>
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="widget.css"/>
        </head>
        <body>
          <div class="widget-container">
            <h2>Fantasy Tic Tac Toe</h2>
            <div id="widget-theme"></div>
            <div class="widget-board-container" id="widget-board-container">
              <div class="widget-board" id="widget-board"></div>
            </div>
            <button id="widget-reset">Reset</button>
          </div>
  
          <div id="widget-popup" class="widget-popup hidden">
            <div>
              <span id="widget-winner"></span>
              <button id="widget-close">Close</button>
            </div>
          </div>
  
          <script src="widget.js"></script>
          <script>
            // Simple widget init logic
            const boardEl = document.getElementById("widget-board");
            const boardContainer = document.getElementById("widget-board-container");
            const themeLabel = document.getElementById("widget-theme");
            const resetBtn = document.getElementById("widget-reset");
            const popup = document.getElementById("widget-popup");
            const winnerText = document.getElementById("widget-winner");
            const closePopup = document.getElementById("widget-close");
  
            const themes = ["assets/fantasy1.jpg","assets/fantasy2.jpg","assets/fantasy3.jpg","assets/fantasy4.jpg","assets/fantasy5.jpg"];
            let themeIndex=0, board=Array(9).fill(""), turn="X", playing=true;
  
            function drawBoard(){
              boardEl.innerHTML="";
              board.forEach((val,i)=>{
                const c=document.createElement("div");
                c.className="widget-cell";
                if(val==="X")c.classList.add("widget-x");
                if(val==="O")c.classList.add("widget-o");
                c.textContent=val;
                c.onclick=()=>play(i);
                boardEl.appendChild(c);
              });
            }
  
            function updateTheme(){
              boardContainer.style.backgroundImage=\`url(\${themes[themeIndex]})\`;
              themeLabel.textContent=\`Theme \${themeIndex+1}\`;
            }
  
            function play(i){
              if(!playing||board[i]!=="") return;
              board[i]=turn;
              turn=turn==="X"?"O":"X";
              drawBoard();
              const w=checkWin();
              if(w) endGame(w);
              else if(board.every(v=>v!=="")) endGame("Draw");
            }
  
            function checkWin(){
              const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
              for(let c of wins){
                const [a,b,c2]=c;
                if(board[a] && board[a]===board[b] && board[b]===board[c2]) return board[a];
              }
              return null;
            }
  
            function endGame(result){
              playing=false;
              winnerText.textContent=result==="Draw"?"Draw":\`\${result} Wins!\`;
              popup.classList.remove("hidden");
              popup.classList.add("show");
            }
  
            closePopup.onclick=()=>{popup.classList.remove("show");popup.classList.add("hidden");nextTheme();};
            resetBtn.onclick=()=>{resetGame();};
  
            function nextTheme(){themeIndex=(themeIndex+1)%themes.length;updateTheme();resetGame();}
            function resetGame(){board=Array(9).fill("");turn="X";playing=true;drawBoard();}
  
            // Initialize
            updateTheme();
            drawBoard();
          </script>
        </body>
        </html>
      `;
    }
  
    window.FantasyTicTacToeWidget={mount};
  })();
  