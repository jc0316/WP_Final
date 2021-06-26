import {useEffect, useState} from 'react'
import axios from 'axios'
import { io } from "socket.io-client"

var socket = null;
let initboard=[
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','b','w','e','e','e'],
    ['e','e','e','w','b','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e']
]

const instance = axios.create({ 
    baseURL: '/api/',
    credentials: true,
})

const useBoard=()=>{
    const [time,setTime]=useState([0,6000,6000]) //settime wlefttime blefttime
    const [lefttime,setLefttime]=useState([6000,6000])
    const [board, setBoard]=useState(initboard)
    const [turn, setTurn]=useState('e') 
    const [player, setPlayer]=useState(['null','e',true]) 
    const [opponent, setOppanent]=useState(['null', 'e',true])
    const [status, setStatus] = useState('ingame')
    const [gameResult, setGameResult] = useState(['',''])
    const [msg,setMsg]=useState({content:""})

    const [gameState, setGameState] = useState('notplaying')

    const pressSignIn = async (args)=>{
        setStatus('matching')
        const email = args.email 
        const password = args.password
        let res = await instance.post('/login',{email:email,password:password})
        if(res.data.status===200){
            const fullName = res.data.name
            pressstart(fullName)
        }
        else{
            setMsg({content:res.data.content})
            //TODO handle error
        }
    }

    const pressSignUp = ()=>{
        setStatus('signup')
    }

    const pressBackToSignIn = ()=>{
        setStatus('signin')
    }

    const pressRegister = async(args)=>{
        setStatus('signin')
        const firstName = args.firstName
        const lastName = args.lastName
        const email = args.email
        const password = args.password

        
        let res = await instance.post('/register',{firstName:firstName,lastName:lastName,password:password,email:email})
        if(res.data.status===200){
            //看是要回登錄畫面還是直接開始遊戲
        }
        else{
            setMsg({content:res.data.content})
            //TODO handle error
        }
    }

    const pressCancel = ()=>{
        setStatus('signin')
    }


    const pressstart=(name)=>{
        if(socket) socket.close()
        socket=io("/",{query:{auth:name}});//transmit {auth:name} to server , get by using socket.handshake.query in io.on()
        //The query parameters cannot be updated for the duration of the session, 
        //so changing the query on the client-side will only be effective 
        //when the current session gets closed and a new one is created
        console.log("start connecting")
        socket.on('connect',()=>{
            console.log("connect to server with name "+socket.io.opts.query.auth)
            setStatus('matching')
        })
        socket.on('connect_error',(err)=>{
            setMsg({content:err.message})
            //handle name exist or name invalid
            setStatus('initial')
        })
        
        // socket.on('match',(match)=>{
        //     // match
        //     // {
        //     //     matchID:just a num,
        //     //     turn:'b'or 'w'or'end',
        //     //     player:{
        //     //         white_player:{
        //     //             name:
        //     //             time:
        //     //             online: T/F
        //     //         },
        //     //         black_player:{
        //     //             name:
        //     //             time:
        //     //             online: T/F
        //     //         }
        //     //     },
        //     //     board:8*8array
        //     // }
        //     // console.log(match.board)
        //     // console.log(match)
        //     let tmpcolor='e'
        //     if(socket.io.opts.query.auth===match.player.white_player.name){
        //         setPlayer(()=>[socket.io.opts.query.auth,'w',match.player.white_player.online]);
        //         setOppanent(()=>[match.player.black_player.name,'b',match.player.black_player.online])
        //         tmpcolor='w'
        //     }else {
        //         setPlayer(()=>[socket.io.opts.query.auth,'b',match.player.black_player.online]);
        //         setOppanent(()=>[match.player.white_player.name,'w',match.player.white_player.online])
        //         tmpcolor='b'
        //     }

        //     setTurn(()=>match.turn)
        //     setTime(()=>[match.time,match.player.white_player.time,match.player.black_player.time])
        //     setBoard(()=>givetips(match.board,tmpcolor,match.turn))
        //     if (match.turn === 'end'){
        //         setStatus('endgame');
        //         console.log("end!!!")
        //         socket.close()
        //         socket=null
        //         setResult(checkwinner(match))
                
        //     }else{
        //         setStatus('start')
        //     }

        //     // setRole(socket.io.opts.query.auth===match.player.white_player.name?'w':'b')
        // })
    }
    const place=(x,y)=>{
        if(turn!==player[1])return
    }
    const handle_1x1_click=(row_index, col_index)=>{
        place(row_index, col_index)
    }

    const pressResign=()=>{

    }

    const pressLogout=()=>{
        
    }

    const pressRestart=()=>{
        
    }

    let gameHooks = [player, lefttime, turn, opponent, board, gameResult, gameState, handle_1x1_click]
    let gameButtons = [pressResign, pressLogout, pressRestart]

    return [status, pressSignIn, pressSignUp, pressBackToSignIn, pressRegister, pressCancel, gameHooks, gameButtons]
}
export default useBoard;