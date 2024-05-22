'use strict'

const LASER_SPEED = 80
var gHero = { pos:{i: 13, j: 7}, isShoot: false}

// creates the hero and place it on board 
function createHero(board){
    board[gHero.pos.i][gHero.pos.j] = gHero
    console.log('gHero:', gHero)
    console.log(board[gHero.pos.i][gHero.pos.j])

}
    

// Handle game keys 
function onKeyDown(eventKeyboard) { 
    var nextPos = {
        i: gHero.pos.i,
        j: gHero.pos.j
    }
    
    switch (eventKeyboard.code) {
        case 'ArrowLeft':
            onMoveHero('left')
            break
        case 'ArrowRight':
            onMoveHero('right')
            break
        default: return null
    }
    
    return nextPos
}


// Move the hero right (1) or left (-1) 
function onMoveHero(dir) {
    const nextPos = { i: gHero.pos.i, j: gHero.pos.j }
    if (dir === 'left' && gHero.pos.j > 0) nextPos.j--
    if (dir === 'right' && gHero.pos.j < BOARD_SIZE - 1) nextPos.j++

    updateCell(gHero.pos, null)
    gHero.pos = nextPos
    updateCell(gHero.pos, gHero)
}
// Sets an interval for shutting (blinking) the laser up towards aliens 
function shoot() { }

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) { }
