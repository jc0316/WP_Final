// import { useState } from 'react'
import './../style.css'
import Grid1x1 from './Grid1x1'

function Board(props){
    var grids=new Array(7)
    for(var i=0; i<7; i++)
    {
      grids[i]=[]
      for(var j=0; j<6; j++){
        grids[i].push(
          <Grid1x1  
            row_index={j} 
            col_index={i}
            username={props.username}
            handle_1x1_click={props.handle_1x1_click}
            value={props.board[i][j]}
          />
        )
      }
    }
    return (
        <div className="board">
          {grids.map((row)=>{
            return<div className="row">{row}</div>
          })}
        </div>
    )
}

export default Board