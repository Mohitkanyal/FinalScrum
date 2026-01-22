const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    senderName: String,
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const chat = mongoose.model("chat", chatSchema);
module.exports = chat;