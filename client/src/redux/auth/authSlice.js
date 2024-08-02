import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    token: null,
    user: null,
};

// Function to load state from local storage
const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem("authState");
        if (serializedState === null) {
            return initialState;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return initialState;
    }
};

// Function to save state to local storage
const saveStateToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("authState", serializedState);
    } catch (err) {
        // Ignore write errors.
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState: loadStateFromLocalStorage(),
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            saveStateToLocalStorage(state);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            saveStateToLocalStorage(state);
        },
        rehydrate: (state, action) => {
            return action.payload;
        },
    },
});

export const { login, logout, rehydrate } = authSlice.actions;
export default authSlice.reducer;
