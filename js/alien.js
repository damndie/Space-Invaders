'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

// The following two variables represent the part of the matrix (some rows) 
// that we should shift (left, right, and bottom) 
// We need to update those when: 
// (1) shifting down and (2) last alien was cleared from row 

var gAliensTopRowIdx
var gAliensBottomRowIdx
var gIsAlienFreeze = false

function createAliens(board) {
    const startCol = parseInt(BOARD_SIZE - ALIEN_ROW_LENGTH) / 2

    for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
        for (var j = 0; j < ALIEN_ROW_LENGTH; j++) {
            board[i][startCol + j].gameObject = ALIEN
            gGame.alienCount++
        }
    }
    if (gIntervalAliens) clearInterval(gIntervalAliens)
    gIntervalAliens = setInterval(moveAliens, 1000)
}

function handleAlienHit(laserPos) {
    if (laserPos.i < 0) return
    clearInterval(gLaserInterval)
    gHero.isShoot = false
    if (gBoard[laserPos.i][laserPos.j].gameObject === ALIEN) {
        gGame.alienCount--
        updateScore(10)
        checkVictory()
    }
}

function shiftBoardRight(board, fromI, toI) {

}

function shiftBoardLeft(board, fromI, toI) {

}

function shiftBoardDown(board, fromI, toI) {

}

// runs the interval for moving aliens side to side and down 
// it re-renders the board every time 
// when the aliens are reaching the hero row - interval stops 
function moveAliens() {
    if (gIsAlienFreeze) return


    shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)

    renderBoard(gBoard)

    if (gAliensBottomRowIdx >= gHero.pos.i) {
        clearInterval(gIntervalAliens)
        gIsAlienFreeze = true
    }
}