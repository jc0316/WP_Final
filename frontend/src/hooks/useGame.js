import {useEffect, useState} from 'react'





var socket = null;
let initboard=[
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e']
]

const server = new WebSocket(window.location.origin.replace(/^http/, 'ws'))

const useBoard=()=>{
    const [time,setTime]=useState(0)
    const [lefttime,setLefttime]=useState(2*60*1000)
    const [board, setBoard]=useState(initboard)
    const [turn, setTurn]=useState('e') 
    const [player, setPlayer]=useState(['null','e',true,[0,0,0]]) 
    const [opponent, setOpponent]=useState(['null', 'e',true,[0,0,0]])
    const [status, setStatus] = useState('signin')
    const [gameResult, setGameResult] = useState(['',''])
    const [msg,setMsg]=useState({content:""})

    const [gameState, setGameState] = useState('playing')
    const prejudge = (col, row)=>{
        if (player[1] !== turn) return null
        else {
            if (board[col][0] !== 'e') return null
            else{
                /* apply gravity */
                let last = 0
                while(board[col][last] === 'e' && last <= 6) last += 1
                board[col][last-1] = turn
                console.log("setting board")
                setBoard(board)
            }
        }
    }
    
    useEffect(()=>{
        server.onmessage = (m) => {
            console.log(server)
            m = m.data
            onEvent(JSON.parse(m));
        };
        server.onopen = () => console.log('Server connected2.');
        server.sendEvent = function(e) {server.send(JSON.stringify(e));}

    })
    // server.wait = function(callback, interval){
    //     console.log(server.readyState)
    //     if (server.readyState === 1) callback()
    //     else {
    //         setTimeout(function () {
    //             server.wait(callback, interval);
    //         }, interval);
    //     }
    // }
    // server.sendEvent = function(e){
    //     server.wait(async function (){
    //         await server.send(JSON.stringify(e))
    //     })
    // }

    
    useEffect(()=>{
        console.log(lefttime)
        console.log(time, Date.now())
        // const timer=setInterval(()=>{
        //     setLefttime(lefttime-(Date.now()-time))
        // },1000)
        // return ()=>clearInterval(timer)
    },[time])

    const pressSignIn = async(args)=>{
        
        const email = args.email 
        const password = args.password
        //let res = await instance.post('/login',{email:email,password:password})
        await server.sendEvent([
            'SIGN_IN',
            {email, password}
        ])
        
        
    }

    const pressSignUp = ()=>{
        setStatus('signup')
    }

    const pressBackToSignIn = ()=>{
        setStatus('signin')
    }

    const pressRegister = async(args)=>{
        
        const firstName = args.firstName
        const lastName = args.lastName
        const email = args.email
        const password = args.password
        const fullName = `${firstName} ${lastName}`
        await server.sendEvent([
            'SIGN_UP',
            { fullName, email, password}
        ])
        
    }

    const pressCancel =async()=>{
        console.log(server)
        await server.sendEvent([
            'CANCEL',
            server.username
        ])
        setStatus('signin')
    }

    const onEvent = async function(e) {
        const [ type, data ] = e;
        console.log(type, data)
        // const errorDOM = document.getElementById('error');
        // const boardDOM = document.getElementById('board')
        // errorDOM.innerHTML = ''
        switch (type) {
            case 'ERROR': {
                alert(data)
                break;
            }
            case 'SIGN_UP': {
                setStatus('signin')
                break;
            }
            case 'SIGN_IN':{
                const [name, email, history] = data
                server.username = name
                server.email = email
                server.history = history
                setStatus('matching')
            }
            case 'WAITING': {
                const { client, clients } = data
                console.log(client)
                console.log(clients)
                break
            }

            case 'START': {
                setStatus('ingame')
                const [new_game,first] = data
                //console.log(new_game)
                if (first === "first" ){
                    setPlayer([new_game.players.white.name,'w',true,[new_game.players.white.history.win,new_game.players.white.history.lost,new_game.players.white.history.tie]])
                    setOpponent([new_game.players.black.name,'b',true,[new_game.players.black.history.win,new_game.players.black.history.lost,new_game.players.black.history.tie]])
                    
                }
                else{
                    setPlayer([new_game.players.black.name,'b',true,[new_game.players.black.history.win,new_game.players.black.history.lost,new_game.players.black.history.tie]])
                    setOpponent([new_game.players.white.name,'w',true,[new_game.players.white.history.win,new_game.players.white.history.lost,new_game.players.white.history.tie]])
                    
                }
                // const timer=setInterval(()=>{
                //     setLefttime(lefttime-(Date.now()-time))
                // },1000)
                // return ()=>clearInterval(timer)
                setTime(Date.now)
                setTurn('w')
                setBoard(new_game.board)

                break
            }
            case 'PLACE': {
                const new_game = data
                console.log(new_game)
                setTurn(new_game.turn)
                setBoard(new_game.board)
                setTime(Date.now())
                setLefttime(2*60*1000)
                break
            }
            case 'END': {
                const [end_game, winner] = data
                console.log(end_game)
                setBoard(end_game.board)
                setGameState("end")
                setGameResult([winner, ''])
                
                break
            }
            case "NEWGAME":{
                setStatus('matching')
                setGameState("playing")
                console.log("server back newgame")
                
                const user = data
                const email = user.email 
                const password = user.password
                console.log(email)
                console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
                console.log(status)
                setStatus('matching')
                await server.sendEvent([
                    'SIGN_IN',
                    {email, password}
                ])
                console.log("send sign in ")
            }
        }
        //resetInputs();
  };



    const place= async(row, col, username)=>{
        console.log(row, col)
        prejudge(col, row)
        await server.sendEvent([
            'PLACE',
            {col, row, username}
        ])
    }
    const handle_1x1_click=(row_index, col_index, username)=>{
        place(row_index, col_index, username)
    }

    const pressResign=async(player)=>{
        setStatus('signin')
        console.log(player)
        console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP")
        await server.sendEvent([
            'RESIGN',
            player
        ])
    }

    const pressLogout= async (args)=>{
        
        const player = args.player

        await server.sendEvent([
            'LOGOUT',
            player
        ])
        setStatus('signin')
        setGameState("playing")
    }

    const pressRestart=async(args)=>{
        const player = args.player
        console.log("send event newgame")
        await server.sendEvent([
            'NEWGAME',
            player
        ])
        console.log("finish send event newgame")
        setStatus('matching')
    }

    let gameHooks = [player, lefttime, turn, opponent, board, gameResult, gameState, handle_1x1_click]
    let gameButtons = [pressResign, pressLogout, pressRestart]

    return [status, pressSignIn, pressSignUp, pressBackToSignIn, pressRegister, pressCancel, gameHooks, gameButtons]
}
export default useBoard;
