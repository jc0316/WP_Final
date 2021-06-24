import {useState} from 'react'
import './../style.css'
import Black from "../images/black.svg";
import White from "../images/white.svg";
import face from "../images/face.svg";

function User(props){
    const userstyle={
        color :(props.color === props.turn) ? "white" : "#C8C8C8"
    }

    const occupationstyle={
        fontWeight: 600,
        color: props.connected? "black": "red"
    }

    const namestyle={
        fontSize: "30px",
        color: props.connected? "black": "red"
    }

    const computeTimeleft=()=>{
        if (props.timeleft<0) return " 0:00"
        let min=Math.floor(props.timeleft/60000)
        let sec=Math.floor((props.timeleft/1000)%60)
        let ms=Math.floor((props.timeleft/10)%100)
        // console.log(ms)
        if (min<1) return (sec.toString().padStart(2,"0")+'.'+ ms.toString().padStart(2,"0"))
        else return (min.toString().padStart(2," ") +':'+sec.toString().padStart(2,"0"))
    }

    return(
        <div className="User">
            <div className="card-avatar">
                <img className="face" src={face}/>
            </div>
            <div className="card-details">
                <div className="turn" style={userstyle}> It's {props.color===props.turn? "your" : "opponent's"} turn!</div>
                <div className="name" style={namestyle}>{props.player}</div>
                <div className="occupation" style={occupationstyle}>Name{props.connected?"":"(disconnect)"}</div>
                
                <div className="card-about">
                    <div className="item">
                        <div className="value">
                            {props.color==='b'?
                                (<img className="piece" src={Black}/>):(<img className="piece" src={White}/>)}
                        </div>
                    </div>
                    <div className="item">
                        <span className="value">{computeTimeleft()}</span>
                        <span className="label">Time left</span>
                    </div>
                    <div className="item">
                        <span className="value">{props.pieces}</span>
                        <span className="label">Pieces</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User