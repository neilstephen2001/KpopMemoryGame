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
let totalSeconds, moves, matches;

/**
 * Get all the items to use for the game.
 * @param folder The folder containing the images.
 * @param fileNames The names of the image files to use.
 * @returns {*}
 */
const getItems = (folder, fileNames) => {
    return fileNames.map(file => ({
        name: file.split(".")[0],  
        image: folder + file
    }));
}

/**
 * Game configuration.
 */
const gameConfig = {
    exo: { items: getItems("exo/", exoImages), size: 4, name: "EXO", logo: "exo/exo_logo2.jpeg", freeLogo: undefined },
    svt: { items: getItems("svt/", svtImages), size: 5, name: "SEVENTEEN", logo: "svt/svt_icon2.png", freeLogo: "svt/svt_icon.webp" },
    nct: { items: getItems("nct/", nctImages), size: 6, name: "NCT", logo: "nct/nct_logo.jpg", freeLogo: undefined }
};

/**
 * Get a readable version of the time elapsed.
 * @param totalSeconds
 * @returns {[string,string]}
 */
const getTimeDisplay = (totalSeconds) => {
    let seconds = Math.floor(totalSeconds % 60);
    let minutes = Math.floor(totalSeconds / 60);
    return [seconds.toString().padStart(2, '0'), minutes.toString().padStart(2, '0')];
}

/**
 * Increment the time elapsed.
 */
const timeGenerator = () => {
    [secondsElapsed, minutesElapsed] = getTimeDisplay(++totalSeconds);
    timeElapsed.innerHTML = `<span>Time: </span>${minutesElapsed}:${secondsElapsed}`;
};

/**
 * Increment the move count.
 */
const movesCounter = () => {
    movesCount.innerHTML = `<span>Moves: </span>${++moves}`;
};

/**
 * Get a random list of cards to use for the game.
 * @param size The size of the grid.
 * @returns {*[]}
 */
const getCards = (size) => {
    const itemsArray = [...items];
    const numberOfItems = Math.floor((size ** 2) / 2);

    // Select a random item then duplicate
    const cards = Array.from({ length: numberOfItems }, () =>
        itemsArray.splice(Math.floor(Math.random() * itemsArray.length), 1)[0]
    ).flatMap(card => [card, card]);

    // Shuffle the card order, and add the free space if required
    cards.sort(() => Math.random() - 0.5);

    if (size % 2 === 1) {
        cards.splice(size ** 2 / 2, 0, { name: "", image: "" });
    }

    return cards;
}

/**
 * Generate puzzle grid.
 * @param size The size of the grid.
 * @param artist The key for the artist.
 */
const puzzleGenerator = (size, artist) => {
    const cardNames = getCards(size);

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
                        matches++;
                        if (matches === Math.floor(cards.length / 2)) {
                            [secondsElapsed, minutesElapsed] = getTimeDisplay(totalSeconds);
                            setTimeout(() => {
                                result.innerHTML = `
                                    <h3>Well done!</h3>
                                    <h4> Group: ${artist.toUpperCase()}</h4>
                                    <h4> Moves: ${moves}</h4>
                                    <h4>Time: ${minutesElapsed}:${secondsElapsed}</h4>
                                    <h5>Choose a group:</h5>`;
                                endGame();
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
        });
    });
};

/**
 * Initialise the game.
 */
const initialiseGame = () => {
    // Reset move count, matches and time
    moves = matches = totalSeconds = 0;
    movesCount.innerHTML = `<span>Moves: </span>0`;
    timeElapsed.innerHTML = `<span>Time: </span>00:00`;
    result.innerText = "";

    // Toggle visibility of UI elements
    controlsContainer.classList.add("hide");
    endButton.classList.remove("hide");
    artistButtons.forEach(button => button.classList.add("hide"));

    // Generate puzzle and start timer
    puzzleGenerator(size, artist);
    interval = setInterval(timeGenerator, 1000);
};

// Set game parameters based on the button ID (artist name) and start the game
document.querySelectorAll(".buttons button").forEach(button => {
    button.addEventListener("click", () => {
        if (gameConfig[button.id]) {
            artist = button.id;
            ({ items, size } = gameConfig[artist]);
            artistName.innerHTML = `<span>${gameConfig[artist].name}</span>`;
            initialiseGame();
        }
    });
});

// End the game.
endButton.addEventListener("click", endGame = () => {
    controlsContainer.classList.remove("hide");
    welcome.classList.remove("hide");
    endButton.classList.add("hide");
    artistButtons.forEach(button => button.classList.remove("hide"));
    clearInterval(interval);
});