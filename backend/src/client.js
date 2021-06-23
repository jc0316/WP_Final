
//const Match = require('./models/match')
//const matching = require('./matching')
//const board = require('./board')
const emailset=new Set()

exports.getemail=async (io,socket,data)=>{
     if(!data.email){
        return data.email+' email_invalid'
     }
    
    if(emailset.has(data.email)){
        return data.email+" already login!!"
    }
    emailset.add(data.email)
    console.log(data.email+' connected.')
    socket.email=data.email
    return null
}

exports.init=async (io,socket)=>{
    // matchs=await Match.find({},(err)=>{
    //     if(err) throw err
    // })
    // match=matchs.find((match)=>{
    //     return ((match.player.white_player.name===socket.name)||(match.player.black_player.name===socket.name))&&match.turn!=='end'
    // })
    // if(match){
    //     socket.join('matchID:'+match.matchID)
    //     console.log(socket.name+' reconnect to matchID:'+match.matchID.toString())
    //     socket.matchID=match.matchID
    //     match =await  Match.findOne({matchID:socket.matchID})
    //     if(match.player.white_player.name===socket.name){
    //         match.player.white_player.online=true
    //     }
    //     else if(match.player.black_player.name===socket.name){
    //         match.player.black_player.online=true
    //     }
    //     await Match.updateOne({matchID:socket.matchID},match,(err)=>{
    //         if(err)throw err
    //         //send reconnected match data
    //         io.to('matchID:'+socket.matchID).emit('match',match)
    //     })
        
    // }
    // else{
    //     socket.join('lobby')
    //     //start event to creat match
        
    // }
}

