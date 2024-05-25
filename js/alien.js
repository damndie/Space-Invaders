'use strict'

const ALIEN_SPEED = 500
const ROCK_SPEED = 300
const ROCK_SPAWN = 2000
const ROCK = '🪨'

var gDeadAliens = []
var gIntervalAliens
var gAliensRockInterval
var gRockInterval




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
            // console.log('gGame.alienCount:', gGame.alienCount)
        }
    }
}

function handleHit(pos, target) {
    if (target === ALIEN) {
        updateScore(10)
        gDeadAliens.push(pos)
        renderBoard(gBoard)
    } else if (target === CANDY) {
        updateScore(50)
        gIsAlienFreeze = true;
        setTimeout(() => {
            gIsAlienFreeze = false;
        }, 5000);
    }

    updateCell(pos, EXPLOSION)
    setTimeout(() => {
        updateCell(pos);
    }, 100);
    gGame.alienCount--
}

function shiftBoardRight(board, fromI, toI) {
    if (gIsAlienFreeze) return
    for (var i = fromI; i <= toI; i++) {
        const row = board[i]
        const lastElement = { ...row[row.length - 1] } // Clone last element
        for (var j = row.length - 1; j > 0; j--) {
            row[j] = row[j - 1]
        }
        row[0] = lastElement
    }
}

function shiftBoardLeft(board, fromI, toI) {
    if (gIsAlienFreeze) return
    for (var i = fromI; i <= toI; i++) {
        const row = board[i];
        const firstElement = { ...row[0] }; // Clone first element
        for (var j = 0; j < row.length - 1; j++) {
            row[j] = row[j + 1]
        }
        row[row.length - 1] = firstElement;
    }
}

function shiftBoardDown(board, fromI, toI) {
    if (gIsAlienFreeze) return
    for (var i = toI; i >= fromI; i--) {
        if (i + 1 < board.length) {
            for (var j = 0; j < board[i].length; j++) {
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
        for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
            if (gBoard[i][BOARD_SIZE - 1].gameObject === ALIEN) {
                gMoveDirection = 'left'
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                break
            }
        }
    } else {
        shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
        // Checking if any alien is at the left edge
        for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
            if (gBoard[i][0].gameObject === ALIEN) {
                gMoveDirection = 'right'
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                break
            }
        }
    }
    renderBoard(gBoard)

    if (gAliensBottomRowIdx >= gHero.pos.i) {
        clearInterval(gIntervalAliens)
        gGame.isOn = false
        gIsAlienFreeze = true
        gameOver()
        return
    }
}

function alienShootRocks() {
    if (!gGame.isOn) return
    const aliens = []
    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].gameObject === ALIEN) {
                aliens.push({ i, j })
            }
        }
    }

    if (!aliens.length) return null

    var randIdx = getRandomIntInclusive(0, aliens.length - 1)
    var rockPos = aliens[randIdx]
    shootRock(rockPos)
}

function shootRock(pos) {
    var rockPos = { i: pos.i + 1, j: pos.j }
    gRockInterval = setInterval(() => {
        if (gBoard[rockPos.i][rockPos.j].gameObject === ALIEN) return
        if (rockPos.i > BOARD_SIZE - 1) {
            updateCell(rockPos)
            clearInterval(gRockInterval)
            return
        }

        if (rockPos.i === gHero.pos.i && rockPos.j === gHero.pos.j) {
            updateCell(rockPos)
            handleHeroHit()
            if (gGame.lives > 0) {
                updateLives()
                return
            }
            gGame.isOn = false
            updateCell(gHero.pos, null)
            gHero.pos = { i: -1, j: -1 }
            showModal()
            renderBoard(gBoard)
        }

        const nextCell = gBoard[rockPos.i + 1][rockPos.j].gameObject

        if (nextCell === HERO) {
            clearInterval(gRockInterval)
            handleHeroHit()
            updateCell(rockPos)
        } else {
            if (rockPos.i >= 0) {
                updateCell(rockPos)
            }
            rockPos.i++
            updateCell(rockPos, ROCK)
        }
    }, ROCK_SPEED)
}


