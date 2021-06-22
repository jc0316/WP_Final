import './App.css'
import { useState, useEffect } from 'react'
import SignIn from "./containers/SignIn"
import SignUp from "./containers/SignUp"
import Othello from "./containers/Othello"

const App = () => {
  const [signingIn, setSigningIn] = useState(true)
  const [signedIn, setSignedIn] = useState(false)
  const [signingUp, setSigningUp] = useState(false)
  const [me, setMe] = useState("")

  useEffect(() => {
    if(signingIn){
      }
    }, [signingIn])

  return (
    <div>
      {
        signingIn ? (<SignIn me={me} setMe={setMe} setSigningIn={setSigningIn} setSigningUp={setSigningUp}/>) 
        : signingUp ? (<SignUp me={me} setMe={setMe} setSigningIn={setSigningIn} setSigningUp={setSigningUp}/>)
        : (<Othello me={me} setSigningIn={setSigningIn}/>)
      }
    </div>
  )
}

export default App
