// import { useState } from 'react'
import './../style.css'
import Black from "../images/black.svg";
import White from "../images/white.svg";
import Can from "../images/can2.svg";
import frame from "../images/frame.png";
import red from "../images/red.jpg";
import yellow from "../images/yellow.jpg";
import hint from "../images/hint.jpg";

function Grid1x1(props){
    const renderSwitch=(value)=>{
        console.log(value)
        switch(value){
            case 'w': return (<img className="piece" src={red}/>)
            case 'b': return (<img className="piece" src={yellow}/>)
            case 'c': return (<img className="hint piece" src={Can} />)
            case 'e': return (<img className="piece" src={frame} />)
            default: return (<img/>)

        }
    }
    return (
        <div className="Grid1x1" id={`${props.row_index}_${props.col_index}`}
            onClick={props.handle_1x1_click.bind(this, props.row_index, props.col_index, props.username)}>
            {renderSwitch(props.value)}
        </div>
    )
}

export default Grid1x1