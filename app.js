const games = [
  ["tic", "❌", "Tic-Tac-Toe", "Classic 3x3 strategy"],
  ["connect", "🔴", "Connect Four", "Get four in a row"],
  ["rps", "✊", "Rock Paper Scissors", "Beat your opponent"],
  ["guess", "🔢", "Number Guess", "Find the secret number"],
  ["reaction", "⚡", "Reaction Test", "React as quickly as possible"],
  ["click", "🖱️", "Click Race", "Click faster than your opponent"],
  ["math", "🧮", "Math Battle", "Solve problems quickly"],
  ["dice", "🎲", "Dice Duel", "Highest roll wins"],
  ["coin", "🪙", "Coin Flip", "Guess heads or tails"],
  ["color", "🎨", "Color Match", "Match the target color"],
  ["memory", "🧠", "Memory Match", "Find matching cards"],
  ["scramble", "🔤", "Word Scramble", "Unscramble the word"],
  ["simon", "🔵", "Simon", "Remember the sequence"],
  ["snake", "🐍", "Snake", "Eat and grow"],
  ["pong", "🏓", "Pong", "Classic arcade tennis"],
  ["dodge", "💥", "Dodge", "Avoid falling objects"],
  ["whack", "🔨", "Whack", "Hit the target"],
  ["maze", "🗺️", "Maze", "Find the exit"],
  ["aim", "🎯", "Aim Trainer", "Hit targets"],
  ["higher", "📈", "Higher or Lower", "Predict the next number"]
];

let mode = "bot";
let currentGame = null;

const gameList = document.getElementById("games");

games.forEach(g => {
  const card = document.createElement("div");

  card.className = "game-card";

  card.innerHTML = `
    <div class="emoji">${g[1]}</div>
    <h3>${g[2]}</h3>
    <p>${g[3]}</p>
  `;

  card.onclick = () => startGame(g[0]);

  gameList.appendChild(card);
});

function setMode(newMode) {
  mode = newMode;

  const names = {
    bot: "🤖 Play vs Bot",
    local: "👥 2 Players",
    single: "🧑 Single Player",
    online: "🌐 Online"
  };

  document.getElementById("modeText").textContent =
    "Mode: " + names[newMode];
}

function startGame(id) {
  currentGame = id;

  document.getElementById("home").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  const gameData = games.find(g => g[0] === id);

  document.getElementById("gameTitle").textContent =
    gameData[1] + " " + gameData[2];

  document.getElementById("gameInfo").textContent =
    "Mode: " + mode;

  const game = document.getElementById("game");
  game.innerHTML = "";

  const functions = {
    tic: ticTacToe,
    connect: connectFour,
    rps: rockPaperScissors,
    guess: numberGuess,
    reaction: reactionTest,
    click: clickRace,
    math: mathBattle,
    dice: diceDuel,
    coin: coinFlip,
    color: colorMatch,
    memory: memoryGame,
    scramble: wordScramble,
    simon: simonGame,
    snake: snakeGame,
    pong: pongGame,
    dodge: dodgeGame,
    whack: whackGame,
    maze: mazeGame,
    aim: aimGame,
    higher: higherLower
  };

  functions[id]();
}

function goHome() {
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}

/* ---------------- TIC TAC TOE ---------------- */

function ticTacToe() {
  let board = Array(9).fill("");
  let turn = "X";

  const game = document.getElementById("game");

  game.innerHTML = `
    <div class="board" id="ticBoard"
         style="grid-template-columns:repeat(3,80px)">
    </div>

    <div class="result" id="ticResult">
      Player X's turn
    </div>

    <button onclick="startGame('tic')">Restart</button>
  `;

  const boardElement = document.getElementById("ticBoard");

  board.forEach((_, i) => {
    const cell = document.createElement("div");

    cell.className = "cell";

    cell.onclick = () => playTic(i);

    boardElement.appendChild(cell);
  });

  function playTic(index) {
    if (board[index]) return;

    board[index] = turn;
    render();

    if (winner(board)) {
      document.getElementById("ticResult").textContent =
        `Player ${turn} wins!`;
      return;
    }

    if (board.every(Boolean)) {
      document.getElementById("ticResult").textContent = "Draw!";
      return;
    }

    turn = turn === "X" ? "O" : "X";

    document.getElementById("ticResult").textContent =
      `Player ${turn}'s turn`;

    if (mode === "bot" && turn === "O") {
      setTimeout(botMove, 400);
    }
  }

  function botMove() {
    const empty = board
      .map((v, i) => v ? null : i)
      .filter(v => v !== null);

    if (!empty.length) return;

    const index =
      empty[Math.floor(Math.random() * empty.length)];

    playTic(index);
  }

  function render() {
    [...boardElement.children].forEach((cell, i) => {
      cell.textContent = board[i];
    });
  }
}

