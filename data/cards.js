const CARDS = {

thunderShock:{
name:"Thunder Shock",
element:"electric",
cost:1,
damage:6,
effect:{
type:"paralyze",
}
},

quickAttack:{
name:"Quick Attack",
cost:1,
damage:7
},

tailWhip:{
name:"Tail Whip",
cost:1,
effect:{
type:"defenseDown",
amount:2
},
target:"enemy"
},

thunderbolt:{
name:"Thunderbolt",
element:"electric",
cost:2,
damage:14
},

ember:{
name:"Ember",
element:"fire",
cost:1,
damage:6,
effect:{
type:"burn",
amount:2
}
},

scratch:{
name:"Scratch",
cost:1,
damage:6
},

growl:{
name:"Growl",
cost:1,
effect:{
type:"attackDown",
amount:2
},
target:"enemy"
},

flameCharge:{
name:"Flame Charge",
element:"fire",
cost:2,
damage:8,
effect:{
type:"burn",
amount:2
},
target:"self"
},

waterGun:{
name:"Water Gun",
element:"water",
cost:1,
damage:6
},

tackle:{
name:"Tackle",
cost:1,
damage:7
},

bubble:{
name:"Bubble",
element:"water",
cost:1,
damage:5,
effect:{
type:"attackDown",
amount:1
}
},

withdraw:{
name:"Withdraw",
cost:1,
effect:{
type:"defenseUp",
amount:3
},
target:"self"
},

vineWhip:{
name:"Vine Whip",
element:"grass",
cost:1,
damage:7
},

poisonPowder:{
name:"Poison Powder",
element:"poison",
cost:1,
effect:{
type:"poison",
amount:3
}
},

leechSeed:{
name:"Leech Seed",
element:"grass",
cost:2,
effect:{
type:"poison",
amount:1
}
},

iceShard:{
name:"Ice Shard",
element:"water",
cost:1,
damage:5,
effect:{
type:"freeze"
}
},

iceBeam:{
name:"Ice Beam",
element:"water",
cost:2,
damage:7,
effect:{
type:"freeze",
chance:0.3
}
}

}