const { Schema, model } = require('mongoose');
const contributionSchema = require('./contribution')

const userSchema = new Schema({
    group: {
        type: String,
        required: true,
    },
    ID: {
        type: String,
        required: true,
    },
    EID: {
        type: String,
        required: false,
    },
    IGN: {
        type: String,
        required: true,
    },
    discordName: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: false
    },
    farmerRole: {
        type: String,
        required: true,
    },
    EB: {
        type: Number,
        required: true,
    },
    SE: {
        type: Number,
        required: true
    },
    PE: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    statusUntil: {
        type: Number,
        required: false
    },
    willPlay: {
        type: [Number],
        required: false
    }
})

module.exports = model('user', userSchema, 'users');