/* ---------------- CONNECT FOUR ---------------- */

function connectFour() {
  let board = Array.from({length:6}, () => Array(7).fill(""));
  let player = "🔴";

  const game = document.getElementById("game");

  game.innerHTML = `
    <div id="connectBoard"
      class="board"
      style="grid-template-columns:repeat(7,55px)">
    </div>

    <div class="result" id="connectResult">
      Red's turn
    </div>
  `;

  const boardElement =
    document.getElementById("connectBoard");

  function render() {
    boardElement.innerHTML = "";

    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        const cell = document.createElement("div");

        cell.className = "cell";
        cell.style.width = "55px";
        cell.style.height = "55px";
        cell.style.fontSize = "25px";

        cell.textContent = board[r][c];

        cell.onclick = () => drop(c);

        boardElement.appendChild(cell);
      }
    }
  }

  function drop(column) {
    for (let r = 5; r >= 0; r--) {
      if (!board[r][column]) {
        board[r][column] = player;

        if (checkFour()) {
          document.getElementById("connectResult")
            .textContent = `${player} wins!`;
          render();
          return;
        }

        player = player === "🔴" ? "🟡" : "🔴";

        document.getElementById("connectResult")
          .textContent =
          player === "🔴" ? "Red's turn" : "Yellow's turn";

        render();

        if (mode === "bot" && player === "🟡") {
          setTimeout(() => {
            const choices = [];

            for (let c = 0; c < 7; c++) {
              if (!board[0][c]) choices.push(c);
            }

            if (choices.length) {
              drop(choices[Math.floor(Math.random()*choices.length)]);
            }
          }, 400);
        }

        return;
      }
    }
  }

  function checkFour() {
    const directions = [
      [0,1],
      [1,0],
      [1,1],
      [1,-1]
    ];

    for (let r=0;r<6;r++) {
      for (let c=0;c<7;c++) {
        if (!board[r][c]) continue;

        for (const [dr,dc] of directions) {
          let count = 1;

          for (let k=1;k<4;k++) {
            const nr=r+dr*k;
            const nc=c+dc*k;

            if (
              nr>=0 &&
              nr<6 &&
              nc>=0 &&
              nc<7 &&
              board[nr][nc] === board[r][c]
            ) count++;
          }

          if (count >= 4) return true;
        }
      }
    }

    return false;
  }

  render();
}

/* ---------------- ROCK PAPER SCISSORS ---------------- */

function rockPaperScissors() {
  const choices = ["✊", "✋", "✌️"];

  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>Choose</h2>

      ${choices.map(c =>
        `<button onclick="rpsPlay('${c}')">${c}</button>`
      ).join("")}

      <div class="result" id="rpsResult"></div>
    </div>
  `;
}

function rpsPlay(player) {
  const choices = ["✊", "✋", "✌️"];

  const bot =
    choices[Math.floor(Math.random()*3)];

  let result;

  if (player === bot) {
    result = "Draw!";
  } else if (
    (player==="✊" && bot==="✌️") ||
    (player==="✋" && bot==="✊") ||
    (player==="✌️" && bot==="✋")
  ) {
    result = "You win!";
  } else {
    result = "Bot wins!";
  }

  document.getElementById("rpsResult").textContent =
    `You ${player} — Bot ${bot} → ${result}`;
}

/* ---------------- NUMBER GUESS ---------------- */

function numberGuess() {
  const secret = Math.floor(Math.random()*100)+1;

  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>Guess 1–100</h2>

      <input id="guessInput"
             type="number"
             min="1"
             max="100">

      <button onclick="checkGuess()">Guess</button>

      <div id="guessResult" class="result"></div>
    </div>
  `;

  window.checkGuess = () => {
    const value =
      Number(document.getElementById("guessInput").value);

    const output =
      document.getElementById("guessResult");

    if (value === secret) {
      output.textContent = "🎉 Correct!";
    } else if (value < secret) {
      output.textContent = "⬆️ Higher";
    } else {
      output.textContent = "⬇️ Lower";
    }
  };
}

