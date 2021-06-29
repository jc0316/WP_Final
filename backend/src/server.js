require('dotenv').config()
const Name     = require('./models/name')
const Game     = require("./models/game")
const matching = require("./matching")
const board    = require("./board")
const express = require('express');
const mongoose = require('mongoose')
const path = require('path');

const http = require('http');
const WebSocket = require('ws')

var app = express()

const db = mongoose.connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
  })
db.on('error', (error) => {
  console.error(error)
})
db.once('open', async function () {
  console.log('Mongo database connected!');
});
  
/* -------------------------------------------------------------------------- */
/*                                  UTILITIES                                 */
/* -------------------------------------------------------------------------- */
const check=(name,password)=>{
  if(!name){
      return 'name invalid'
  }
  //if(!/^[a-z0-9A-Z]*$/i.test(name)){
  //    return "name should only contain English and number!"
  //}
  if(!password){
       return 'password invalid'
  }
  if(password.length<6){
      return 'password should >= 6'
  }
  if(password.length>12){
      return 'password tshould <= 12'
  }
  
   return null
}
const start_match = async (client, clients)=>{
  await Game.deleteMany({}, (err)=>console.log(err))
  client.sendEvent([
    'WAITING',
    {client, clients}
  ])
  if(clients.length == 2){
    matching(clients[0], clients[1])
  }
}
/* -------------------------------------------------------------------------- */
/*                            SERVER INITIALIZATION                           */
/* -------------------------------------------------------------------------- */
const server = http.createServer(app);
const wss = new WebSocket.Server({
  server,
});
var clients=[]
app.use(cors()) 
app.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, "..", "..", 'frontend', 'build', 'index.html'));
});
app.use(express.static(path.join(__dirname, "..", "..", 'frontend', 'build')));


wss.on('connection', function connection(client){
  console.log('wss connected')
  client.sendEvent = function (e) {client.send(JSON.stringify(e));}

  client.on('message', async function incoming(m){
    m = JSON.parse(m);
    const [type, data] = m
    console.log(type)
    console.log(data)

    switch (type){
      case 'SIGN_UP': {
        const { fullName, email, password } = data
        console.log({fullName})
        let err=check(fullName, password)
        if(err){
          await client.sendEvent([
            'ERROR',
            err
          ])
        }
        else{
          const user = await Name.findOne({email})
          if(!user){
            await Name.create({name:fullName, email, password, history:{ win: 0, lost: 0, tie: 0 }})
            await client.sendEvent([
              'SIGN_UP',
              'User created'
            ])
            console.log("user created")
          }
          else{
            await client.sendEvent([
              'ERROR',
              'User already exists!!'
            ])
            console.log("user already exist")
          }
        }
        break
      }
      case 'CANCEL':{
        const name = data
        const found = clients.findIndex(element => element.username===name);
        clients.splice(found,1)
        break
      }
      case "SIGN_IN": {
        const { email, password } = data
        const user = await Name.findOne({email, password})
        if(!user){
          await client.sendEvent([
            'ERROR',
            'User does not exist!!'
          ])
        }
        else{
          if(password === user.password){
            console.log("login success!")
            client.status = 'matching'
            client.username = user.name
            client.email = user.email
            client.history = user.history
            clients.push(client)
            await client.sendEvent([
              'SIGN_IN',
              [user.name, user.email, user.history]
            ])
            console.log(client)
            start_match(client, clients)
            
          }
          else{
            await client.sendEvent([
              'ERROR',
              'Wrong password!!'
            ])
          }
        }
        break
      }

      case "PLACE": {
        const { col, row, username } = data
        let game = await Game.findOne({})
        const something = board.place(col, row, game, username)
        // console.log(something)
        // if (game === new_game)
        if (something === 'Not your turn!'){
          await client.sendEvent([
            'ERROR',
            something
          ])
        }
        else if (something === 'This line is full!'){
          await client.sendEvent([
            'ERROR',
            something
          ])
        }
        else if (something[0] === 'end'){
          const [ mes, game, winner ] = something
          if(winner === 'w') {
            await Name.updateOne({email: game.players.white.email}, { $inc: { "history.win": 1 }})
            await Name.updateOne({email: game.players.black.email}, { $inc: { "history.lost": 1 }})
          }
          else if(winner === 'b') {
              await Name.updateOne({email: game.players.black.email}, { $inc: { "history.win": 1 }})
              await Name.updateOne({email: game.players.white.email}, { $inc: { "history.lost": 1 }})
          }
          else {
            await Name.updateOne({email: game.players.black.email}, { $inc: { "history.tie": 1 }})
            await Name.updateOne({email: game.players.white.email}, { $inc: { "history.tie": 1 }})
          }
          clients.forEach(async (client)=>{
            await client.sendEvent([
              'END',
              [game, winner]
            ])
          })
          clients=[]
        }
        else {
          clients.forEach(async (client)=>{
            await client.sendEvent([
              'PLACE',
              something
            ])
          })
          await Game.updateOne({}, game)
        }
        break
      }
      case "LOGOUT":{
        const player = data
        var s = clients
        console.log(clients)
        console.log("---------------------------------------")
        clients=s.filter(element => element.username !== player)
        console.log(clients)
        
        
        break
      }
      case "NEWGAME":{
        const player = data
        var s = clients
        clients=s.filter(element => element.username !== player)
        console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ")
        console.log(clients)
        const user = await Name.findOne({name:player})
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        console.log(user)
        await client.sendEvent([
          'NEWGAME',
          user
        ])
        break
      }
      case "RESIGN":{
        const player = data
        let winner = 'w'
        let game = await Game.findOne({})
        if(player[1] === 'b') {
          await Name.updateOne({email: game.players.white.email}, { $inc: { "history.win": 1 }})
          await Name.updateOne({email: game.players.black.email}, { $inc: { "history.lost": 1 }})
        }
        else  {
            winner = 'b'
            await Name.updateOne({email: game.players.black.email}, { $inc: { "history.win": 1 }})
            await Name.updateOne({email: game.players.white.email}, { $inc: { "history.lost": 1 }})
        }
        
        clients.forEach(async (client)=>{
          if (client.username !== player[0]){
            await client.sendEvent([
              'END',
              [game, winner]
            ])
          }
          
        })
        clients=[]
      }

    }
  })
})

server.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
