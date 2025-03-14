import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import cartReducer from "./cart";
import introReducer from "./intro";
import langReducer from './lang';
import themeReducer from './theme';
import listReducer from './list';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        lang: langReducer,
        intro: introReducer,
        theme: themeReducer,
        list: listReducer,
    }
});