/* ---------------- REACTION ---------------- */

function reactionTest() {
  const game = document.getElementById("game");

  game.innerHTML = `
    <div class="card">
      <h2>Wait for GREEN</h2>
      <button id="reactionButton"
              class="big-button">
        WAIT
      </button>
      <div id="reactionResult" class="result"></div>
    </div>
  `;

  const button =
    document.getElementById("reactionButton");

  let start;
  let ready = false;

  button.onclick = () => {
    if (!ready) return;

    const time = Date.now() - start;

    document.getElementById("reactionResult")
      .textContent = `${time} ms`;

    button.style.background = "#5865f2";

    ready = false;

    setTimeout(wait, 1000);
  };

  function wait() {
    button.textContent = "WAIT";
    button.style.background = "#d33";

    setTimeout(() => {
      button.textContent = "CLICK!";
      button.style.background = "#21c55d";
      start = Date.now();
      ready = true;
    }, 1000 + Math.random()*3000);
  }

  wait();
}

/* ---------------- CLICK RACE ---------------- */

function clickRace() {
  let p1 = 0;
  let p2 = 0;

  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>Click Race</h2>
      <p>First player to 30 clicks wins.</p>

      <button onclick="clickPlayer(1)">
        Player 1
      </button>

      <button onclick="clickPlayer(2)">
        Player 2
      </button>

      <div class="result" id="clickResult">
        P1: 0 | P2: 0
      </div>
    </div>
  `;

  window.clickPlayer = player => {
    if (player === 1) p1++;
    else p2++;

    document.getElementById("clickResult").textContent =
      `P1: ${p1} | P2: ${p2}`;

    if (p1 >= 30 || p2 >= 30) {
      document.getElementById("clickResult")
        .textContent =
        `${p1 >= 30 ? "Player 1" : "Player 2"} wins!`;
    }
  };
}

/* ---------------- MATH BATTLE ---------------- */

function mathBattle() {
  const a = Math.floor(Math.random()*20)+1;
  const b = Math.floor(Math.random()*20)+1;

  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>${a} + ${b} = ?</h2>

      <input id="mathInput" type="number">

      <button onclick="answerMath(${a+b})">
        Answer
      </button>

      <div id="mathResult" class="result"></div>
    </div>
  `;

  window.answerMath = answer => {
    const value =
      Number(document.getElementById("mathInput").value);

    document.getElementById("mathResult")
      .textContent =
      value === answer ? "🎉 Correct!" : "❌ Wrong!";
  };
}

/* ---------------- DICE DUEL ---------------- */

function diceDuel() {
  const player =
    Math.floor(Math.random()*6)+1;

  const bot =
    Math.floor(Math.random()*6)+1;

  let result = "Draw!";

  if (player > bot) result = "You win!";
  if (bot > player) result = "Bot wins!";

  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>🎲 Dice Duel</h2>
      <p>You: ${player}</p>
      <p>Bot: ${bot}</p>
      <div class="result">${result}</div>

      <button onclick="startGame('dice')">
        Roll Again
      </button>
    </div>
  `;
}

/* ---------------- COIN FLIP ---------------- */

function coinFlip() {
  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>🪙 Guess the coin</h2>

      <button onclick="flipCoin('Heads')">Heads</button>
      <button onclick="flipCoin('Tails')">Tails</button>

      <div class="result" id="coinResult"></div>
    </div>
  `;

  window.flipCoin = guess => {
    const result =
      Math.random() < .5 ? "Heads" : "Tails";

    document.getElementById("coinResult")
      .textContent =
      `It was ${result}! ${
        guess === result ? "You win!" : "You lose!"
      }`;
  };
}

/* ---------------- COLOR MATCH ---------------- */

