'use strict'

const LASER_SPEED = 80
var gLaserInterval
const LASER = '⤊'
var gHero = { pos: { i: 13, j: 7 }, isShoot: false }

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
        default: return null
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
}

// Sets an interval for shutting (blinking) the laser up towards aliens 
function shoot() {
    if (gHero.isShoot) return
    gHero.isShoot = true
    gLaserInterval = setInterval(shootProgress, LASER_SPEED)
}

// Interval function shoot
function shootProgress() {
    var laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    updateCell(laserPos, null)

    while (laserPos.i >= 0 && gBoard[laserPos.i][laserPos.j].gameObject !== ALIEN) {

        handleAlienHit(laserPos)
        blinkLaser(laserPos)
        updateCell({ i: laserPos.i + 1, j: laserPos.j }, null)
        updateCell(gHero.pos, HERO)
        laserPos.i--

    }
    return
}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) {
    updateCell(pos, LASER);

    setTimeout(() => {
        updateCell(pos, null);
    }, 500);
}
