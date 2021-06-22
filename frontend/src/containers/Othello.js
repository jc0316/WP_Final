import { useState, useEffect } from 'react'
import Matching from "./Matching"
import MainGame from "./MainGame"
//-------------------------------------------------------
// This file is no longer used
//-------------------------------------------------------

function Othello({me, setSigningIn}){
  const [matching, setMatching] = useState(true)


  return (
  <div className="Othello">
    {matching ? <Matching setMatching={setMatching} setSigningIn={setSigningIn}/> : <MainGame/>}
  </div>
  )
}

export default Othello