function colorMatch() {
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange"
  ];

  const target =
    colors[Math.floor(Math.random()*colors.length)];

  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>Match: ${target}</h2>

      ${colors.map(c =>
        `<button
          style="background:${c}"
          onclick="chooseColor('${c}')">
          ${c}
        </button>`
      ).join("")}

      <div id="colorResult" class="result"></div>
    </div>
  `;

  window.chooseColor = color => {
    document.getElementById("colorResult")
      .textContent =
      color === target
        ? "🎉 Correct!"
        : "❌ Try again!";
  };
}

/* ---------------- MEMORY ---------------- */

function memoryGame() {
  const symbols =
    ["🍎","🍎","🍌","🍌","🍇","🍇","🍒","🍒"]
    .sort(() => Math.random()-.5);

  let first = null;
  let locked = false;
  let matched = 0;

  const game = document.getElementById("game");

  game.innerHTML =
    `<div class="memory-grid" id="memoryGrid"></div>`;

  const grid =
    document.getElementById("memoryGrid");

  symbols.forEach((symbol,index) => {
    const card =
      document.createElement("div");

    card.className = "memory-card";
    card.textContent = "?";

    card.onclick = () => {
      if (locked || card.textContent !== "?") return;

      card.textContent = symbol;

      if (first === null) {
        first = {card,symbol};
      } else {
        if (first.symbol === symbol) {
          matched += 2;
          first = null;

          if (matched === symbols.length) {
            setTimeout(() => {
              game.innerHTML +=
                `<div class="result">🎉 You won!</div>`;
            },200);
          }
        } else {
          locked = true;

          setTimeout(() => {
            card.textContent = "?";
            first.card.textContent = "?";
            first = null;
            locked = false;
          },700);
        }
      }
    };

    grid.appendChild(card);
  });
}

/* ---------------- WORD SCRAMBLE ---------------- */

function wordScramble() {
  const words = [
    "computer",
    "javascript",
    "github",
    "multiplayer",
    "gaming"
  ];

  const word =
    words[Math.floor(Math.random()*words.length)];

  const scrambled =
    word.split("").sort(() => Math.random()-.5).join("");

  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>Unscramble</h2>

      <h1>${scrambled}</h1>

      <input id="wordInput">

      <button onclick="checkWord('${word}')">
        Check
      </button>

      <div id="wordResult" class="result"></div>
    </div>
  `;

  window.checkWord = answer => {
    const value =
      document.getElementById("wordInput").value
      .toLowerCase();

    document.getElementById("wordResult")
      .textContent =
      value === answer
        ? "🎉 Correct!"
        : "❌ Wrong!";
  };
}

/* ---------------- SIMON ---------------- */

