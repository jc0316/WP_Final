// import { useState } from 'react'
import './../style.css'
import Black from "../images/black.svg";
import White from "../images/white.svg";
import Can from "../images/can2.svg";

function Grid1x1(props){
    const renderSwitch=(value)=>{
        switch(value){
            case 'w': return (<img className="piece" src={White}/>)
            case 'b': return (<img className="piece" src={Black}/>)
            case 'c': return (<img className="hint piece" src={Can} />)
            default: return (<img/>)

        }
    }
    
    return (
        <div className="Grid1x1" 
            onClick={props.handle_1x1_click.bind(this,props.row_index, props.col_index)}>
            {renderSwitch(props.value)}
        </div>
    )
}

export default Grid1x1

// props.value==='b'? (<img src={Black} width="77.5" height="77.5"/>): (props.value==='w'? (<img src={White} width="77.5" height="77.5"/>):<img/>)