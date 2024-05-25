'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

const CANDY = '🍬'
const CANDY_APPEARANCE_INTERVAL = 10000
const CANDY_DISAPPEAR_INTERVAL = 5000

const HERO = '<img src="img/hero.jpg"'
const ALIEN = '<img src="img/aliens.jpg"'
const EXPLOSION = '💥'
const SKY = ''

var gCandyInterval

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN} 
var gBoard
var gGame = {
    isOn: false,
    score: 0,
    alienCount: ALIEN_ROW_LENGTH * ALIEN_ROW_COUNT,
    isSuperMode: false,
    superAttacks: 3,
    lives: 3
}

// Called when game loads 
function onInit() {
    hideModal()
    gBoard = createBoard()

    gGame.isOn = true
    gGame.isSuperMode = false
    gGame.superAttacks = 3
    gGame.lives = 3
    gGame.score = 0
    document.querySelector('.score').innerText = '0'

    createHero(gBoard)
    createAliens(gBoard)

    if (gLaserInterval) clearInterval(gLaserInterval)
    if (gCandyInterval) clearInterval(gCandyInterval)
    if (gIntervalAliens) clearInterval(gIntervalAliens)
    if (gRockInterval) clearInterval(gRockInterval)
    gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
    gCandyInterval = setInterval(spawnCandy, CANDY_APPEARANCE_INTERVAL)
    gRockInterval = setInterval(alienShootRocks, ROCK_SPAWN)
    renderBoard(gBoard)
}

// Create and returns the board with aliens on top, ground at bottom 
// use the functions: createCell, createHero, createAliens  
function createBoard() {
    const board = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        board.push([])
        for (var j = 0; j < BOARD_SIZE; j++) {
            var type = (i === BOARD_SIZE - 1) ? 'ground' : 'sky'
            board[i][j] = createCell('', type);
            // console.log('board[i][j]:', board[i][j])
        }
    }
    return board
}

// Render the board as a <table> to the page 
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var cellClass = (cell.type === 'ground') ? 'cell ground' : 'cell'
            strHTML += `<td class="${cellClass}"  data-i="${i}" data-j="${j}">
        ${cell.gameObject}
        </td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board-container')
    elBoard.innerHTML = strHTML
}

// position such as: {i: 2, j: 7} 
function updateCell(pos, gameObject = null, type = 'sky') {
    gBoard[pos.i][pos.j].gameObject = gameObject
    gBoard[pos.i][pos.j].type = type
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}

function createCell(gameObject = null, type = 'sky') {
    return {
        type: type,
        gameObject: gameObject,
    }
}

function updateScore(diff) {
    // update model and dom
    if (gGame.isOn) gGame.score += diff
    else gGame.score = 0
    document.querySelector('span').innerText = gGame.score
}

function spawnCandy() {
    const candyPos = { i: 0, j: getRandomIntInclusive(0, BOARD_SIZE - 1) }
    updateCell(candyPos, CANDY)
    setTimeout(() => {
        updateCell(candyPos)
    }, CANDY_DISAPPEAR_INTERVAL)
}

function updateLives(){
    document.querySelector('.lives').innerText = gGame.lives
}

function gameOver(){
    showModal()
}