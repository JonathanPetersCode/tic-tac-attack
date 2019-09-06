"use strict";

let defaultBoard;
let humanPlayer = "O"
var humanScore = 0; //Human's Score
let computerPlayer = "X"
var computerScore = 0; //Computer's Score

const winningCombos = [
    //All possible winning combination patterns
    [0, 1, 2],
    [3, 4, 5],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
    [6, 7, 8],
    [0, 3, 6],
]; 
const boardCells = document.querySelectorAll(".cell"); 
startGame();

function startGame(){
    document.querySelector(".endgame").style.display = "none"; 
    defaultBoard = Array.from(Array(9).keys())
    for(let i = 0; i < boardCells.length; i++){
        boardCells[i].innerText = "";
        boardCells[i].style.removeProperty("background-color");
        boardCells[i].addEventListener("click", turnClick, false)
    }
}
function turnClick(square){
    if(typeof defaultBoard[square.target.id] == "number"){
        //Prevents player from playing a cell that's already been played
        turn(square.target.id, humanPlayer) //Human Players turn
        if (!checkForWin(defaultBoard, humanPlayer) && !checkTie()) turn(bestSpot(), computerPlayer); //Checks if game is a tie      
    }       
}
function turn(squareId, player){
    defaultBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkForWin(defaultBoard, player)
    if(gameWon) gameOver(gameWon)
}
function checkForWin(board, player){
    /* Find plays on the board that have already been chosen by the player or Computer */
    let plays = board.reduce((a, e, i) => 
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index, win] of winningCombos.entries()){
        //Get the index and winning combination
        if(win.every(elem => plays.indexOf(elem) > -1)) {
            // Checks if a player has played all places for a winning combination
            gameWon = {index: index, player: player}; 
            break;
        }
    }
    return gameWon;
}
function gameOver(gameWon) {
    for(let index of winningCombos[gameWon.index]){
        // Stores the human's score in localStorage
        window.localStorage.setItem('humanScore', humanScore.toString())
        // Stores the computer's score in localStorage 
        window.localStorage.setItem('computerScore', computerScore.toString())
        //Highlight cell of the winning combination, changing BG color for the winning player 
        document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "#1B998B" : "#D7263D";
        document.querySelector(".replay-btn").classList.add("animated", "shake")
    }
    for (var i = 0; i < boardCells.length; i++){
        boardCells[i].removeEventListener("click", turnClick, false)
    }
let winningMessage = "";
if (gameWon.player == humanPlayer) {
    winningMessage = "You Win!";
    document.querySelector(".human-Score").innerHTML = humanScore+=1
    return declareWinner(winningMessage);
} else {
    winningMessage = "Computer Wins!"
    document.querySelector(".ai-Score").innerHTML = computerScore += 1
    return declareWinner(winningMessage);
    } 
}
function emptySquares(){
    return defaultBoard.filter(s => typeof s == "number")
}
function bestSpot(){ // Determines the best cell for computer to play
    return minimax(defaultBoard, computerPlayer).index; // Returns minimax function call  
}
function checkTie(){
    if(emptySquares().length == 0) { // Checks if all boardCells have been played, if so game is tied
        for(var i = 0; i < boardCells.length; i++){
            boardCells[i].style.backgroundColor = "#EE82EE";
            boardCells[i].removeEventListener("click", turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    } 
    return false;
}
function declareWinner(who){ //Declares winner and display text
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}
function minimax(newBoard, player){
    var availSpots = emptySquares();
    if (checkForWin(newBoard, player)) { 
        return {score: -10};
    // Check if a player has won - If "O" wins return -10
    } else if(checkForWin(newBoard, computerPlayer)){
        return {score: 10};
    //If "X" wins return 10
    } else if(availSpots.length === 0){
        return {score: 0}
    //If there are no remaining boardCells to play, game is a tie
    }
    var moves = [];
    //Collect scores from all empty spots to evaulate remaining spots and played boardCells.
    for(var i = 0; i < availSpots.length; i++){
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;
    //Sets Minmax function to recursively check for a win or tie state.
        if (player == computerPlayer){
            var result = minimax(newBoard, humanPlayer);

            move.score = result.score;
        } else {
            var result = minimax(newBoard, computerPlayer);
            move.score = result.score;
        }
    newBoard[availSpots[i]] = move.index;

    moves.push(move)
    }
    var bestMove;
    if (player === computerPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}