function simonGame() {
  const colors = ["red","green","blue","yellow"];

  let sequence = [];
  let index = 0;

  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>Simon</h2>
      <button onclick="simonStart()">Start</button>
      <div id="simonButtons"></div>
      <div id="simonResult" class="result"></div>
    </div>
  `;

  const container =
    document.getElementById("simonButtons");

  colors.forEach(color => {
    const button =
      document.createElement("button");

    button.textContent = color;
    button.style.background = color;

    button.onclick = () => {
      if (!sequence.length) return;

      if (color !== sequence[index]) {
        document.getElementById("simonResult")
          .textContent = "❌ Game Over";
        sequence = [];
        return;
      }

      index++;

      if (index === sequence.length) {
        document.getElementById("simonResult")
          .textContent = "✅ Next round!";
        setTimeout(nextRound,500);
      }
    };

    container.appendChild(button);
  });

  window.simonStart = () => {
    sequence = [];
    nextRound();
  };

  function nextRound() {
    sequence.push(
      colors[Math.floor(Math.random()*colors.length)]
    );

    index = 0;

    document.getElementById("simonResult")
      .textContent =
      "Sequence: " + sequence.join(" → ");
  }
}

/* ---------------- SIMPLE SNAKE ---------------- */

function snakeGame() {
  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>🐍 Snake</h2>
      <p>Use arrow keys.</p>
      <canvas id="snakeCanvas"
              width="400"
              height="400"
              style="background:#111;border-radius:15px">
      </canvas>
      <div id="snakeScore" class="result">0</div>
    </div>
  `;

  const canvas =
    document.getElementById("snakeCanvas");

  const ctx = canvas.getContext("2d");

  const size = 20;

  let snake = [
    {x:200,y:200},
    {x:180,y:200},
    {x:160,y:200}
  ];

  let dx = size;
  let dy = 0;

  let food = randomFood();
  let score = 0;

  document.onkeydown = e => {
    if (e.key === "ArrowUp" && dy === 0) {
      dx=0; dy=-size;
    }

    if (e.key === "ArrowDown" && dy === 0) {
      dx=0; dy=size;
    }

    if (e.key === "ArrowLeft" && dx === 0) {
      dx=-size; dy=0;
    }

    if (e.key === "ArrowRight" && dx === 0) {
      dx=size; dy=0;
    }
  };

  const timer = setInterval(() => {
    const head = {
      x: snake[0].x + dx,
      y: snake[0].y + dy
    };

    if (
      head.x < 0 ||
      head.x >= canvas.width ||
      head.y < 0 ||
      head.y >= canvas.height ||
      snake.some(p => p.x===head.x && p.y===head.y)
    ) {
      clearInterval(timer);

      document.getElementById("snakeScore")
        .textContent = `Game Over — ${score}`;

      return;
    }

    snake.unshift(head);

    if (head.x===food.x && head.y===food.y) {
      score++;
      food=randomFood();

      document.getElementById("snakeScore")
        .textContent=score;
    } else {
      snake.pop();
    }

    draw();
  },100);

  function draw() {
    ctx.clearRect(0,0,400,400);

    ctx.fillStyle="red";
    ctx.fillRect(food.x,food.y,size,size);

    ctx.fillStyle="#21c55d";

    snake.forEach(p =>
      ctx.fillRect(p.x,p.y,size-2,size-2)
    );
  }

  function randomFood() {
    return {
      x:Math.floor(Math.random()*20)*20,
      y:Math.floor(Math.random()*20)*20
    };
  }
}

/* ---------------- GENERIC MINI GAMES ---------------- */

function simpleChallenge(title, text, action) {
  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>${title}</h2>
      <p>${text}</p>
      <button id="challengeButton">
        Play
      </button>
      <div id="challengeResult" class="result"></div>
    </div>
  `;

  document.getElementById("challengeButton")
    .onclick = action;
}

function pongGame() {
  simpleChallenge(
    "🏓 Pong",
    "Press the button as many times as possible!",
    () => {
      document.getElementById("challengeResult")
        .textContent =
        "Pong prototype started!";
    }
  );
}

function dodgeGame() {
  simpleChallenge(
    "💥 Dodge",
    "Avoid the obstacles.",
    () => {
      document.getElementById("challengeResult")
        .textContent =
        "Dodge prototype started!";
    }
  );
}

function whackGame() {
  simpleChallenge(
    "🔨 Whack",
    "Hit the target!",
    () => {
      document.getElementById("challengeResult")
        .textContent =
        "💥 WHACK!";
    }
  );
}

function mazeGame() {
  simpleChallenge(
    "🗺️ Maze",
    "Find your way to the exit.",
    () => {
      document.getElementById("challengeResult")
        .textContent =
        "Maze prototype started!";
    }
  );
}

function aimGame() {
  simpleChallenge(
    "🎯 Aim Trainer",
    "Click the target.",
    () => {
      document.getElementById("challengeResult")
        .textContent =
        "🎯 HIT!";
    }
  );
}

function higherLower() {
  const first =
    Math.floor(Math.random()*100)+1;

  const next =
    Math.floor(Math.random()*100)+1;

  document.getElementById("game").innerHTML = `
    <div class="card">
      <h2>📈 Higher or Lower</h2>

      <h1>${first}</h1>

      <button onclick="higherAnswer('higher')">
        Higher
      </button>

      <button onclick="higherAnswer('lower')">
        Lower
      </button>

      <div id="higherResult" class="result"></div>
    </div>
  `;

  window.higherAnswer = answer => {
    const correct =
      next > first ? "higher" : "lower";

    document.getElementById("higherResult")
      .textContent =
      `Next number was ${next}. ${
        answer === correct
          ? "🎉 Correct!"
          : "❌ Wrong!"
      }`;
  };
}

function winner(board) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  return lines.some(([a,b,c]) =>
    board[a] &&
    board[a] === board[b] &&
    board[a] === board[c]
  );
}
