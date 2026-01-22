// const chat = require("../models/chatModel");

// const getTeamchats = async (req, res) => {
//     try {
//         const { teamId } = req.params;
//         // Fetch last 50 chats, sorted by time
//         const chats = await chat.find({ teamId })
//             .sort({ timestamp: 1 })
//             .limit(50);

//         res.json({
//             success: true,
//             data: chats
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, chat: error.chat });
//     }
// };

// module.exports = { getTeamchats };
const chat = require("../models/chatModel");

const getTeamchatsController = async (req, res) => {
    try {
        const { teamId } = req.params;

        // Fetch chats for this specific team, sorted by time
        const chats = await chat.find({ teamId })
            .sort({ timestamp: 1 }) // 1 = Oldest first, -1 = Newest first
            .limit(100); // Optional: limit to last 100 chats

        res.json({
            success: true,
            data: chats,
            error: false
        });
    } catch (err) {
        res.status(500).json({
            chat: err.chat || err,
            error: true,
            success: false
        });
    }
};

module.exports = { getTeamchatsController };