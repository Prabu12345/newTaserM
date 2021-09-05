const mongoose = require('mongoose');

const rqString = {
    type: String,
    required: true
}

const rqInt = {
    type: Number,
    required: true
}

const rqArry = {
    type: Array,
    require: true
}

const guildSchema = new mongoose.Schema(
    {
        id: rqString,
        name: rqString,
        queue: rqArry,
        volume: rqInt,
        maxVolume: rqInt,
        prefix: rqString
    },
    {
        timestamps: true,
    }
)

const name = 'guildSchema'

module.exports = mongoose.model[name] || mongoose.model(name, guildSchema, name)