import { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import './matching.css'


function Matching({setMatching, setSigningIn}){
    return(
    <div className="matching-body">
        <div>
          <h2 data-text="Matchmaking...">Matchmaking...</h2>
        </div>
        <Button variant="contained" color="primary" onClick={() => {
          setMatching(false)
          setSigningIn(true)
        }}>Cancel</Button>
    </div>
    )
}

export default Matching