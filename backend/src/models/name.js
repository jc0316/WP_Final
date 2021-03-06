const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NameSchema = Schema({
    name: { type: String, required: true},
    password:{ type: String, required: true },
    history:{ win : { type: Number }, lost : { type: Number}, tie : { type: Number }},
    email:{ type: String, required: true, unique:true },
}, {
    collection: 'Name',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const Name = mongoose.model('Name', NameSchema)

module.exports = Name
