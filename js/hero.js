'use strict'

const LASER_SPEED = 80
const SUPER_LASER_SPEED = 40
const LASER_DURATION = 2000
const LASER = '🔴'
const SUPER_LASER = '🔥'

var gLaserInterval

var gHero = { pos: { i: 12, j: 7 }, isShoot: false }

// creates the hero and place it on board 
function createHero(board) {
    const heroPos = gHero.pos
    board[heroPos.i][heroPos.j].gameObject = HERO
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
        case 'KeyX':
            activateSuperMode()
            break
    }
}

// Move the hero right (1) or left (-1) 
function onMoveHero(dir) {
    if (!gGame.isOn) {
        updateCell(gHero.pos, null)
        return
    }

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
    if (!gGame.isOn || gHero.isShoot) return
    gHero.isShoot = true
    laserSound()

    var laserPos = { i: gHero.pos.i, j: gHero.pos.j }

    const speed = gGame.isSuperMode ? SUPER_LASER_SPEED : LASER_SPEED
    const laserSymbol = gGame.isSuperMode ? SUPER_LASER : LASER

    gLaserInterval = setInterval(() => {
        blinkLaser(laserPos, laserSymbol)
    }, speed)
}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos, laserSymbol) {
    const nextPos = { i: pos.i - 1, j: pos.j }
    const nextCell = gBoard[nextPos.i][nextPos.j].gameObject

    if (!nextPos.i || nextCell === ALIEN || nextCell === CANDY){
        if (!pos.i) return
        clearInterval(gLaserInterval)
        gHero.isShoot = false
        updateCell(pos)
        handleHit(nextPos, nextCell)
    } else {
        if (pos.i !== gHero.pos.i) {
            updateCell(pos)
        }
        pos.i--
        updateCell(pos, laserSymbol)
    }
}

function activateSuperMode() {
    if (gGame.superAttacks > 0) {
        gGame.isSuperMode = true
        gGame.superAttacks--
        document.querySelector('.super-attacks').innerText = gGame.superAttacks
        setTimeout(() => {
            gGame.isSuperMode = false
        }, 3000)
    } else {
        console.log('No Super Attacks')
    }
}

function handleHeroHit() {
    if (gGame.lives > 0) {
        gGame.lives--
        updateLives()
        console.log('Hitted Hero:')
        return
    }
    clearInterval(gAliensInterval)
    clearInterval(gRockInterval)
    gGame.isOn = false
    return
}