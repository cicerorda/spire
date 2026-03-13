class Battle{

constructor(player,enemy){

this.player = player
this.enemy = enemy

}

playCard(card){

if(this.player.energy < card.cost) return

this.player.energy -= card.cost

if(card.damage){
this.enemy.hp -= card.damage
}

if(card.effect){
this.applyEffect(card.effect)
}

}

applyEffect(effect){

if(effect.type === "poison"){

this.enemy.status.poison = (this.enemy.status.poison || 0) + effect.amount

}

if(effect.type === "weak"){

this.enemy.status.weak = effect.amount

}

}

enemyTurn(){

if(this.enemy.status.poison){

this.enemy.hp -= this.enemy.status.poison

}

let damage = this.enemy.damage

if(this.enemy.status.weak){

damage -= this.enemy.status.weak
this.enemy.status.weak--
}

this.player.hp -= damage

}

}