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


const useBoard=()=>{
    const [time,setTime]=useState([0,6000,6000]) //settime wlefttime blefttime
    const [lefttime,setLefttime]=useState([6000,6000])
    const [board, setBoard]=useState(initboard)
    const [turn, setTurn]=useState('e') 
    const [player, setPlayer]=useState(['null','e',true,[0,0,0]]) 
    const [opponent, setOpponent]=useState(['null', 'e',true,[0,0,0]])
    const [status, setStatus] = useState('signin')
    const [gameResult, setGameResult] = useState(['',''])
    const [msg,setMsg]=useState({content:""})

    const [gameState, setGameState] = useState('playing')

    const server = new WebSocket('ws://localhost:4000')
    server.onopen = () => console.log('Server connected2.');
    server.onmessage = (m) => {
        console.log(server)
        m = m.data
        onEvent(JSON.parse(m));
    };
    server.sendEvent = (e) => server.send(JSON.stringify(e));


    const pressSignIn = async (args)=>{
        
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

    const pressCancel = ()=>{
        setStatus('signin')
    }

    
    const pressstart=(name)=>{
        if(server) server.close()
        console.log("start connecting")
        server.onopen = () => {
            console.log('WebSocket Client Connected');
            setStatus('matching')
          };
        

        server.on('connect_error',(err)=>{
            setMsg({content:err.message})
            //handle name exist or name invalid
            setStatus('initial')
        })
        
        
    }


    const onEvent = (e) => {
        const [ type, data ]= e;
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
                setTurn('w')
                setLefttime([new_game.players.white.time,new_game.players.black.time])
                console.log(new_game.board)
                setBoard(new_game.board)

                break
                
                
                
                //boardDOM.innerHTML = ''
                // new_game.board.forEach((array, col)=>{
                //     let div = document.createElement("div")
                //     boardDOM.appendChild(div)
                //     array.forEach((element, row)=>{
                //         let button = document.createElement("button")
                //         button.innerHTML = element
                //         button.id = String(col)+"_"+String(row)
                //         button.onclick = function() {place(button.id)}
                //         div.appendChild(button)
                //     })
                // })
            }
            case 'PLACE': {
                const new_game = data
                console.log(new_game)
                setBoard(new_game.board)
                break
                // boardDOM.innerHTML = ''
                // new_game.board.forEach((array, col)=>{
                //     let div = document.createElement("div")
                //     boardDOM.appendChild(div)
                //     array.forEach((element, row)=>{
                //         let button = document.createElement("button")
                //         button.innerHTML = element
                //         button.id = String(col)+"_"+String(row)
                //         button.onclick = function() {place(button.id)}
                //         div.appendChild(button)
                //     })
                // })
            }
            case 'END': {
                const [end_game, winner] = data
                console.log(end_game)
                setBoard(end_game.board)
                setGameState("end")
                setGameResult([winner, ''])
                break
                // boardDOM.innerHTML = ''
                // end_game.board.forEach((array, col)=>{
                //     let div = document.createElement("div")
                //     boardDOM.appendChild(div)
                //     array.forEach((element, row)=>{
                //         let button = document.createElement("button")
                //         button.innerHTML = element
                //         button.id = String(col)+"_"+String(row)
                //         button.onclick = function() {place(button.id)}
                //         div.appendChild(button)
                //     })
                // })
                // errorDOM.innerHTML = `${winner} side wins!`
            }
        }
        //resetInputs();
  };



    const place=(row, col, username)=>{
        console.log(row, col)
        server.sendEvent([
            'PLACE',
            {col, row, username}
        ])
    }
    const handle_1x1_click=(row_index, col_index, username)=>{
        place(row_index, col_index, username)
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