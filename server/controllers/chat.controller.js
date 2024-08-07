import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

// Send a message
export const sendMessage = async (req, res, io) => {
    try {
        const { conversationId, sender, receiver, text } = req.body;

        let conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            conversation = new Conversation({
                participants: [sender, receiver],
            });
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender,
            receiver,
            text,
        });

        const savedMessage = await newMessage.save();

        conversation.lastMessageDate = newMessage.date;
        await conversation.save();

        const populatedMessage = await savedMessage.populate([
            { path: "sender", select: "username profilePicture" },
            { path: "receiver", select: "username profilePicture" },
        ]);

        io.to(conversation._id.toString()).emit(
            "new-message",
            populatedMessage
        );

        res.status(200).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET CONVERSATION MESSAGES

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).populate([
            { path: "sender", select: "username profilePicture" },
            { path: "receiver", select: "username profilePicture" },
        ]);

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET CONVERSATIONS

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId,
        }).populate([
            { path: "participants", select: "username profilePicture" },
        ]);

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getConversationObject = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = await Conversation.findById(
            conversationId
        ).populate([
            { path: "participants", select: "username profilePicture" },
        ]);
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create or fetch conversation
export const createOrFetchConversation = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { receiverId } = req.body;

        // Try to find an existing conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
            });
            await conversation.save();
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
