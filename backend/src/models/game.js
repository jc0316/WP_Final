const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GameSchema = Schema({
    time: { type: Number, required: true},
    turn:{
        type: String,
        enum:["b","w","end"]
    },
    players:{
        type: Object,
        properties:{
            white:{
                type: Object,
                properties:{
                    name:{type: String},
                    email:{type: String},
                    time:{type: Number}
                },
            },
            black:{
                type: Object,
                properties:{
                    name:{type: String},
                    email:{type: String},
                    time:{type: Number}
                },
            }
        },
    },
    board: { 
      type: Array,
      item:{
        type: Array, 
        item:{
            type: String,
            enum:["b","w","e"]
        }
      },
      required: true 
    }
 
}, {
    collection: 'Game',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const Game = mongoose.model('Game', GameSchema)

module.exports = Game
