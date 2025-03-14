import { createAction, createSlice } from "@reduxjs/toolkit";
import { store } from "./store";

const listReducer = createSlice({
    name: 'list',
    initialState: {
        orderList: false,
        notifList: false,
        chatList: false,
        chatItem: false,
        rateList: false,
    },
    reducers: {
        refresh: (state, action) => {
            state[action.payload] = !state[action.payload];
        },
    }
});

export const { refresh } = listReducer.actions;
export default listReducer.reducer;