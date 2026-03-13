const STATUS_EFFECTS = {

sleep:{
icon:"💤",

apply(target,effect,battle){

target.status = target.status || {}
target.status.sleep = effect.turns || 2

battle.log("💤 "+target.name+" adormeceu","status")

},

turn(target,battle){

target.status.sleep--

battle.log(target.name+" está dormindo","status")

if(target.status.sleep <=0){
delete target.status.sleep
battle.log(target.name+" acordou","status")
}

return true

}
},

poison:{
icon:"🧪",

apply(target,effect,battle){

target.status = target.status || {}
target.status.poison = (target.status.poison || 0) + effect.amount

battle.log("🧪 "+target.name+" foi envenenado","poison")

},

turn(target,battle){

let dmg = target.status.poison

target.hp -= dmg

battle.log(target.name+" sofreu "+dmg+" de poison","poison")

}
},

burn:{
icon:"🔥",

apply(target,effect,battle){

target.status = target.status || {}

let amount = effect.amount || 4

target.status.burn = (target.status.burn || 0) + amount

battle.log("🔥 "+target.name+" foi queimado ("+target.status.burn+")","burn")

},

turn(target,battle){

let burn = target.status.burn

target.hp -= burn

battle.log("🔥 "+target.name+" sofreu "+burn+" de burn","burn")

target.status.burn--

if(target.status.burn <= 0){

delete target.status.burn

battle.log(target.name+" não está mais queimado","burn")

}

}

},

paralyze:{
icon:"⚡",

apply(target,effect,battle){

target.status = target.status || {}
target.status.paralyze = true

battle.log("⚡ "+target.name+" ficou paralisado","status")

},

turn(target,battle){

if(Math.random() < 0.25){

battle.log("⚡ "+target.name+" está paralisado!","status")

return true

}

}
},

freeze:{
icon:"❄",

apply(target,effect,battle){

target.status = target.status || {}
target.status.freeze = true

battle.log("❄ "+target.name+" foi congelado","status")

},

turn(target,battle){

if(Math.random() < 0.20){

delete target.status.freeze
battle.log("❄ "+target.name+" descongelou","status")

return false
}

if(Math.random() < 0.50){

battle.log("❄ "+target.name+" está congelado!","status")
return true
}

}
},

attackUp:{
icon:"⚔",

apply(target,effect,battle){

target.attack = (target.attack || 0) + effect.amount

battle.log("⚔ "+target.name+" ganhou +" + effect.amount + " de ataque","attack")

}
},

attackDown:{
icon:"⚔",

apply(target,effect,battle){

target.attack = (target.attack || 0) - effect.amount

battle.log("⚔ "+target.name+" perdeu " + effect.amount + " de ataque","attack")

}
},

defenseUp:{
icon:"🛡",

apply(target,effect,battle){

target.defense = (target.defense || 0) + effect.amount

battle.log("🛡 "+target.name+" ganhou +" + effect.amount + " de defesa","defense")

}
},

defenseDown:{
icon:"🛡",

apply(target,effect,battle){

target.defense = (target.defense || 0) - effect.amount

battle.log("🛡 "+target.name+" perdeu " + effect.amount + " de defesa","defense")

}
}

}

function applyStatus(pokemon,battle){

if(!pokemon.status) return false

for(let type in pokemon.status){

let handler = STATUS_EFFECTS[type]

if(handler?.turn){

let stop = handler.turn(pokemon,battle)

if(stop) return true

}

}

return false

}

function getStatusIcons(pokemon){

if(!pokemon.status) return ""

let icons=""

for(let type in pokemon.status){

let status = STATUS_EFFECTS[type]

if(status?.icon){

icons += " " + status.icon

if(typeof pokemon.status[type] === "number"){
icons += pokemon.status[type]
}

}

}

return icons

}