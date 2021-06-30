import { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import './matching.css'


function Matching(props){
    return(
    <div className="matching-body">
        <div>
          <h2 className="matching-h2" data-text="Matchmaking...">Matchmaking...</h2>
        </div>
        <Button variant="contained" color="primary" onClick={props.pressCancel}>Cancel</Button>
    </div>
    )
}

export default Matching