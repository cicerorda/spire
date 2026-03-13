class Battle{

constructor(player, enemy, deck){

this.player = player
this.enemy = enemy
this.deck = deck

this.logs = []

}

log(message,type=""){

this.logs.push({
text:message,
type:type
})

if(this.logs.length > 5){
this.logs.shift()
}

}

startTurn(){

this.applyStatus(this.player)

this.player.energy = 3

this.deck.draw(5)

}

endTurn(){

this.enemyTurn()

}

playCard(user, card){

if(user.energy < card.cost){
    this.log("Energia insuficiente para " + card.name)
    return
}

user.energy -= card.cost

this.log(user.name + " usou " + card.name,"attack")

let enemyTarget = user === this.player ? this.enemy : this.player
let effectTarget = enemyTarget

// buffs sempre no usuário
if(card.effect && card.effect.type.includes("Up")){
effectTarget = user
}

// dano
if(card.damage){

let damage = card.damage

damage += user.attack || 0
damage -= enemyTarget.defense || 0

if(damage < 0) damage = 0

enemyTarget.hp -= damage

if(enemyTarget.hp < 0) enemyTarget.hp = 0

this.log(enemyTarget.name + " sofreu " + damage + " de dano","damage")

}
// efeito
if(card.effect){

const handler = STATUS_EFFECTS[card.effect.type]

if(handler?.apply){
handler.apply(effectTarget, card.effect, this)
}

}

}

applyStatus(pokemon){

return applyStatus(pokemon,this)

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