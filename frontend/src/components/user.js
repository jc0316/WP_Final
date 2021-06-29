import {useState} from 'react'
import './../style.css'
import Black from "../images/black.svg";
import White from "../images/white.svg";
import face from "../images/face.svg";
import yellowpiece from "../images/yellow-piece.png";
import redpiece from "../images/red-piece.png";

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
        color: props.connected? "white": "red"
    }

    //Todo : Add player stats
    console.log(props.history)
    const stats = props.history // Won/Lost
    const winPercentage = ((stats[0] + stats[1]+stats[2])!==0)?(stats[0] / (stats[0] + stats[1]+stats[2]))*100:0

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
            <div className="card-left">
                <div className="card-avatar">
                    <img className="face" src={face}/>
                </div>
                <div className="card-stats">
                    W: {stats[0]}/ L: {stats[1]}/ T: {stats[2]}
                </div>
                <div className="card-stats">
                    WIN RATE : {Math.floor(winPercentage)}%
                </div>
            </div>
            <div className="card-right">
                <div className="turn" style={userstyle}> It's {props.color===props.turn? "your" : "opponent's"} turn!</div>
                <div className="card-name" style={namestyle}>{props.player}</div>
                
                <div className="card-details">
                    <div className="card-details piece">
                        {props.color==='b'? (<img className="card-details piece" src={yellowpiece}/>):(<img className="card-details piece" src={redpiece}/>)}
                    </div>
                    <div className="card-details data">
                        <div className="item">
                            <span className="value">{computeTimeleft()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User