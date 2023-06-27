const { Schema, model } = require('mongoose')

const contributionSchema = new Schema({
    ID: {
        type: Number,
        required: true
    },
    contracts: {
        type: [{
            identifier: String,
            startTime: Number,
            numPE: Number,
            collectedPE: Boolean,
            achievedAllGoals: Boolean
        }]
    }
})

module.exports = model('contribution', contributionSchema, 'contributions');