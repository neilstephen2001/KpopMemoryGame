# K-pop Memory Game

[![Netlify Status](https://api.netlify.com/api/v1/badges/423da098-f252-4488-9557-b97feb4647fa/deploy-status)](https://app.netlify.com/sites/ns2001-kpop-memory/deploys)

## About game
- This is a clone of the popular card-matching game known as Concentration or Memory.
- This implementation is K-pop themed, where the cards contain images of members of the K-pop groups EXO, SEVENTEEN and NCT.
- Made with vanilla JavaScript, HTML and CSS.

## Gameplay

#### Welcome page
The player first selects a K-pop group for the theme of their game. The grid size differs between the three groups.
<br>
<img src="/screenshots/welcome.png" alt= “welcome” width="500">
<br>

#### Start of game
The player then clicks two cards to try match the images behind these. When two cards with the same image are clicked, these will remain flipped. 
Note that the bottom-right card for the SVT game is a blank space due to having an odd number of cards on the grid.
<br>
<img src="/screenshots/start-game.png" alt= “start-game” width="500">
<img src="/screenshots/ongoing-game.png" alt= “ongoing-game” width="500">
<br>

#### Results
The game ends either when all of the cards have been matched, or when the player clicks the 'End Game' button.
<br>
<img src="/screenshots/results.png" alt= “results” width="500">
<br>

## To run
- The game is currently deployed at https://ns2001-kpop-memory.netlify.app/ 
- However, the images will load faster if you download the code and run from your machine.

## To-do
- Fix the formatting/layout for mobile devices and differently-sized windows.
- Potentially add names of the members over their photo when their pair of cards has been matched.
