const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NameSchema = Schema({
    name: { type: String, required: true ,unique:true},
    password:{ type: String, required: true },
    history:{ win : { type: Number} , lost : { type: Number}},
    email:{ type: String, required: true },
}, {
    collection: 'Name',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const exportSchema = mongoose.model('Name', NameSchema)

module.exports = exportSchema
