import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    token: null,
    user: null,
};

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
        updateUser: (state, action) => {
            state.isAuthenticated = true;
            state.token = state.token;
            state.user = action.payload.updatedUser;
            saveStateToLocalStorage(state);
        },
        rehydrate: (state, action) => {
            return action.payload;
        },
    },
});

export const { login, logout, updateUser, rehydrate } = authSlice.actions;
export default authSlice.reducer;
