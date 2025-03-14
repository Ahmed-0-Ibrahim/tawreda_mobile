import { createAction, createSlice } from "@reduxjs/toolkit";
import { getIntroSlider } from "../Utils/api";
import { store } from "./store";

const introReducer = createSlice({
    name: 'intro',
    initialState: {
        intro: null,
    },
    reducers: {
        setIntro: (state, action) => {
            state.intro = action.payload;
        },
    }
});

export const getIntro = async () => {
    try {
        let response = await getIntroSlider();
        if (response && response.ok && response.data) {
            store.dispatch(setIntro(response.data.data));
            return response.data.data;
        }
        return null;
    }
    catch (error) {
        store.dispatch(setIntro(null));
        return null;
    }
}

export const { setIntro } = introReducer.actions;
export default introReducer.reducer;