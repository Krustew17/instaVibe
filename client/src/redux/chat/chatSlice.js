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
    },
});

export const {
    setConversations,
    setCurrentConversation,
    setMessages,
    addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
