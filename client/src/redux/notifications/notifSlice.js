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
            // Check if the notification already exists
            const exists = state.notifications.some(
                (notif) => notif._id === newNotification._id
            );
            if (!exists) {
                state.notifications = [newNotification, ...state.notifications];
            }
        },
        markAsRead: (state, action) => {
            state.notifications = state.notifications.map((notification) =>
                notification.id === action.payload.id
                    ? { ...notification, read: true }
                    : notification
            );
            state.unreadCount = state.notifications.filter(
                (n) => !n.read
            ).length;
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
    markAsRead,
    clearNotifications,
    setNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
