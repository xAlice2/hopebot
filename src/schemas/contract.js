const { Schema, model } = require('mongoose')

const contractSchema = new Schema({
    identifier: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    egg: {
        type: Number,
        required: true
    },
    coopAllowed: {
        type: Boolean,
        required: true
    },
    maxCoopSize: {
        type: Number,
        required: true
    },
    expirationTime: {
        type: Number,
        required: true
    },
    lengthSeconds: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    minutesPerToken: {
        type: Number,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    leggacy: {
        type: Boolean,
        required: true
    },
    ccOnly: {
        type: Boolean,
        required: true
    },
    seasonId: {
        type: String,
        required: true
    },
    hasPE: {
        type: Boolean,
        required: true
    },
    gradeSpecs: {
        type: [{
            goals: [{
                goalType: Number,
                targetAmount: Number,
                rewardType: Number,
                rewardSubType: String,
                rewardAmount: Number,
                targetSoulEggs: Number
            }],
            modifiers: [{
                dimension: Number,
                value: Number
            }],
            grade: Number,
            lengthSeconds: Number
        }],
        required: true
    },
    aliases: {
        type: [String],
        required: false
    }
})

module.exports = model('contract', contractSchema, 'contracts');