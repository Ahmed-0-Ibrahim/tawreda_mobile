import AsyncStorage from "@react-native-community/async-storage";
import { createAction, createSlice } from "@reduxjs/toolkit";
import { getCompanyData, setBearerAuth, setNotifToken } from "../Utils/api";
import { store } from "./store";
import messaging from '@react-native-firebase/messaging';
import Navigation from "../Utils/Navigation";
import { clearCart } from "./cart";
import { closeSocket, startSocket } from "../Utils/socket";
import colors from "../Utils/colors";

const authReducer = createSlice({
    name: 'auth',
    initialState: {
        user: {},
        token: null,
        init: false,
        fcmToken: null,
        company: {},
        notifCount: 0,
    },
    reducers: {
        initialized: (state, action = { payload: true }) => {
            state.init = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        updateUser: (state, action) => {
            state.user = action.payload.user;
        },
        setCompany: (state, action) => {
            state.company = action.payload;
        },
        setFcmToken: (state, action) => {
            state.fcmToken = action.payload;
        },
        setNotifCount: (state, action) => {
            state.notifCount = action.payload;
        },
        logout: state => {
            state.user = {};
            state.token = null;
        }
    }
});

export const setUserFn = async (data, remember) => {
    try {
        store.dispatch(setUser({ user: data.user, token: data.token }));
        setBearerAuth(data.token);
        if (remember) {
            await AsyncStorage.setItem('userData', JSON.stringify(data));
        }
        startSocket();
        const fcmToken = await messaging().getToken();
        store.dispatch(setFcmToken(fcmToken));
        if (fcmToken) {
            setNotifToken(fcmToken);
        }
    }
    catch (error) {

    }
}
export const updateUserFn = async (data) => {
    try {
        console.log("dasdadadasdadaaaaaaaaaaaaaaa",data)
        store.dispatch(updateUser({ user: data}));
        let value ={user: data,token:store.getState().auth.token }
        await AsyncStorage.setItem('userData', JSON.stringify(value));
        // if (remember) {
            // }
        // startSocket();
        // const fcmToken = await messaging().getToken();
        // store.dispatch(setFcmToken(fcmToken));
        // if (fcmToken) {
        //     setNotifToken(fcmToken);
        // }
    }
    catch (error) {
        console.log("error",error)
    }
}


export const setCompanyFn = async () => {
    try {
        let response = await getCompanyData();
        console.log("ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",response.data.data)
        if (response && response.ok && response.data) {
            store.dispatch(setCompany(response.data.data));
            console.log("ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhfffmmmmmmmmmmmfffffff",response.data.data)
            console.log("affffffffffffffffffffffffffffffffaff",state.company)
            return true;
        }
        return false;
    }
    catch (error) {
        console.log("ERROR SET COMPNAY ..............")
        return false;
    }
}

export const getUser = async () => {
    try {
        let userData = await AsyncStorage.getItem('userData');
        let init = await AsyncStorage.getItem('initialized');
        store.dispatch(initialized(init ? JSON.parse(init) : false));
        if (userData) {
            // console.log("::::: USER DATA:::: ", JSON.parse(userData));
            store.dispatch(setUser({ user: JSON.parse(userData).user, token: JSON.parse(userData).token }));
            setBearerAuth(JSON.parse(userData).token);
            startSocket();
            const fcmToken = await messaging().getToken();
            // console.log("::::::: FCM TOKEN :::::: ", fcmToken);
            store.dispatch(setFcmToken(fcmToken));
            if (fcmToken) {
                setNotifToken(fcmToken);
            }
            return true;
        }
        console.log("::::::: NOT FOUND ::::::::");
        return false;
    }
    catch (error) {
        console.log("::::::: ERROR IN GET USER:::::: ", error);
        return false;
    }
}

export const logoutFn = async () => {
    try {
        Navigation.push({
            name: 'Profile', options: {
                statusBar: {
                    backgroundColor: colors.animationColor,
                    style: 'light'
                }
            }
        });
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('cart');
        store.dispatch(clearCart());
        closeSocket();
        store.dispatch(logout());
    }
    catch (error) {
    }
}

export const setInitialized = async () => {
    try {
        await AsyncStorage.setItem('initialized', JSON.stringify(true));
        store.dispatch(initialized());
    }
    catch (error) {

    }
}

export const { initialized, setUser, updateUser, setFcmToken, setCompany, setNotifCount, logout } = authReducer.actions;
export default authReducer.reducer;