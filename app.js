const movesCount = document.getElementById("moves");
const timeElapsed = document.getElementById("time");
const exoButton = document.getElementById("exo");
const nctButton = document.getElementById("nct");
const endButton = document.getElementById("end");
const gameContainer = document.getElementById("game");
const welcome = document.getElementById("welcome");
const result = document.getElementById("result");
const artistName = document.getElementById("name");
const controlsContainer = document.querySelector(".controls");

let cards;
let interval;
let firstCard = false;
let secondCard = false;
let items;
let artist;
let size;

// Items array
const exo_items = [
    {name: "suho",      image:"exo/suho.jpg"},
    {name: "xiumin",    image:"exo/xiumin.jpg"},
    {name: "lay",       image:"exo/lay.jpg"},
    {name: "baekhyun",  image:"exo/baekhyun.jpg"},
    {name: "chen",      image:"exo/chen.jpg"},
    {name: "chanyeol",  image:"exo/chanyeol.jpg"},
    {name: "d.o.",      image:"exo/do.jpg"},
    {name: "kai",       image:"exo/kai.jpg"},
    {name: "sehun",     image:"exo/sehun.jpg"}
];

const nct_items = [
    {name: "taeil",     image:"nct/taeil.jpg"},
    {name: "johnny",    image:"nct/johnny.jpg"},
    {name: "taeyong",   image:"nct/taeyong.jpg"},
    {name: "yuta",      image:"nct/yuta.jpg"},
    {name: "kun",       image:"nct/kun.jpg"},
    {name: "doyoung",   image:"nct/doyoung.jpg"},
    {name: "ten",       image:"nct/ten.jpg"},
    {name: "jaehyun",   image:"nct/jaehyun.jpg"},
    {name: "winwin",    image:"nct/winwin.jpg"},
    {name: "jungwoo",   image:"nct/jungwoo.jpeg"},
    {name: "lucas",     image:"nct/lucas.png"},
    {name: "mark",      image:"nct/mark.jpg"},
    {name: "xiaojun",   image:"nct/xiaojun.jpg"},
    {name: "hendery",   image:"nct/hendery.jpg"},
    {name: "renjun",    image:"nct/renjun.jpg"},
    {name: "jeno",      image:"nct/jeno.jpg"},
    {name: "haechan",   image:"nct/haechan.jpg"},
    {name: "jaemin",    image:"nct/jaemin.jpg"},
    {name: "yangyang",  image:"nct/yangyang.jpg"},
    {name: "shotaro",   image:"nct/shotaro.jpg"},
    {name: "sungchan",  image:"nct/sungchan.jpg"},
    {name: "chenle",    image:"nct/chenle.jpeg"},
    {name: "jisung",    image:"nct/jisung.jpg"}
];

// Initial stats
let seconds = 0, minutes = 0;
let moves = 0, wins = 0;

// Timer
const timeGenerator = () => {
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
const movesCounter = () => {
    moves++;
    movesCount.innerHTML = `<span>Moves: </span>${moves}`;
};

// Pick random items from the items array
const selectRandomItems = (size) => {
    // Temporary array to store unselected items
    let temp = [...items];
    let cardNames = [];
    size = (size ** 2) / 2;

    // Select a random item then remove from temporary array
    for (i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * temp.length);
        cardNames.push(temp[randomIndex]);
        temp.splice(randomIndex, 1);
    }
    return cardNames;
};

// Generate a puzzle grid
const puzzleGenerator = (cardNames, size, artist) => {
    // Generate two of each card then shuffle the order
    gameContainer.innerHTML = "";
    cardNames = [...cardNames, ...cardNames];
    cardNames.sort(() => Math.random() - 0.5);

    // Create cards
    // Front side contains EXO logo
    // Back side contains photo of EXO member
    for (i = 0; i < size ** 2; i++) {
        if (artist == "exo") {
            gameContainer.innerHTML += 
            `<div class="card" artist="exo" card-value="${cardNames[i].name}">
                <div class="front"><img src="exo/exo_icon.jpg" class="image"></div>
                <div class="back"><img src="${cardNames[i].image}" class="image"></div>
            </div>`;
        } else {
            gameContainer.innerHTML += 
            `<div class="card" artist="nct" card-value="${cardNames[i].name}">
                <div class="front"><img src="nct/nct_icon.jpg" class="image"></div>
                <div class="back"><img src="${cardNames[i].image}" class="image"></div>
            </div>`
        }
    }

    // Generate grid
    gameContainer.style.gridTemplateRows = `repeat(${size}, auto)`;
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
                } else {
                    // Increment moves
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("card-value");
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
                            let secondsElapsed = seconds < 10 ? `0${seconds}` : seconds;
                            let minutesElapsed = minutes < 10 ? `0${minutes}` : minutes;
                            setTimeout(() => {result.innerHTML = 
                            `<h3>Well done!</h3>
                            <h4> Moves: ${moves}</h4>
                            <h4>Time: ${minutesElapsed}:${secondsElapsed}</h4>
                            <h5>Choose a group:</h5>`;
                            stopGame();
                            welcome.classList.add("hide");
                            }, 500);
                        } 
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
};

// Initialise game
const initialiseGame = () => {
    result.innerText = "";
    wins = 0;
    cards = selectRandomItems(size);
    console.log(cards);
    puzzleGenerator(cards, size, artist);
};

// Start game
exoButton.addEventListener("click", () => {
    // Initialise move count and time
    moves = 0;
    seconds = 0;
    minutes = 0;
    // Initialise game parameters
    items = exo_items;
    artist = "exo";
    size = 4;
    artistName.innerHTML = `<span>EXO</span>`;
    timeElapsed.innerHTML = `<span>Time: </span>00:00`;
    // Hide start button and its container
    controlsContainer.classList.add("hide");
    endButton.classList.remove("hide");
    exoButton.classList.add("hide");
    nctButton.classList.add("hide");
    // Start timer
    interval = setInterval(timeGenerator, 1000);
    movesCount.innerHTML = `<span>Moves: </span>${moves}`;
    initialiseGame();
})

nctButton.addEventListener("click", () => {
    // Initialise move count and time
    moves = 0;
    seconds = 0;
    minutes = 0;
    // Initialise game parameters
    items = nct_items;
    artist = "nct";
    size = 6;
    artistName.innerHTML = `<span>NCT</span>`;
    timeElapsed.innerHTML = `<span>Time: </span>00:00`;
    // Hide start button and its container
    controlsContainer.classList.add("hide");
    endButton.classList.remove("hide");
    exoButton.classList.add("hide");
    nctButton.classList.add("hide");
    // Start timer
    interval = setInterval(timeGenerator, 1000);
    movesCount.innerHTML = `<span>Moves: </span>${moves}`;
    initialiseGame();
})

// End game
endButton.addEventListener("click", stopGame = () => {
    controlsContainer.classList.remove("hide");
    welcome.classList.remove("hide");
    endButton.classList.add("hide");
    exoButton.classList.remove("hide");
    nctButton.classList.remove("hide");
    clearInterval(interval);
})
