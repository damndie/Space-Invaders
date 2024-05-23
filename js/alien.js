'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens
var gDeadAliens = []


// The following two variables represent the part of the matrix (some rows) 
// that we should shift (left, right, and bottom) 
// We need to update those when: 
// (1) shifting down and (2) last alien was cleared from row 

var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = ALIEN_ROW_COUNT - 1
var gIsAlienFreeze = false
var gMoveDirection = 'right'

function createAliens(board) {
    const startCol = parseInt(BOARD_SIZE - ALIEN_ROW_LENGTH) / 2

    for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
        for (var j = 0; j < ALIEN_ROW_LENGTH; j++) {
            board[i][startCol + j].gameObject = ALIEN
            gGame.alienCount++
        }
    }
    if (gIntervalAliens) clearInterval(gIntervalAliens)
    gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
}

function handleAlienHit(pos, target) {
    updateScore(10)
    if (target === ALIEN) {
        gDeadAliens.push(pos)
        if (checkVictory()) {
            gameOver()
            return
        }
    }
    else {
        upScore = 50;
        gIsAlienFreeze = true;
        setTimeout(() => {
            gIsAlienFreeze = false;
        }, 5000);
    }
    setTimeout(() => {
        updateCell(pos);
    }, 150);
}

function shiftBoardRight(board, fromI, toI) {
    if (gIsAlienFreeze) return
    for (let i = fromI; i <= toI; i++) {
        const row = board[i]
        const lastElement = { ...row[row.length - 1] } // Clone last element
        for (let j = row.length - 1; j > 0; j--) {
            row[j] = row[j - 1]
        }
        row[0] = lastElement
    }
}

function shiftBoardLeft(board, fromI, toI) {
    if (gIsAlienFreeze) return
    for (let i = fromI; i <= toI; i++) {
        const row = board[i];
        const firstElement = { ...row[0] }; // Clone first element
        for (let j = 0; j < row.length - 1; j++) {
            row[j] = row[j + 1]
        }
        row[row.length - 1] = firstElement;
    }
}

function shiftBoardDown(board, fromI, toI) {
    if (gIsAlienFreeze) return
    for (let i = toI; i >= fromI; i--) {
        if (i + 1 < board.length) {
            for (let j = 0; j < board[i].length; j++) {
                board[i + 1][j] = { ...board[i][j] } // Clone element
                board[i][j] = { gameObject: SKY }
            }
        }
    }
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
}

// runs the interval for moving aliens side to side and down 
// it re-renders the board every time 
// when the aliens are reaching the hero row - interval stops 
function moveAliens() {
    if (gIsAlienFreeze) return

    if (gMoveDirection === 'right') {
        shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        // Checking if any alien is at the right edge
        for (let i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
            if (gBoard[i][BOARD_SIZE - 1].gameObject === ALIEN) {
                gMoveDirection = 'left'
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                break
            }
        }
    } else {
        shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
        // Checking if any alien is at the left edge
        for (let i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
            if (gBoard[i][0].gameObject === ALIEN) {
                gMoveDirection = 'right'
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                break
            }
        }
    }
    renderBoard(gBoard)

    if (gAliensBottomRowIdx >= gHero.pos.i) {
        clearInterval(gAliensInterval)
        gGame.isOn = false
        gIsAlienFreeze = true
        gameOver()
        return
    }
}