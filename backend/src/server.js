require('dotenv').config()
import Name from "./models/name"

const api = require('./api')
const client = require('./client')

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieParserIO = require('cookie-parser-io');
const mongoose = require('mongoose')
const path = require('path');
var cors = require('cors')
const http = require('http');
const WebSocket = require('ws');

var app = express()
// var app = connect.createServer().use(connect.static(__dirname + '/public'))
const io = require('socket.io')(server,{
  cors: {
    origin: "http://localhost:3000",//frontend
    methods: ["GET", "POST"]
  }
})

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
  const names = await Name.find({})
});
  
const server = http.createServer(app);
const wss = new WebSocket.Server({
  server,
});
app.use(express.static(path.join(__dirname, '..', 'public')));

wss.on('connection', function connection(client){
  console.log('wss connected')
})

server.listen(4000, () => {
  console.log('Server listening at http://localhost:4000');
});




// db.once('open', async() => {
//     console.log('MongoDB connected!')
//     // await Name.deleteMany({},()=>{/*console.log('clear names')*/})
//     //await Match.deleteMany({},()=>{/*console.log('clear names')*/})//delete all matches before
//     io.use(cookieParserIO('mv5qhue8ik2c6071gxaz'));
    
//     io.use(async (socket,next)=>{
//       let email = api.cookie2email().get(socket.request.signedCookies.connect_four)
//       if(!email){
//         err="wrong connection!!"
//         console.log(err)
//         next(new Error(err))
//         return 
//       }
//       err =await client.getemail(io,socket,{email:email})  //目前線上登入名單valid?
//       if(err){
//         console.log(err)
//         next(new Error(err))
//       }
//       else{
//         next()
//       }
//     })
   
//     // io.on("connection",(socket)=>{
//     //   client.init(io,socket)
//     //   socket.on('disconnect',()=>{
//     //     client.disconnectmatch(io,socket)
//     //     client.removename(socket)
//     //   })
//     //   socket.on('place',(payload)=>{
//     //     client.place(io,socket,payload)
//     //   })
//     //   socket.on('resigned',()=>{
//     //     client.resigned(io,socket)
//     //   })
//     //   socket.on('checktime',()=>{
//     //     client.checktime(io,socket)
//     //   })
//     // })
    
//     // setInterval(()=>{
//     //   // console.log("start")
//     //   matching.matchall(io)
//     //   // console.log("end")
//     // },1000)
  
//     app.use(cors({
//       origin : "http://localhost:3000",
//       credentials: true,
//     })) 
//     app.use(cookieParser('mv5qhue8ik2c6071gxaz'));
//     app.use(bodyParser.json())
//     app.use(function(req, res, next) {
//       res.header("Access-Control-Allow-Origin", "*");
//       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//       res.header("Access-Control-Allow-Credentials", true);
//       next();
//     });
//     app.post('/api/register', (req, res) => {
//         api.register(req,res)
//     })
//     app.get('/api/logout', (req, res) => {
//       api.logout(req,res)
//     })
//     app.post('/api/login', (req, res) => {
//       api.login(req,res)
//     })
//     app.get('/api/checklogin', (req, res) => {
//       api.checklogin(req,res)
//     })
    
    
//     // app.get('/', (req, res) => {
//     //   // res.sendFile(path.join(__dirname,".." ,'public', 'index.html'));;
//     //   res.sendFile(path.join(__dirname,".." ,"..",'frontend','build', 'index.html'));;
      
//     // });
//     // app.use(express.static(path.join(__dirname,".." ,"..",'frontend','build')));
//     app.use(express.static(path.join(__dirname, 'public')));

    
//     const PORT = process.env.port || 4000
//      server.listen(PORT, () => {
//        console.log(`Listening on http://localhost:${PORT}`)
//      })
     
//   })
  
