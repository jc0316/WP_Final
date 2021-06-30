import { useState, useEffect } from 'react'
import Result from '../components/result'
import Board from '../components/board' 
import User from '../components/user'
import QuitButtons from '../components/QuitButtons'
import './maingame.css'



function MainGame(props){
    const [player, timeLeft,timeLeft1, turn, opponent, board, gameResult, gameState, handle_1x1_click] = props.gameHooks
    const [pressResign, pressLogout, pressRestart] = props.gameButtons

    
    //console.log(player, opponent, turn)
    return( 
        <div className="game">
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <div className="left">
                <div className="quit">
                    {gameState==="playing" ? <QuitButtons pressResign={pressResign} player={player}></QuitButtons> : <p></p>}
                </div>
                <User 
                    color={player[1]}
                    player={player[0]}
                    timeleft={ timeLeft}
                    connected={player[2]}
                    turn={turn}
                    history = {player[3]}/>
                <div className="vs">
                    <div className="vs-text" data-text="VERSUS">VERSUS</div>
                </div>
                <User 
                    color={opponent[1]}
                    player={opponent[0]}
                    connected={opponent[2]}
                    timeleft={timeLeft1}
                    turn={turn}
                    history = {opponent[3]}/>
            </div>

            <div className="right">
                {
                gameState==="playing"?
                    <Board 
                        handle_1x1_click={handle_1x1_click}
                        board={board}
                        username={player[0]}/>:
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