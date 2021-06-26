import { useState, useEffect } from 'react'
import Result from '../components/result'
import Board from '../components/board' 
import User from '../components/user'
import QuitButtons from '../components/QuitButtons'
import './maingame.css'



function MainGame(props){
    const [player, lefttime, turn, opponent, board, gameResult, gameState, handle_1x1_click] = props.gameHooks
    const [pressResign, pressLogout, pressRestart] = props.gameButtons

    const [modalVisible, setModalVisible] = useState(false)

    const [pieces, setPieces] =useState([2, 2])

    console.log("gr", gameResult)

    return( 
        <div className="game">
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <div className="left">
                <div className="quit">
                    {gameState==="playing" ? <QuitButtons pressResign={pressResign}></QuitButtons> : <p></p>}
                </div>
                <User 
                    color={player[1]}
                    player={player[0]}
                    pieces={player[1] === 'b'?pieces[0]:pieces[1]}
                    timeleft={lefttime[player[1]=='w'?0:1]}
                    connected={player[2]}
                    turn={turn}/>
                <div className="vs">
                    <div className="vs-text" data-text="VERSUS">VERSUS</div>
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
            <QuitModal
                visible={false}
                onConfirm={() => {
                    setModalVisible(false)
                }}
                onCancel={() => {
                    setModalVisible(false)
                }}
            >
            </QuitModal>
    )*/
}

export default MainGame