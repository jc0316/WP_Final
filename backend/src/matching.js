const Game = require("./models/game")

const new_board= [
    ['e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e']
]

const matching = async (client1, client2)=>{
    client1.status='ingame'
    client2.status='ingame'
    const new_game={
        time: Date.now(),
        turn: 'w',
        players:{
            white:{
                name: client1.username,
                email: client1.email,
                time: 2*60*60,
                history:client1.history
            },
            black:{
                name: client2.username,
                email: client2.email,
                time: 2*60*60,
                history:client2.history
            },
        },
        board: new_board,
    }
    console.log(`${client1.username} and ${client2.username} in game now`)
    console.log(new_game.players.white.history)
    await Game.create(new_game)
    client1.sendEvent([
        'START',
        [new_game,"first"]
    ])
    client2.sendEvent([
        'START',
        [new_game,"second"]
    ])
    const this_game = Game.find({})[0]
    return this_game
}

export default matching