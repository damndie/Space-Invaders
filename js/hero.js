'use strict'

const LASER_SPEED = 80
const SUPER_LASER_SPEED = 40
const LASER_DURATION = 2000
var gLaserInterval
const LASER = '🔴'
const SUPER_LASER = '<img src="img/superlazer.jpg"'
var gHero = { pos: { i: 12, j: 7 }, isShoot: false }

// creates the hero and place it on board 
function createHero(board) {
    const heroPos = gHero.pos
    board[heroPos.i][heroPos.j].gameObject = HERO
    // console.log('gHero:', gHero)
    // console.log('heroPos:', heroPos)

}


// Handle game keys 
function onKeyDown(eventKeyboard) {
    switch (eventKeyboard.code) {
        case 'ArrowLeft':
            onMoveHero('left')
            break
        case 'ArrowRight':
            onMoveHero('right')
            break
        case 'Space':
            shoot()
            break
    }
}


// Move the hero right (1) or left (-1) 
function onMoveHero(dir) {
    const nextPos = { i: gHero.pos.i, j: gHero.pos.j }
    if (dir === 'left' && gHero.pos.j > 0) nextPos.j--
    if (dir === 'right' && gHero.pos.j < BOARD_SIZE - 1) nextPos.j++

    updateCell(gHero.pos, null)
    gHero.pos = nextPos
    updateCell(gHero.pos, HERO)
    renderBoard(gBoard)
}

// Sets an interval for shutting (blinking) the laser up towards aliens 
function shoot() {
    if (!gGame.isOn) return
    if (gHero.isShoot) return
    gHero.isShoot = true
    laserSound()
    var laserPos = { i: gHero.pos.i, j: gHero.pos.j }
    gLaserInterval = setInterval(() => {
        blinkLaser(laserPos)
    }, LASER_SPEED)
}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) {
    const nextPos = { i: pos.i - 1, j: pos.j }
    const nextCell = gBoard[nextPos.i][nextPos.j].gameObject

    if (!nextPos.i || nextCell === ALIEN) {
        clearInterval(gLaserInterval)
        gHero.isShoot = false
        updateCell(pos)
        if (!pos.i) return
        else if (nextCell === ALIEN) {
            var target = ALIEN
            handleHit(nextPos, target)
        }
    } else {
        if (pos.i !== gHero.pos.i) {
            updateCell(pos)
        }
        pos.i--
        updateCell(pos, LASER)
    }
}


