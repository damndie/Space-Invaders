'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

const HERO = '🤖'
const ALIEN = '👽'
const SKY = ''

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN} 
var gBoard
var gGame = {
    isOn: false,
    score: 0,
    alienCount: 0,
}

// Called when game loads 
function onInit() {
    gGame.isOn = true
    gBoard = createBoard()
    gGame.score = 0
    document.querySelector('h1 span').innerText = '0'
    createHero(gBoard)
    createAliens(gBoard)
    renderBoard(gBoard)
}

// Create and returns the board with aliens on top, ground at bottom 
// use the functions: createCell, createHero, createAliens  
function createBoard() {
    const board = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        board.push([])
        for (var j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = createCell()
            if (i === 0 || i === BOARD_SIZE - 1 || j === 0 || j === BOARD_SIZE - 1 || i === 1 || i < BOARD_SIZE - 1) {
                board[i][j].type = SKY;
            }
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
            var cellContent = cell.gameObject || ''
            strHTML += `<td class="cell" data-i="${i}" data-j="${j}">
        ${cellContent}
        </td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board-container')
    elBoard.innerHTML = strHTML
}

// position such as: {i: 2, j: 7} 
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}

function createCell(gameObject = null) {
    return {
        type: '',
        gameObject: gameObject
    }
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff
    document.querySelector('h1 span').innerText = gGame.score
}

function checkVictory() {
    if (gGame.alienCount) return
}

