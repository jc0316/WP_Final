import { useState, useEffect } from 'react'
import Result from '../components/result'
import Board from '../components/board' 
import User from '../components/user'
import './maingame.css'

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

function MainGame(props){
    const [player, lefttime, turn, opponent, board, gameResult, gameState, handle_1x1_click] = props.gameHooks
    const [pressResign, pressLogout, pressRestart] = props.gameButtons

    const [pieces, setPieces] =useState([2, 2])

    return( 
        <div className="game">
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <div className="left">
                <div className="resign">
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<Icon>send</Icon>}
                        onClick={pressResign}
                    >
                        Quit
                    </Button>
                </div>
                <User 
                    color={player[1]}
                    player={player[0]}
                    pieces={player[1] === 'b'?pieces[0]:pieces[1]}
                    timeleft={lefttime[player[1]=='w'?0:1]}
                    connected={player[2]}
                    turn={turn}/>
                <div className="vs">
                    <div className="vs-text" data-text="VS">VS</div>
                </div>
                <User 
                    color={opponent[1]}
                    player={opponent[0]}
                    pieces={opponent[1] === 'b'?pieces[0]:pieces[1]}
                    connected={opponent[2]}
                    timeleft={lefttime[player[1]=='w'?1:0]}
                    turn={turn}/>
            </div>

            <div className="right">
                {
                gameState==="playing"?
                    <Board 
                        handle_1x1_click={handle_1x1_click}
                        board={board}/>:
                    <Result
                        player={player}
                        gameResult={gameResult}
                        pressLogout={pressLogout}
                        pressrestart={pressRestart}
                    />
                }
            </div>
      </div>
    )

    /*return (
        <div>
            <p>test</p>
        </div>
    )*/
}

export default MainGame