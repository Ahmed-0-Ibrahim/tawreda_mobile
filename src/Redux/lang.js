import AsyncStorage from '@react-native-community/async-storage';
import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';
import { DEFAULT_RTL } from '../configs';
import { store } from './store';

const langReducer = createSlice({
    name: 'lang',
    initialState: {
        rtl: DEFAULT_RTL,
    },
    reducers: {
        setLang: (state, action) => {
            state.rtl = action.payload;
        },
    }
});

export const setLangStorage = async (rtl) => {
    await AsyncStorage.setItem('rtl', JSON.stringify(rtl));
    moment.locale('en');
    store.dispatch(setLang(rtl));
}

export const getLang = async () => {
    let finalRtl;
    try {
        let rtl = await AsyncStorage.getItem('rtl');
        if (rtl !== null) {
            finalRtl = JSON.parse(rtl);
        }
        else {
            finalRtl = DEFAULT_RTL;
        }
    }
    catch (error) {
        console.log("ERROR::::: LANGOOOOOOO ", error);
        finalRtl = DEFAULT_RTL;
    }

    store.dispatch(setLang(finalRtl));
    if (finalRtl && !I18nManager.isRTL) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
        RNRestart.Restart();
    }
    else {
        if (!finalRtl && I18nManager.isRTL) {
            I18nManager.allowRTL(false);
            I18nManager.forceRTL(false);
            RNRestart.Restart();
        }
    }
    return finalRtl;
}

export const { setLang } = langReducer.actions;
export default langReducer.reducer;