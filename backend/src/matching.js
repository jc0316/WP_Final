import Game from "./models/game"

const new_board= [
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'b', 'w', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'w', 'b', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e']
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
                time: 2*60*60
            },
            black:{
                name: client2.username,
                email: client2.email,
                time: 2*60*60
            },
        },
        board: new_board,
    }
    console.log(`${client1.username} and ${client2.username} in game now`)
    await Game.create(new_game, (err)=>{
        console.log(err)
    })
    client1.sendEvent([
        'START',
        new_game
    ])
    client2.sendEvent([
        'START',
        new_game
    ])
}

export default matching