class Deck{

constructor(cards){

this.drawPile = [...cards]
this.discardPile = []
this.hand = []

this.shuffle()

}

shuffle(){

this.drawPile.sort(()=>Math.random()-0.5)

}

draw(amount){

for(let i=0;i<amount;i++){

if(this.drawPile.length===0){

this.drawPile = this.discardPile
this.discardPile = []
this.shuffle()

}

this.hand.push(this.drawPile.pop())

}

}

discard(card){

this.discardPile.push(card)

}

}