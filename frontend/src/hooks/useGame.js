import {useEffect, useState} from 'react'
import useCountDown from 'react-countdown-hook';

const server = new WebSocket(window.location.origin.replace(/^http/, 'ws'))
server.onopen = () => console.log('Server connected2.');
server.sendEvent = function(e) {server.send(JSON.stringify(e));}



const initialTime = 5 * 1000;
const interval = 1000; 

let initboard=[
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e'],
    ['e','e','e','e','e','e']
]


const useBoard=()=>{
    const [timeLeft, actions] = useCountDown(initialTime, interval);
    const [timeLeft1, actions1] = useCountDown(initialTime, interval);
    //const [time,setTime]=useState(0)
    //const [lefttime,setLefttime]=useState(2*60*1000)
    const [board, setBoard]=useState(initboard)
    const [turn, setTurn]=useState('e') 
    const [player, setPlayer]=useState(['null','e',true,[0,0,0]]) 
    const [opponent, setOpponent]=useState(['null', 'e',true,[0,0,0]])
    const [status, setStatus] = useState('signin')
    const [gameResult, setGameResult] = useState(['',''])
    const [msg,setMsg]=useState({content:""})

    const [gameState, setGameState] = useState('playing')
    const prejudge = (col, turn)=>{
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

    server.onmessage = (m) => {
        console.log(server)
        m = m.data
        onEvent(JSON.parse(m));
    };
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
    const timeout = async(player1)=>{
       
        await server.sendEvent([
            'TIMEOUT',
            player1
        ])
    }
    
    useEffect(()=>{
        console.log(timeLeft)
        console.log("IIIIIIIIIIIIIIIIIIIIIII")
        console.log(timeLeft1)
        if(timeLeft===0 && status==='ingame'){
            actions.start(initialTime)
            actions.pause()
            console.log("player1 lose")
            timeout(player)
            
        }
        else if (timeLeft1===0 && status==='ingame'){
            actions1.start(initialTime)
            actions1.pause()
            console.log("player2 lose")
            timeout(opponent)
            
        }
        //console.log(lefttime)
        //console.log(time, Date.now())
        // const timer=setInterval(()=>{
        //     setLefttime(lefttime-(Date.now()-time))
        // },1000)
        // return ()=>clearInterval(timer)
    },)

    const pressSignIn = async(args)=>{
        
        const email = args.email 
        const password = args.password
        //let res = await instance.post('/login',{email:email,password:password})
        server.sendEvent([
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
        server.sendEvent([
            'SIGN_UP',
            { fullName, email, password}
        ])
        
    }

    const pressCancel =async()=>{
        console.log(server)
        server.sendEvent([
            'CANCEL',
            server.username
        ])
        setStatus('signin')
    }

    const onEvent = function(e) {
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
                actions1.start()
                actions1.pause()
                actions.start()
                actions.pause()
                break
            }

            case 'START': {
                setStatus('ingame')
                const [new_game,first] = data
                //console.log(new_game)
                if (first === "first" ){
                    setPlayer([new_game.players.white.name,'w',true,[new_game.players.white.history.win,new_game.players.white.history.lost,new_game.players.white.history.tie]])
                    setOpponent([new_game.players.black.name,'b',true,[new_game.players.black.history.win,new_game.players.black.history.lost,new_game.players.black.history.tie]])
                    actions1.start()
                    actions1.pause()
                    actions.start()
                }
                else{
                    setPlayer([new_game.players.black.name,'b',true,[new_game.players.black.history.win,new_game.players.black.history.lost,new_game.players.black.history.tie]])
                    setOpponent([new_game.players.white.name,'w',true,[new_game.players.white.history.win,new_game.players.white.history.lost,new_game.players.white.history.tie]])
                    actions.start()
                    actions.pause()
                    actions1.start()
                }
                // const timer=setInterval(()=>{
                //     setLefttime(lefttime-(Date.now()-time))
                // },1000)
                // return ()=>clearInterval(timer)
                //setTime(Date.now)
                setTurn('w')
                setBoard(new_game.board)

                break
            }
            case 'PLACE': {
                const new_game = data
                console.log(new_game)
                //console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
                setTurn(new_game.turn)
                setBoard(new_game.board)
                
                
                //setTime(Date.now())
                //console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                //console.log((server.username === new_game.players.black.name && new_game.turn ==='b')
                //||(server.username === new_game.players.white.name && new_game.turn ==='w'))
                if((server.username !== new_game.players.black.name && new_game.turn ==='b')
                ||(server.username !== new_game.players.white.name && new_game.turn ==='w')){
                    actions.start(initialTime)
                    actions.pause()
                    actions1.start(initialTime)
                    
                }
                else{
                    actions1.start(initialTime)
                    actions1.pause()
                    actions.start(initialTime)
                    
                }
                //actions1.resume()
                
                break
            }
            case 'END': {
                const [end_game, winner] = data
                console.log(end_game)
                setBoard(end_game.board)
                setGameState("end")
                setGameResult([winner, ''])
                actions.start(initialTime)
                actions.pause()
                actions1.start(initialTime)
                actions1.pause()
                //actions.reset()
                //actions1.reset()
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
                server.sendEvent([
                    'SIGN_IN',
                    {email, password}
                ])
                console.log("send sign in ")
            }
        }
        //resetInputs();
  };
    

    const place= async(row, col, username, turn)=>{
        console.log(row, col)
        
        prejudge(col, turn)
        //if (server.username===username){
        //    actions1.resume()
        //    actions.resume()
        // }
        // else{
        //    actions.resume()
        //    actions1.resume()
        // }
        server.sendEvent([
            'PLACE',
            {col, row, username}
        ])
    }
    const handle_1x1_click=(row_index, col_index, username, turn)=>{
        
        place(row_index, col_index, username, turn)
        
    }

    const pressResign=async(player)=>{
        setStatus('signin')
        console.log(player)
        console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP")
        server.sendEvent([
            'RESIGN',
            player
        ])
    }

    const pressLogout= async (args)=>{
        
        const player = args.player

        server.sendEvent([
            'LOGOUT',
            player
        ])
        setStatus('signin')
        setGameState("playing")
    }

    const pressRestart=async(args)=>{
        const player = args.player
        console.log("send event newgame")
        server.sendEvent([
            'NEWGAME',
            player
        ])
        console.log("finish send event newgame")
        setStatus('matching')
    }

    let gameHooks = [player, timeLeft,timeLeft1, turn, opponent, board, gameResult, gameState, handle_1x1_click]
    let gameButtons = [pressResign, pressLogout, pressRestart]

    return [status, pressSignIn, pressSignUp, pressBackToSignIn, pressRegister, pressCancel, gameHooks, gameButtons]
}
export default useBoard;