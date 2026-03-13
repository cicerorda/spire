let player
let enemy
let deck
let battle
let map
let currentNode
let availableNodes = []

function startGame(){

let generator = new MapGenerator()

map = generator.generate()

availableNodes = map.filter(n=>n.floor === 0)

renderMap()

}

function getNodeIcon(type){

if(type==="battle") return "⚔"
if(type==="event") return "❓"
if(type==="rest") return "🔥"
if(type==="shop") return "💰"
if(type==="boss") return "👑"

}

function renderMap(){

let mapDiv = document.getElementById("map")

mapDiv.innerHTML=""

map.forEach(node=>{

let div = document.createElement("div")

div.className="node"

div.innerText = getNodeIcon(node.type)

if(availableNodes.includes(node)){
div.classList.add("node-active")
div.onclick=()=>enterNode(node)
}

mapDiv.appendChild(div)

})

}

function enterNode(node){

currentNode = node

availableNodes = node.connections.map(id=>map.find(n=>n.id===id))

if(node.type === "battle"){

showBattle()
startBattle()

}

if(node.type === "rest"){
player.hp += 15
showMap()
}

if(node.type === "event"){
alert("Evento!")
showMap()
}

if(node.type === "shop"){
alert("Loja!")
showMap()
}

if(node.type === "boss"){
showBattle()
startBattle()
}

renderMap()

}

function startBattle(){

player = JSON.parse(JSON.stringify(POKEMONS.pikachu))
enemy = JSON.parse(JSON.stringify(ENEMIES.rattata))

deck = new Deck(player.deck)

battle = new Battle(player,enemy)

startTurn()

}

function startTurn(){

player.energy = 3

deck.draw(5)

renderHand()

updateUI()

}

function playCard(index){

let cardId = deck.hand[index]
let card = CARDS[cardId]

battle.playCard(card)

deck.discard(cardId)
deck.hand.splice(index,1)

if(enemy.hp <= 0){
victory()
return
}

renderHand()
updateUI()

}

function endTurn(){

battle.enemyTurn()

if(player.hp <= 0){
alert("Você perdeu!")
location.reload()
return
}

deck.discardPile.push(...deck.hand)
deck.hand = []

startTurn()

}

function renderHand(){

let handDiv = document.getElementById("hand")

handDiv.innerHTML=""

deck.hand.forEach((cardId,index)=>{

let card = CARDS[cardId]

let div=document.createElement("div")

div.className="card"

if(card.type){
div.classList.add("card-"+card.type)
}

let effectText = ""
if(card.effect){
effectText = card.effect.type
}

div.innerHTML=`

<div class="card-name">${card.name}</div>

<div class="card-cost">
⚡ ${card.cost}
</div>

<div class="card-damage">
${card.damage ? card.damage+" dmg" : ""}
</div>

<div class="card-effect">
${effectText}
</div>

`

div.onclick=()=>playCard(index)

handDiv.appendChild(div)

})

}

function updateUI(){

document.getElementById("player-name").innerText = player.name
document.getElementById("enemy-name").innerText = enemy.name

document.getElementById("player-hp").innerText = player.hp
document.getElementById("enemy-hp").innerText = enemy.hp
document.getElementById("energy").innerText = player.energy

}

function showMap(){

document.getElementById("map-screen").style.display="block"
document.getElementById("battle-screen").style.display="none"

}

function showBattle(){

document.getElementById("map-screen").style.display="none"
document.getElementById("battle-screen").style.display="block"

}

function victory(){

alert("Vitória!")

showMap()

}

startGame()