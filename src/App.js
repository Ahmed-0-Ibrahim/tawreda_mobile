import React, { Component, useEffect } from 'react';
import { Navigation as NativeNavigation } from 'react-native-navigation';
import Images from './Assets/Images';
import { registerScreens } from './Screens';
import Navigation from './Utils/Navigation';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './Translations/en.json';
import ar from './Translations/ar.json';
import AsyncStorage from '@react-native-community/async-storage';
import { DEFAULT_RTL } from './configs';
import { store } from './Redux/store';
import { setLang, getLang } from './Redux/lang';
import SplashScreen from 'react-native-splash-screen';
import { getIntro } from './Redux/intro';
import { setLangHeader } from './Utils/api';
import { getUser, setCompanyFn } from './Redux/auth';
import { pushStatusBarColorFn } from './Redux/theme';
import { getCartFromStorage } from './Redux/cart';
import colors from './Utils/colors';

export const authProcedure = (rtl) => {
    // if (!store.getState().auth.token) {
    //     Navigation.setRoot({
    //         name: 'Login', options: {
    //             statusBar: {
    //                 backgroundColor: colors.animationColor,
    //                 style: 'light'
    //             }
    //         }
    //     });
    // }
    // else {
        Navigation.setRootWithBottomTabs([
            { name: 'Home', nameEn: 'Home', nameAr: 'الرئيسية', icon: Images.logoTab },
            { name: 'Orders', nameEn: 'Orders', nameAr: 'الطلبات', icon: Images.logoTab },
            { name: 'Favourit', nameEn: 'My Orders', nameAr: 'المفضلة', icon: Images.orders },
            { name: 'Profile', nameEn: 'Profile', nameAr: 'الملف الشخصي', icon: Images.profile }], rtl);
    // }
}

export const App = async (props) => {
    registerScreens();

    NativeNavigation.events().registerAppLaunchedListener(async () => {
        Navigation.setDefaultOptions({
            topBar: {
                visible: false,
                drawBehind: true,
            },
            modalPresentationStyle: 'overCurrentContext',
            statusBar: {
                style: 'dark',
                backgroundColor: 'white',
            },
            layout: {
                backgroundColor: 'transparent',
                orientation: ['portrait'],
            },
            bottomTabs: {
                visible: false,
                // titleDisplayMode: 'alwaysShow',
            }
        });
        const [rtl, existUser, companyRes, cartItems] = await Promise.all([getLang(), getUser(), setCompanyFn(), getCartFromStorage()]);
        //const [rtl, existUser] = await Promise.all([getLang(), getUser()]);

        console.log("::::::::USER:::::: ", existUser);
        console.log("RTL:::::: ", rtl);
        setLangHeader(rtl ? 'ar' : 'en');

        i18n.use(initReactI18next).init({
            compatibilityJSON: 'v3',
            lng: rtl ? 'ar' : 'en',
            fallbackLng: DEFAULT_RTL ? 'ar' : 'en',
            resources: {
                en: en,
                ar: ar
            }
        });

        if (!store.getState().auth.init) {
            await getIntro();
            if (store.getState().intro.intro && store.getState().intro.intro.length > 0) {
                Navigation.setRoot('Intro');
            }
            else {
                authProcedure(rtl);
            }
            SplashScreen.hide();
        }
        else {
            authProcedure(rtl);
            SplashScreen.hide();
        }
    })
}