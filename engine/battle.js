class Battle{

constructor(player, enemy, deck){

this.player = player
this.enemy = enemy
this.deck = deck

this.logs = []

}

log(message){

this.logs.push(message)

if(this.logs.length > 5){
this.logs.shift()
}

}

startTurn(){

this.player.energy = 3

this.deck.draw(5)

}

endTurn(){

this.enemyTurn()

}

playCard(user, card){

this.log(user.name + " usou " + card.name)

if(user.energy < card.cost) return

user.energy -= card.cost

let target

if(card.target === "self"){
target = user
}else{
target = user === this.player ? this.enemy : this.player
}

// dano
if(card.damage){

let damage = card.damage

damage += user.attack || 0
damage -= target.defense || 0

if(damage < 0) damage = 0

target.hp -= damage
this.log(target.name + " sofreu " + damage + " de dano")
}

// efeito
if(card.effect){
this.applyEffect(card.effect, target)
}

}

applyEffect(effect, target){

if(!effect) return

target.status = target.status || {}

if(effect.type === "poison"){
target.status.poison = (target.status.poison || 0) + effect.amount
this.log(target.name + " foi envenenado ("+effect.amount+")")
}

if(effect.type === "burn"){
target.status.burn = effect.amount
this.log(target.name + " foi queimado")

}

if(effect.type === "attackUp"){
target.attack = (target.attack || 0) + effect.amount
}

if(effect.type === "attackDown"){
target.attack = (target.attack || 0) - effect.amount
}

if(effect.type === "defenseUp"){
target.defense = (target.defense || 0) + effect.amount
}

if(effect.type === "defenseDown"){
target.defense = (target.defense || 0) - effect.amount
}

if(effect.type === "paralyze"){
if(Math.random() < effect.chance){
target.status.paralyze = 1
this.log(target.name + " ficou paralisado")

}
}

}

applyStatus(pokemon){

pokemon.status = pokemon.status || {}

// poison
if(pokemon.status.poison){
pokemon.hp -= pokemon.status.poison
this.log(pokemon.name + " sofre " + pokemon.status.poison + " de poison")
}

// burn
if(pokemon.status.burn){
pokemon.hp -= pokemon.status.burn
pokemon.status.burn--

if(pokemon.status.burn <= 0){
delete pokemon.status.burn
this.log(pokemon.name + " sofre " + pokemon.status.burn + " de burn")
}
}

// paralyze
if(pokemon.status.paralyze){

if(Math.random() < 0.25){
delete pokemon.status.paralyze
return true
}

delete pokemon.status.paralyze
}

return false

}

enemyTurn(){

let skipped = this.applyStatus(this.enemy)

if(skipped) return

this.enemy.energy = 3

let attempts = 0

while(this.enemy.energy > 0 && attempts < 5){

let cardId = this.enemy.deck[Math.floor(Math.random()*this.enemy.deck.length)]

let card = CARDS[cardId]

if(card && this.enemy.energy >= card.cost){
this.playCard(this.enemy, card)
}

attempts++

}

}

}