import {useState} from 'react'
import "./../style.css"

function Result(props){
    const {player, gameResult, pressLogout, pressrestart} = props

    return (
        <div className="endgame-layout">
            <div className="grid">
                <div className="heading heading--stroke-shadow">
                    {gameResult[0]==='tie'?"DRAW":(gameResult[0]===player[1]?"VICTORY":"DEFEAT")}
                </div>
            </div>
            <div className="endgame-buttons">
              <button className="endgame-newgame" data-text="NEW GAME" onClick={()=>{pressrestart({player:player[0]})}}>
                New game
              </button>
              <button className="endgame-logout" data-text="VERSUS" onClick={()=>{pressLogout({player:player[0]})}}>
                Logout
              </button>
            </div>
        </div>
    )
}

export default Result