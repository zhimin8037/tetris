import BLOCKS from "./blocks.js";

const playground = document.querySelector(".playground > ul");
const gametext = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");

const GAME_ROWS = 20;
const GAME_COLS = 10;

let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const movingItem = {
  type: "",
  direction: 3,
  top: 0,
  left: 0,
};

init();

function init() {
  tempMovingItem = { ...movingItem };
  for (let i = 0; i < GAME_ROWS; i++) {
    prependNewLine();
  }
  generateNewBlock();
}

function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < GAME_COLS; j++) {
    const matrix = document.createElement("li");
    ul.appendChild(matrix);
  }
  li.appendChild(ul);
  playground.prepend(li);
}

function renderBlocks(movetype = "") {
  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving");
  });
  BLOCKS[type][direction].some((block) => {
    const x = block[0] + left;
    const y = block[1] + top;
    const target = playground.childNodes[y]
      ? playground.childNodes[y].childNodes[0].childNodes[x]
      : null;
    const isAvailable = checkEmpty(target);
    if (isAvailable) {
      target.classList.add(type, "moving");
    } else {
      tempMovingItem = { ...movingItem };
      if (movetype === "retry") {
        clearInterval(downInterval);
        showGameoverText();
      }
      setTimeout(() => {
        renderBlocks("retry");
        if (movetype === "top") {
          seizeBlock();
        }
      }, 0);
      return true;
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  checkMatch();
}

function checkMatch() {
  const childNodes = playground.childNodes;
  childNodes.forEach((child) => {
    let matched = true;
    child.children[0].childNodes.forEach((li) => {
      if (!li.classList.contains("seized")) {
        matched = false;
      }
    });
    if (matched) {
      child.remove();
      prependNewLine();
      score++;
      scoreDisplay.innerText = score;
    }
  });
  generateNewBlock();
}

function generateNewBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, duration);

  const blockArray = Object.entries(BLOCKS);
  const randomIndex = Math.floor(Math.random() * blockArray.length);
  movingItem.type = blockArray[randomIndex][0];
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}

function checkEmpty(target) {
  if (!target || target.classList.contains("seized")) {
    return false;
  }
  return true;
}

function moveBlock(movetype, amount) {
  tempMovingItem[movetype] += amount;
  renderBlocks(movetype);
}

function changeDirection() {
  const direction = tempMovingItem.direction;
  tempMovingItem.direction = direction === 3 ? 0 : direction + 1;
  renderBlocks();
}

function dropBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, 15);
}

function showGameoverText() {
  gametext.style.display = "flex";
}

document.addEventListener("keydown", (e) => {
  handleKeyPress(e.keyCode);
});

function handleKeyPress(keyCode) {
  switch (keyCode) {
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
      moveBlock("left", -1);
      break;
    case 40:
      moveBlock("top", 1);
      break;
    case 38:
      changeDirection();
      break;
    case 32:
      dropBlock();
      break;
    default:
      break;
  }
}

document.getElementById("leftButton").addEventListener("click", () => {
  moveBlock("left", -1);
});

document.getElementById("rightButton").addEventListener("click", () => {
  moveBlock("left", 1);
});

document.getElementById("downButton").addEventListener("click", () => {
  moveBlock("top", 1);
});

document.getElementById("upButton").addEventListener("click", () => {
  changeDirection();
});

document.getElementById("spaceButton").addEventListener("click", () => {
  dropBlock();
});

restartButton.addEventListener("click", () => {
  playground.innerHTML = "";
  gametext.style.display = "none";
  score = 0;
  scoreDisplay.innerText = score;
  init();
});