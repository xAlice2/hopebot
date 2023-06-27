const { Schema, model } = require('mongoose')

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    channelName: {
        type: String,
        required: true,
    },
    mainChannel: {
        type: String,
        required: true,
    },
    coopRegistrationChannel: {
        type: String,
        required: false,
    },
    gradeChannels: {
        type: { aaa: String, aa: String, a: String, b: String, c: String },
        required: false,
    },
    extraChannels: {
        type: [String],
        required: false,
    },
    leaderIDs: {
        type: [String],
        required: true,
    },
    roleID: {
        type: String,
        required: false,
    },
    notJoined: {
        type: [{userID: String, timestamp: Number}],
        required: false,
    },
    canAddNewLeaders: { //If empty, all initiators can use addleader/removeleader.
        type: [String],
        required: false,
    },
    membersUseSet: {
        type: Boolean,
        required: false,
    },
    ufrPostIDs: {
        type: [String],
        required: false,
    }
})

module.exports = model('group', groupSchema, 'groups');