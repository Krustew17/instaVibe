import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        conversations: [],
        currentConversation: null,
        messages: [],
    },
    reducers: {
        setConversations(state, action) {
            state.conversations = action.payload;
        },
        setCurrentConversation(state, action) {
            state.currentConversation = action.payload;
        },
        setMessages(state, action) {
            state.messages = action.payload;
        },
        addMessage(state, action) {
            const newMessage = action.payload;
            if (!state.messages.find((msg) => msg._id === newMessage._id)) {
                state.messages.push(newMessage);
            }
        },
        updateLastMessage(state, action) {
            const { conversationId, message } = action.payload;
            if (state.conversations) {
                state.conversations = state.conversations.map(
                    (conversation) => {
                        if (conversation._id === conversationId) {
                            return {
                                ...conversation,
                                lastMessage: {
                                    ...conversation.lastMessage,
                                    text: message,
                                },
                            };
                        } else {
                            return conversation;
                        }
                    }
                );
            }
        },
    },
});

export const {
    setConversations,
    setCurrentConversation,
    setMessages,
    addMessage,
    updateLastMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
