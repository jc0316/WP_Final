import './App.css'
import { useState, useEffect } from 'react'
import SignIn from "./containers/SignIn"
import SignUp from "./containers/SignUp"
import Matching from "./containers/Matching"
import MainGame from "./containers/MainGame"
import useGame from './hooks/useGame'
import WebSocket from 'ws'



const App = () => {
  const [status, pressSignIn, pressSignUp, pressBackToSignIn, pressRegister, pressCancel, gameHooks, gameButtons] = useGame();



  const renderSwitch=(status)=>{
    //console.log("Status :", status)
    switch(status){
      case 'signin': return <SignIn pressSignIn={pressSignIn} pressSignUp={pressSignUp}/>;
      case 'signup' : return <SignUp pressRegister={pressRegister} pressBackToSignIn={pressBackToSignIn}/>;
      case 'matching' : return <Matching pressCancel={pressCancel} status={status}/>;
      case 'ingame' : return <MainGame gameHooks={gameHooks} gameButtons={gameButtons}></MainGame>
      default: return <div>case not handled by switch</div>;
    }
  }

  return (
    <div className="Othello">{renderSwitch(status)}</div>
  )
}

export default App
