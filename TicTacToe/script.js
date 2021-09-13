//vars
const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
let circleTurn
let invalidMove = false
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winMessageElement = document.getElementById('playerWinsMessage')
const winMessageTxtElement = document.querySelector('[data-player-wins-text]')
const newGameButton = document.getElementById('newGameButton')

/*
Human player will use 'x'
Minimax (computer) will use 'circle'
*/

startGame()

newGameButton.addEventListener('click', startGame)

document.addEventListener('click', nextBestMove)

function startGame() {
    //x player starts first
    circleTurn = false

    //check for where player wants to place mark
    //can only do so once
    cellElements.forEach(cell => {
        //if new game -- clean board
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', mouseClick)
        cell.addEventListener('click', mouseClick, {once : true})
    })

    //if new game remove previous result show
    winMessageElement.classList.remove('show')
    
    //nextBestMove()

}




function mouseClick(e) {
    /*
    1. place player mark
    2. check for win conditions
    3. check for draw
    4. switch to next player
    */
   const cell = e.target
   const currClass = circleTurn ? CIRCLE_CLASS : X_CLASS
   if (!circleTurn) {
        markCell(cell, currClass)
   } 
   
   if (checkWin(currClass)) {
        endGame(false)
   } else if (isDraw()) {
        endGame(true)
   } else {
       if (!invalidMove) {
            switchPlayers()
       }  
   }   
}


function markCell(cell, currClass) {
    //mark current cell with the current class mark (x or circle)
    if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)) {
        cell.classList.add(currClass)
        invalidMove = false;
    } else {
        invalidMove = true;
    }

}


function switchPlayers() {
    circleTurn = !circleTurn
}

function checkWin(currClass) {
    //check if every cell inside combo is off the currClass
    //if so -> return true, else -> return false
    return winCombos.some(combo => {
        return combo.every(index => {
            return cellElements[index].classList.contains(currClass)
        })
    })
}

function endGame(draw) {
    //end the game under draw or win condition
    if (draw) {
        winMessageTxtElement.innerText = 'Draw!'
    } else {
        winMessageTxtElement.innerText = `${circleTurn ? "O's" : "X's"} Win!` 
    }
    winMessageElement.classList.add('show')
}

function isDraw() {
    //check if every cell if contained by x or circle class
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}


//minimax algorithm functions
function nextBestMove() {
    if (circleTurn) {
        let bestScore = -Infinity
        let bestMove
        for (let i=0; i<9; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {   
                cellElements[i].classList.add(CIRCLE_CLASS)
                let score = minimax(0, false)
                console.log("score: " + score)
                cellElements[i].classList.remove(CIRCLE_CLASS)
                if (score > bestScore) {
                    bestScore = score
                    bestMove = i
                }
            }
        }
        cellElements[bestMove].classList.add(CIRCLE_CLASS)
        if (checkWin(CIRCLE_CLASS)) {
            endGame(false)
        } else if (isDraw()) {
            endGame(true)
        }
        switchPlayers()
    } else {
        console.log("not AI turn")
    }
    
    
}

function minimax(depth, isMaximizing) {
    let xWon = checkWin(X_CLASS)
    let circleWon = checkWin(CIRCLE_CLASS)
    let draw = isDraw()
    if (xWon || circleWon) {
        if (xWon) {
            return -10
        } else {
            return 10
        }
    } else if (draw) {
        return 0
    }

    if (isMaximizing) {
        let bestScore = -Infinity
        for (let i=0; i<9; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {
                cellElements[i].classList.add(CIRCLE_CLASS)
                let score = minimax(depth + 1, false);
                cellElements[i].classList.remove(CIRCLE_CLASS)
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore
    } else {
        let bestScore = Infinity
        for (let i=0; i<9; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {
                cellElements[i].classList.add(X_CLASS)
                let score = minimax(depth + 1, true);
                cellElements[i].classList.remove(X_CLASS)
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore
    }

}