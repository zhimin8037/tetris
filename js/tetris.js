import BLOCKS from "./blocks.js";//이상없음

// DOM 이상없음
const playground = document.querySelector(".playground > ul");

// setting 이상없음
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables 이상없음
let score =0;
let duration = 500;
let downInterval;
let tempMovingItam;

//이상없음
const movingItem = {
    type: "",
    direction: 3,
    top: 0,
    left: 0,
};
//이상없음
init()

//이상없음
function init() {
    tempMovingItam = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine()
    }
    generateNewBlock()    
}
//이상없음
function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}
function renderBlocks(movetype = "") {
    const { type, direction, top, left } = tempMovingItam;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        console.log(playground.childNodes[y])
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, "moving")
        } else {
            tempMovingItam = { ...movingItem }
            setTimeout(() => {
                renderBlocks()
                if (movetype === "top") {
                    seizeBlock();
                }
            }, 0)
            return true;
        }       
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function seizeBlock(){    //이상없음
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    generateNewBlock()
}

function generateNewBlock() {

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1)
    }, duration)

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    // console.log(blockArray[randomIndex][0])
    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItam = {...movingItem};
    renderBlocks()
}
//이상없음
function checkEmpty(target){
    if(!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}
function moveBlock(movetype, amount){
    tempMovingItam[movetype] += amount;
    renderBlocks(movetype)
}
function chageDirection(){
    const direction = tempMovingItam.direction;
    direction === 3 ? tempMovingItam.direction = 0 : tempMovingItam.direction += 1;
    renderBlocks()
}
function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() =>{
        moveBlock("top", 1)
    }, 10)
}

document,addEventListener("keydown", e => {
    switch(e.keyCode) {
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
            chageDirection();
            break;
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
    console.log(e)
})