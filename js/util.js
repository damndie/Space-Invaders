'use strict'

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN} 
function createCell(gameObject = null) {
  return {
    type: SKY,
    gameObject: gameObject
  }
}

function getElCell(pos) {
  return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`)
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function laserSound(){
  const sound = new Audio('sound/laser.mp3')
  sound.play()
}

function showModal() { 
  const elModal = document.querySelector(".modal"); 
  elModal.classList.remove("hide"); 
} 

function hideModal() { 
  const elModal = document.querySelector(".modal"); 
  elModal.classList.add("hide"); 
} 