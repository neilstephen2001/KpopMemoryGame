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
function puzzleGenerator (cardNames, size = 4) {
    // Generate two of each card then shuffle the order
    gameContainer.innerHTML = "";
    cardNames = [...cards, ...cards];
    cardNames.sort(() => Math.random() - 0.5);

    // Create cards
    // Front side contains EXO logo
    // Back side contains photo of EXO member
    for (i = 0; i < size ** 2; i++) {
        gameContainer.innerHTML += 
        `<div class="card" card-value="${cardNames[i].name}">
            <div class="front"><img src="images/exo_icon.jpg" class="image"></div>
            <div class="back"><img src="${cardNames[i].image}" class="image"></div>
        </div>`;
    }

    // Generate grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    // Cards
    cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            // Flip a clicked card if it is unmatched
            // Set card to the first/second selected card and store its value
            if (!card.classList.contains("matched")) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("card-value");
                }
            } else {
                movesCounter();
                secondCard = card;
                secondCardValue = card.getAttribute("card-value");
                // Compare the values of first and second card
                if (firstCardValue == secondCardValue) {
                    // If the cards match, add a matched attribute to the card
                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");
                    firstCard = false;
                    // Increment win count
                    // Check if it equals half the number of cards
                    wins++;
                    if (wins == Math.floor(cards.length / 2)) {
                        result.innerHTML = 
                        `<h3>Congratulations, you won!</h3>
                        <h4> Moves: ${move}</h4>`;
                        stopGame();
                    } else {
                        // If the cards don't match, flip both around
                        tempFirstCard = firstCard;
                        tempSecondCard = secondCard;
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirstCard.classList.remove("flipped");
                            tempSecondCard.classList.remove("flipped");
                        }, 900);
                    } 
                }
            }
        })
    })
}

// Initialise game
function initialiseGame() {
    result.innerText = "";
    wins = 0;
    cards = selectRandomItems();
    console.log(cards);
    puzzleGenerator(cards);
}

// Start game
startButton.addEventListener("click", () => {
    // Initialise move count and time
    moves = 0;
    time = 0;
    // Hide start button and its container
    controlsContainer.classList.add("hide");
    endButton.classList.remove("hide");
    startButton.classList.add("hide");
    // Start timer
    interval = setInterval(timeGenerator(), 1000);
    movesCount.innerHTML = `<span>Moves: </span>${moves}`;
    initialiseGame();
})

// End game
endButton.addEventListener("click", stopGame = () => {
    controlsContainer.classList.remove("hide");
    endButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
})
