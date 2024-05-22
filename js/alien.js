'use strict'

const ALIEN_SPEED = 500 
var gIntervalAliens 
 
// The following two variables represent the part of the matrix (some rows) 
// that we should shift (left, right, and bottom) 
// We need to update those when: 
// (1) shifting down and (2) last alien was cleared from row 

var gAliensTopRowIdx 
var gAliensBottomRowIdx 
var gAliens = []
var gIsAlienFreeze = true 
 
function createAliens(board){
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = ALIEN_ROW_COUNT - 1

    for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
        gAliens[i] = []
        for (var j = 0; j < ALIEN_ROW_LENGTH; j++) {

            var colIdx = (BOARD_SIZE - ALIEN_ROW_LENGTH) / 2 + j
            board[i][colIdx] = ALIEN
            gAliens[i].push({ i, j: colIdx })
        }
    }
   // if(gIntervalAliens) clearInterval(gIntervalAliens)
    // gIntervalAliens = setInterval(moveAliens, 1000)
}

function handleAlienHit(pos) {} 
function shiftBoardRight(board, fromI, toI) {} 
function shiftBoardLeft(board, fromI, toI) {} 
function shiftBoardDown(board, fromI, toI) {} 
 
// runs the interval for moving aliens side to side and down 
// it re-renders the board every time 
// when the aliens are reaching the hero row - interval stops 
function moveAliens() {}