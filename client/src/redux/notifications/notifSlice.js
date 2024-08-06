import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        unreadCount: 0,
    },
    reducers: {
        addNotification(state, action) {
            const newNotification = action.payload;

            const exists = state.notifications.some(
                (notif) => notif._id === newNotification._id
            );
            if (!exists) {
                state.notifications = [newNotification, ...state.notifications];
            }
        },
        markAllAsRead(state) {
            state.unreadCount = 0;
        },
        updateUnreadCount: (state) => {
            state.unreadCount += 1;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
    },
});

export const {
    addNotification,
    markAllAsRead,
    clearNotifications,
    setNotifications,
    updateUnreadCount,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
