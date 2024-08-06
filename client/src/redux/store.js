import { configureStore } from "@reduxjs/toolkit";
import authReducer, { rehydrate } from "./auth/authSlice";
import notificationsReducer from "./notifications/notifSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        notifications: notificationsReducer,
    },
});

const authState = JSON.parse(localStorage.getItem("authState"));
if (authState) {
    store.dispatch(rehydrate(authState));
}

export default store;
