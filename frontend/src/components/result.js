import {useState} from 'react'
import "./../style.css"

function Result(props){
    const {gameresult,player}=props
    return (
        <div className="endgame">
            <div className="grid">
                <div className="heading heading--stroke-shadow">
                    {gameresult[0]==='e'?"Dual OuO":(gameresult[0]===player[1]?"You winnnnn :>":"You lose... QQ")}
                </div>
            </div>
            <div class="btn" onClick={props.pressrestart}>
              <span>New game</span>
              <svg width="13px" height="10px" viewBox="0 0 13 10">
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </div>
            <div class="btn" onClick={props.pressLogout}>
              <span>Log out</span>
              <svg width="13px" height="10px" viewBox="0 0 13 10">
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </div>
            
        </div>
    )
}

export default Result