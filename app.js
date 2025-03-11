const movesCount = document.getElementById("moves");
const timeElapsed = document.getElementById("time");
const endButton = document.getElementById("end");
const gameContainer = document.getElementById("game");
const welcome = document.getElementById("welcome");
const result = document.getElementById("result");
const artistName = document.getElementById("name");
const controlsContainer = document.querySelector(".controls");

const artistButtons = [
    document.getElementById("exo"),
    document.getElementById("svt"),
    document.getElementById("nct")
];

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

// Initial stats
var totalSeconds, moves, wins;

const getItems = (folder, filenames) => {
    return filenames.map(file => ({
        name: file.split(".")[0],  
        image: folder + file
    }));
}

// Game configuration
const gameConfig = {
    exo: { items: getItems("exo/", exoImages), size: 4, name: "EXO", logo: "exo/exo_logo2.jpeg" },
    svt: { items: getItems("svt/", svtImages), size: 5, name: "SEVENTEEN", logo: "svt/svt_icon2.png", freeLogo: "svt/svt_icon.webp" },
    nct: { items: getItems("nct/", nctImages), size: 6, name: "NCT", logo: "nct/nct_logo.jpg" }
};

const getTimeDisplay = (totalSeconds) => {
    let seconds = Math.floor(totalSeconds % 60);
    let minutes = Math.floor(totalSeconds / 60);
    return [seconds.toString().padStart(2, '0'), minutes.toString().padStart(2, '0')];
}

// Timer
const timeGenerator = () => {
    [secondsElapsed, minutesElapsed] = getTimeDisplay(++totalSeconds);
    timeElapsed.innerHTML = `<span>Time: </span>${minutesElapsed}:${secondsElapsed}`;
};

// Moves count
const movesCounter = () => {
    movesCount.innerHTML = `<span>Moves: </span>${++moves}`;
};

// Pick random items from the items array
const selectRandomItems = (size) => {
    // Temporary array to store unselected items
    let temp = [...items];
    let cardNames = [];
    sizeTemp = Math.floor((size ** 2) / 2);

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

    if (size % 2 === 1) {
        cardNames.splice(size ** 2 / 2, 0, { name: "", image: "" });
    }

    // Create cards: front side contains logo, back side contains photo of member
    gameContainer.innerHTML = cardNames
        .slice(0, size ** 2)
        .map((card, i) => {
            // Handle the "free spot" case if there are an odd number of cards
            return card.name === "" ? `
                <div class="blank">
                    <div class="free"><img src="${gameConfig[artist].freeLogo}" alt="${artist}-logo" class="image"></div>
                </div>
            ` : `
                <div class="card" artist="${artist}" card-value="${card.name}">
                    <div class="front"><img src="${gameConfig[artist].logo}" alt="${artist}-logo" class="image"></div>
                    <div class="back"><img src="${card.image}" alt="${card.name}" class="image"></div>
                </div>
            `;
        })
        .join("");

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
                    if (firstCardValue === secondCardValue) {
                        // If the cards match, add a matched attribute to the card
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        secondCard = false;
                        // Increment win count
                        // Check if it equals half the number of cards
                        wins++;
                        if (wins === Math.floor(cards.length / 2)) {
                            [secondsElapsed, minutesElapsed] = getTimeDisplay(totalSeconds);
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
                        setTimeout(() => {
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
    // Initialise move count and time
    moves = 0;
    totalSeconds = 0;
    movesCount.innerHTML = `<span>Moves: </span>${moves}`;
    timeElapsed.innerHTML = `<span>Time: </span>00:00`;

    // Hide start button and its container
    controlsContainer.classList.add("hide");
    endButton.classList.remove("hide");
    artistButtons.forEach(button => button.classList.add("hide"));

    // Initialise puzzle
    result.innerText = "";
    wins = 0;
    cards = selectRandomItems(size);
    puzzleGenerator(cards, size, artist);

    // Start timer
    interval = setInterval(timeGenerator, 1000);
};

// Start game
document.querySelectorAll(".buttons button").forEach(button => {
    button.addEventListener("click", () => {
        // Get the button ID (exo, svt, nct)
        const key = button.id;

        if (gameConfig[key]) {
            // Set game parameters dynamically
            ({ items, size } = gameConfig[key]);
            artist = key;
            artistName.innerHTML = `<span>${gameConfig[key].name}</span>`;
            initialiseGame();
        }
    });
});

// End game
endButton.addEventListener("click", stopGame = () => {
    controlsContainer.classList.remove("hide");
    welcome.classList.remove("hide");
    endButton.classList.add("hide");
    artistButtons.forEach(button => button.classList.remove("hide"));
    clearInterval(interval);
})