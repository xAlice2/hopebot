const { Schema, model } = require('mongoose')

const kevIDSchema = new Schema({
    id: Number,
    kevID: [String],
    withAliases: [{
        kevID: String,
        aliases: [String]
    }]
})

module.exports = model('contractOverview', kevIDSchema, 'contracts');