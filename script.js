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
if(player) player.hp += 15
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

let chars = Object.values(CHARACTERS)

player = JSON.parse(JSON.stringify(CHARACTERS.pikachu))

enemy = JSON.parse(JSON.stringify(
chars[Math.floor(Math.random()*chars.length)]
))

player.status = {}
enemy.status = {}

player.attack = 0
player.defense = 0

enemy.attack = 0
enemy.defense = 0

deck = new Deck(player.deck)

battle = new Battle(player,enemy,deck)

battle.startTurn()

renderHand()

updateUI()

}

function updateUI(){

let enemyName = enemy.name
let playerName = player.name

// ATAQUE / DEFESA
playerName += " ⚔" + (player.attack || 0)
playerName += " 🛡" + (player.defense || 0)

enemyName += " ⚔" + (enemy.attack || 0)
enemyName += " 🛡" + (enemy.defense || 0)


// STATUS DO PLAYER
if(player.status?.poison){
playerName += " 🧪" + player.status.poison
}

if(player.status?.burn){
playerName += " 🔥" + player.status.burn
}

if(player.status?.paralyze){
playerName += " ⚡"
}


// STATUS DO ENEMY
if(enemy.status?.poison){
enemyName += " 🧪" + enemy.status.poison
}

if(enemy.status?.burn){
enemyName += " 🔥" + enemy.status.burn
}

if(enemy.status?.paralyze){
enemyName += " ⚡"
}


// ATUALIZA HTML
document.getElementById("player-name").innerText = playerName
document.getElementById("enemy-name").innerText = enemyName

document.getElementById("player-hp").innerText = player.hp
document.getElementById("enemy-hp").innerText = enemy.hp
document.getElementById("energy").innerText = player.energy

renderLog()

}

function playCard(index){

let cardId = deck.hand[index]
let card = CARDS[cardId]

if(!card) return

battle.playCard(player, card)

deck.discard(cardId)
deck.hand.splice(index,1)

if(enemy.hp <= 0){
victory()
return
}

renderHand()
updateUI()

if(player.energy <= 0){
setTimeout(endTurn, 500)
}

}

function endTurn(){

battle.endTurn()

if(player.hp <= 0){
alert("Você perdeu!")
location.reload()
return
}

deck.discardPile.push(...deck.hand)
deck.hand = []

battle.startTurn()

renderHand()

updateUI()

}

function renderHand(){

let handDiv = document.getElementById("hand")

handDiv.innerHTML=""

deck.hand.forEach((cardId,index)=>{

let card = CARDS[cardId]

if(!card) return

let div = document.createElement("div")

div.className="card"

if(card.type){
div.classList.add("card-"+card.element)
}

let effectText = ""

if(card.effect){

if(card.effect.type==="poison")
effectText = "Poison " + card.effect.amount

if(card.effect.type==="weak")
effectText = "Weak " + card.effect.amount

}

div.innerHTML=`

<div class="card-name">${card.name}</div>

<div class="card-cost">PP ${card.cost}</div>

<div class="card-effect">
${effectText}
</div>

`

div.onclick=()=>playCard(index)

// sem energia suficiente
if(player.energy < card.cost){

div.classList.add("card-disabled")
div.classList.add("card-no-energy")

div.style.pointerEvents="none"
}

handDiv.appendChild(div)

})

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

let rewardCards = Object.keys(CARDS)
.sort(()=>Math.random()-0.5)
.slice(0,3)

let choice = prompt(
"Escolha uma carta:\n" +
rewardCards.map((c,i)=>`${i+1} - ${CARDS[c].name}`).join("\n")
)

let selected = rewardCards[choice-1]

if(selected){
deck.discardPile.push(selected)
}

showMap()

}

function renderLog(){

let logDiv = document.getElementById("battle-log")

if(!battle) return

logDiv.innerHTML = battle.logs
.map(l=>"<div>"+l+"</div>")
.join("")

logDiv.scrollTop = logDiv.scrollHeight

}

startGame()