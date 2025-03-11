const movesCount = document.getElementById("moves");
const timeElapsed = document.getElementById("time");
const exoButton = document.getElementById("exo");
const svtButton = document.getElementById("svt");
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

const exoImages = [
    "suho.jpg", "xiumin.jpg", "lay.jpg", "baekhyun.jpg", "chen.jpg", "chanyeol.jpg", "do.jpg", "kai.jpg", "sehun.jpg"
];

const svtImages = [
    "scoups.jpg", "jeonghan.png", "joshua.jpg", "jun.jpg", "wonwoo.jpg", "hoshi.jpg", "woozi.jpg",
    "mingyu.jpg", "dk.jpeg", "the8.jpg", "seungkwan.jpg", "vernon.jpg", "dino.jpg"
];

const nctImages = [
    "johnny.jpg", "taeyong.jpg", "yuta.jpg", "kun.jpg", "doyoung.jpg", "ten.jpg",
    "jaehyun.jpg", "winwin.jpg", "jungwoo.jpeg", "mark.jpg", "xiaojun.jpg", "hendery.jpg",
    "renjun.jpg", "jeno.jpg", "haechan.jpg", "jaemin.jpg", "yangyang.jpg", "chenle.jpeg", "jisung.jpg"
];

// Items array
const exoItems = getItems("exo/", exoImages);
const svtItems = getItems("svt/", svtImages);
const nctItems = getItems("nct/", nctImages);

// Initial stats
let seconds = 0, minutes = 0;
let moves = 0, wins = 0;

const getItems = (folder, filenames) => {
    return filenames.map(file => ({
        name: file.split(".")[0],  
        image: folder + file
    }));
}

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
    sizeTemp = Math.floor((size ** 2) / 2);
    console.log(sizeTemp);

    // Select a random item then remove from temporary array
    for (i = 0; i < sizeTemp; i++) {
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
    console.log(cardNames)

    // Create cards
    // Front side contains logo
    // Back side contains photo of member
    for (i = 0; i < size ** 2; i++) {
        if (artist == "exo") {
            gameContainer.innerHTML +=
                `<div class="card" artist="exo" card-value="${cardNames[i].name}">
                <div class="front"><img src="exo/exo_logo2.jpeg" class="image"></div>
                <div class="back"><img src="${cardNames[i].image}" class="image"></div>
            </div>`;
        } else if (artist == "nct") {
            gameContainer.innerHTML +=
                `<div class="card" artist="nct" card-value="${cardNames[i].name}">
                <div class="front"><img src="nct/nct_logo.jpg" class="image"></div>
                <div class="back"><img src="${cardNames[i].image}" class="image"></div>
            </div>`
        } else {
            console.log(i)
            // bottom right is a free spot since there is an odd number of cards
            if (i == 24) {
                gameContainer.innerHTML +=
                    `<div class="blank">
                    <div class="free"><img src="svt/svt_icon.webp" class="image"></div>
                </div>`
            } else {
                gameContainer.innerHTML +=
                    `<div class="card" artist="svt" card-value="${cardNames[i].name}">
                    <div class="front"><img src="svt/svt_icon2.png" class="image"></div>
                    <div class="back"><img src="${cardNames[i].image}" class="image"></div>
                </div>`
            }
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
            if (!card.classList.contains("matched") && !card.classList.contains("flipped") && (!firstCard || !secondCard)) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("card-value");
                } else if (!secondCard) {
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
                        secondCard = false;
                        // Increment win count
                        // Check if it equals half the number of cards
                        wins++;
                        if (wins == Math.floor(cards.length / 2)) {
                            let secondsElapsed = seconds < 10 ? `0${seconds}` : seconds;
                            let minutesElapsed = minutes < 10 ? `0${minutes}` : minutes;
                            setTimeout(() => {
                                result.innerHTML =
                                    `<h3>Well done!</h3>
                            <h4> Group: ${artist.toUpperCase()}</h4>
                            <h4> Moves: ${moves}</h4>
                            <h4>Time: ${minutesElapsed}:${secondsElapsed}</h4>
                            <h5>Choose a group:</h5>`;
                                stopGame();
                                welcome.classList.add("hide");
                            }, 1000);
                        }
                    } else {
                        // If the cards don't match, flip both around
                        tempFirstCard = firstCard;
                        tempSecondCard = secondCard;
                        let delay = setTimeout(() => {
                            tempFirstCard.classList.remove("flipped");
                            tempSecondCard.classList.remove("flipped");
                            firstCard = false;
                            secondCard = false;
                        }, 750);
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

svtButton.addEventListener("click", () => {
    // Initialise move count and time
    moves = 0;
    seconds = 0;
    minutes = 0;
    // Initialise game parameters
    items = svt_items;
    artist = "svt";
    size = 5;
    artistName.innerHTML = `<span>SEVENTEEN</span>`;
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

//