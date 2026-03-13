class MapGenerator{

generate(){

let floors = 6
let nodesPerFloor = 3
let nodes = []
let id = 0

for(let f=0; f<floors; f++){

for(let n=0; n<nodesPerFloor; n++){

nodes.push({
id:id++,
floor:f,
type:this.randomRoom(f),
connections:[]
})

}

}

for(let node of nodes){

let nextFloor = nodes.filter(n=>n.floor === node.floor+1)

if(nextFloor.length){

let connections = Math.ceil(Math.random()*2)

for(let i=0;i<connections;i++){

let target = nextFloor[Math.floor(Math.random()*nextFloor.length)]

if(!node.connections.includes(target.id)){
node.connections.push(target.id)
}

}

}

}

return nodes

}

randomRoom(floor){

if(floor === 5) return "boss"

let rooms = [
"battle",
"battle",
"battle",
"event",
"rest",
"shop"
]

return rooms[Math.floor(Math.random()*rooms.length)]

}

}