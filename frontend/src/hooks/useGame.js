import {useEffect, useState} from 'react'

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

const useBoard=()=>{
    const [time,setTime]=useState([0,6000,6000]) //settime wlefttime blefttime
    const [lefttime,setLefttime]=useState([6000,6000])
    const [board, setBoard]=useState(initboard)
    const [turn, setTurn]=useState('e') 
    const [player, setPlayer]=useState(['null','e',true]) 
    const [opponent, setOppanent]=useState(['null', 'e',true])
    const [status, setStatus] = useState('signin')
    const [gameresult, setResult] = useState(['',''])
    const [msg,setMsg]=useState({content:""})

    const pressSignIn = ()=>{
        setStatus('matching')
    }

    const pressSignUp = ()=>{
        setStatus('signup')
    }

    const pressBackToSignIn = ()=>{
        setStatus('signin')
    }

    const pressRegister = ()=>{
        setStatus('signin')
    }

    const pressCancel = ()=>{
        setStatus('signin')
    }

    return [status, pressSignIn, pressSignUp, pressBackToSignIn, pressRegister, pressCancel]
}
export default useBoard;