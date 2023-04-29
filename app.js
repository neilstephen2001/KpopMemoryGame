const movesCount = document.getElementById("moves");
const timeElapsed = document.getElementById("time");
const startButton = document.getElementById("start");
const endButton = document.getElementById("end");
const gameContainer = document.getElementById("game");
const result = document.getElementById("result");
const controlsContainer = document.querySelector(".controls");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Items array
const items = [
    {name: "suho", image:"images/suho.jpg"},
    {name: "xiumin", image:"images/xiumin.jpg"},
    {name: "lay", image:"images/lay.jpg"},
    {name: "baekhyun", image:"images/baekhyun.jpg"},
    {name: "chen", image:"images/chen.jpg"},
    {name: "chanyeol", image:"images/chanyeol.jpg"},
    {name: "d.o.", image:"images/do.jpg"},
    {name: "kai", image:"images/kai.jpg"},
    {name: "sehun", image:"images/sehun.jpg"}
];

// Initial stats
let seconds = 0, minutes = 0;
let moves = 0, wins = 0;

// Timer
function timeGenerator() {
    seconds++;
    if (seconds >= 60) {
        minutes++;
        seconds = 0;
    }

    // Formatting the time
    let secondsElapsed = seconds < 10 ? `0${seconds}` : seconds;
    let minutesElapsed = minutes < 10 ? `0${minutes}` : minutes;
    timeElapsed.innerHTML = `<span>Time: </span>${minutesElapsed}:${secondsElapsed}`;
};

// Moves count
function movesCounter() {
    moves++;
    movesCount.innerHTML = `<span>Moves:</span>${moves}`;
}

// Pick random items from the items array
function selectRandomItems(size = 4) {
    // Temporary array to store unselected items
    let temp = [...items];
    let cards = [];
    size = (size ** 2) / 2;

    // Select a random item then remove from temporary array
    for (i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * temp.length);
        cards.push(temp[randomIndex]);
        temp.splice(randomIndex, 1);
    }
    return cards;
}

// Generate a puzzle grid
function puzzleGenerator (cards, size = 4) {
    // Generate two of each card then shuffle the order
    gameContainer.innerHTML = "";
    cards = [...cards, ...cards];
    cards.sort(() => Math.random() - 0.5);

    // Create cards
    // Front side contains EXO logo
    // Back side contains photo of EXO member
    for (i = 0; i < size ** 2; i++) {
        gameContainer.innerHTML += 
        `<div class="card" card-value="${cards[i].name}">
            <div class="front"><img src="images/exo_icon.jpg" class="image"></div>
            <div class="back"><img src="${cards[i].image}" class="image"></div>
        </div>`;
    }
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;
}

// Initialise game
function initialiseGame() {
    result.innerText = "";
    winCount = 0;
    cards = selectRandomItems();
    console.log(cards);
    puzzleGenerator(cards);
}

initialiseGame();
