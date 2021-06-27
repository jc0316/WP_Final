require('dotenv').config()
import Name from "./models/name"

const client = require('./client')

const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
var cors = require('cors')
const http = require('http');
const WebSocket = require('ws');

var app = express()

const db = mongoose.connection
mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://chen0716:Alex880716@cluster0.ky9vd.mongodb.net/test?retryWrites=true&w=majority', {
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
  if(!/^[a-z0-9A-Z]*$/i.test(name)){
      return "name should only contain English and number!"
  }
  if(!password){
       return 'password invalid'
  }
  if(password.length<6){
      return 'password should >= 6'
  }
  if(password.length>12){
      return 'password tshould <= 12'
  }
  
   return undefined
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
  clients.push(client)
  client.sendEvent = (e) => client.send(JSON.stringify(e));

  client.on('message', async function incoming(m){
    m = JSON.parse(m);
    const [type, data] = m
    console.log(type)
    console.log(data)
    switch (type){
      case 'SIGN_UP': {
        const { name, email, password } = data
        let err=check(name, password)
        if(err){
          client.sendEvent([
            'ERROR',
            err
          ])
        }
        else{
          const user = await Name.findOne({email})
          if(!user){
            await Name.create({name, email, password})
            console.log("user created")
          }
          else{
            console.log("user already exist")
          }
        }
        break
      }
      case "SIGN_IN": {
        const { email, password } = data
        const user = await Name.findOne({email})
        console.log(user)
        if(!user){
          client.sendEvent([
            'ERROR',
            'User does not exist!!'
          ])
        }
        else{
          if(password === user.password){
            console.log("login success!")
            client.status = 'lobby'
            client.username = user.name
            client.email = user.email
            console.log(clients)
          }
          else{
            client.sendEvent([
              'ERROR',
              'Wrong password!!'
            ])
          }
        }
      }
    }
  })
})

server.listen(4000, () => {
  console.log('Server listening at http://localhost:4000');
});