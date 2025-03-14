import { createAction, createSlice } from "@reduxjs/toolkit";
import { store } from "./store";

const themeReducer = createSlice({
    name: 'theme',
    initialState: {
        statusBarColor: [],
    },
    reducers: {
        pushStatusBarColor: (state, action) => {
            console.log("THEME::::: ", state.statusBarColor);
            state.statusBarColor = [...state.statusBarColor, action.payload];
        },
        popStatusBarColor: (state, action) => {
            state.statusBarColor = [...action.payload];
            console.log("THEME::::: ", state.statusBarColor);
        },
        clearStatusBarColors: state => {
            state.statusBarColor = [];
        }
    }
});

export const pushStatusBarColorFn = (color) => {
    store.dispatch(pushStatusBarColor(color));
}

export const popStatusBarColorFn = (length = 0) => {
    let _colors = [...store.getState().theme.statusBarColor];
    if (length) {
        _colors.slice(0, length);
    }
    else {
        _colors.pop();
    }
    store.dispatch(popStatusBarColor(_colors));
}

export const clearStatusBarColorsFn = () => {
    store.dispatch(clearStatusBarColors());
}

export const { pushStatusBarColor, popStatusBarColor, clearStatusBarColors } = themeReducer.actions;
export default themeReducer.reducer;