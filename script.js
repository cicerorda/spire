let player
let enemy
let deck
let battle
let map
let currentNode
let availableNodes = []

function startGame(){
    
player.status = {}
player.attack = 0
player.defense = 0

let generator = new MapGenerator()

map = generator.generate()

availableNodes = map.filter(n=>n.floor === 0)

console.log(map)
console.log(availableNodes)

renderMap()

showMap()

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
player.hp = Math.min(player.hp + 15, 70)
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

// status
playerName += getStatusIcons(player)
enemyName += getStatusIcons(enemy)

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

let effectText = ""

if(card.effect){

if(card.effect.type==="attackUp")
effectText="⚔ +" + card.effect.amount

else if(card.effect.type==="attackDown")
effectText="⚔ -" + card.effect.amount

else if(card.effect.type==="defenseUp")
effectText="🛡 +" + card.effect.amount

else if(card.effect.type==="defenseDown")
effectText="🛡 -" + card.effect.amount

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
document.getElementById("reward-screen").style.display="none"

renderMap()

}

function showBattle(){

document.getElementById("map-screen").style.display="none"
document.getElementById("battle-screen").style.display="block"

}

function victory(){

battle = null

let rewardCards = Object.keys(CARDS)
.sort(()=>Math.random()-0.5)
.slice(0,3)

showReward(rewardCards)

}

function showReward(cards){

document.getElementById("battle-screen").style.display="none"
document.getElementById("reward-screen").style.display="block"

let container = document.getElementById("reward-cards")
container.innerHTML=""

cards.forEach(cardId=>{

let card = CARDS[cardId]

let div = document.createElement("div")
div.className="card"

if(card.element){
div.classList.add("card-"+card.element)
}

div.innerHTML = `
<div class="card-name">${card.name}</div>
<div class="card-cost">PP ${card.cost}</div>
<div class="card-damage">${card.damage || ""}</div>
`

div.onclick=()=>selectReward(cardId)

container.appendChild(div)

})

}

function selectReward(cardId){

player.deck.push(cardId)

document.getElementById("reward-cards").innerHTML = ""
document.getElementById("reward-screen").style.display="none"

showMap()

}

function renderLog(){

let logDiv = document.getElementById("battle-log")

if(!battle) return

logDiv.innerHTML = battle.logs
.map(l=>`<div class="log-${l.type}">${l.text}</div>`)
.join("")

logDiv.scrollTop = logDiv.scrollHeight

}

function showCharacterSelect(){

document.getElementById("character-screen").style.display="block"
document.getElementById("map-screen").style.display="none"
document.getElementById("battle-screen").style.display="none"
document.getElementById("reward-screen").style.display="none"

let container = document.getElementById("character-list")
container.innerHTML=""

Object.entries(CHARACTERS).forEach(([id,char])=>{

let div = document.createElement("div")

// usa o mesmo visual das cartas
div.className = "card"

div.innerHTML = `
<div class="card-name">${char.name}</div>

<div class="card-cost">HP ${char.hp}</div>

<div class="card-effect">
⚔ ${char.damage}
</div>
`

div.onclick = ()=>selectCharacter(id)

container.appendChild(div)

})

}

function selectCharacter(id){

// cria o player
player = JSON.parse(JSON.stringify(CHARACTERS[id]))

player.status = {}
player.attack = 0
player.defense = 0

// esconde seleção de personagem
document.getElementById("character-screen").style.display = "none"

// inicia jogo
startGame()

}

showCharacterSelect()