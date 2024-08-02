import { configureStore } from "@reduxjs/toolkit";
import authReducer, { rehydrate } from "./authSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Load state from local storage and rehydrate the store
const authState = JSON.parse(localStorage.getItem("authState"));
if (authState) {
    store.dispatch(rehydrate(authState));
}

export default store;
