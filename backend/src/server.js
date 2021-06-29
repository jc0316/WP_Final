require('dotenv').config()
const Name     = require("./models/name")
const Game     = require("./models/game")
const matching = require("./matching")
const board    = require("./board")

const express = require('express');
const mongoose = require('mongoose')
const path = require('path');

const http = require('http');
const WebSocket = require('ws');

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
app.use(express.static(path.join(__dirname, '..', 'public')));


wss.on('connection', function connection(client){
  console.log('wss connected')
  client.sendEvent = (e) => client.send(JSON.stringify(e));

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
          client.sendEvent([
            'ERROR',
            err
          ])
        }
        else{
          const user = await Name.findOne({email})
          if(!user){
            await Name.create({name:fullName, email, password, history:{ win: 0, lost: 0, tie: 0 }})
            client.sendEvent([
              'SIGN_UP',
              'User created'
            ])
            console.log("user created")
          }
          else{
            client.sendEvent([
              'ERROR',
              'User already exists!!'
            ])
            console.log("user already exist")
          }
        }
        break
      }

      case "SIGN_IN": {
        const { email, password } = data
        const user = await Name.findOne({email, password})
        if(!user){
          client.sendEvent([
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
            client.sendEvent([
              'SIGN_IN',
              [user.name, user.email, user.history]
            ])
            console.log(client)
            start_match(client, clients)
            
          }
          else{
            client.sendEvent([
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
          client.sendEvent([
            'ERROR',
            something
          ])
        }
        else if (something === 'This line is full!'){
          client.sendEvent([
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
          clients.forEach((client)=>{
            client.sendEvent([
              'END',
              [game, winner]
            ])
          })
          
        }
        else {
          clients.forEach((client)=>{
            client.sendEvent([
              'PLACE',
              something
            ])
          })
          await Game.updateOne({}, game)
        }
        break
      }

      case 'CANCEL':

    }
  })
})

server.listen(4000, () => {
  console.log('Server listening at http://localhost:4000');
});