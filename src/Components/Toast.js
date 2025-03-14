import React, { useEffect, useState } from "react";
import { Text } from "./Text";
import { View, TouchableOpacity, Animated, I18nManager } from 'react-native';
import Navigation from "../Utils/Navigation";
import { scale, scaledHeight } from "../Utils/responsiveUtils";
import { Button } from "./Button";
import colors from '../Utils/colors';
import defaultStyles from "../Utils/defaultStyles";
import { useSelector } from "react-redux";


export const Toast = (props) => {
    const rtl = useSelector(state => state.lang.rtl);
    const [valY] = useState(new Animated.Value(scaledHeight(6)));
    const [message, setMessage] = useState('');

    useEffect(() => {
        parseMessage();
        let timeout = null;
        Animated.timing(valY, {
            duration: 500,
            toValue: 0,
            useNativeDriver: true
        }).start(() => {
            timeout = setTimeout(() => {
                hideToast();
            }, 2500);
        });

        return () => clearTimeout(timeout);
    }, []);

    let parseMessage = () => {
        if (props.message && props.message.errors && Array.isArray(props.message.errors)) {
            setMessage(props.message.errors[0].msg);
        }
        else if (Array.isArray(props.message)) {
            setMessage(props.message[0].msg);
        }
        else if (typeof props.message === 'string') {
            setMessage(props.message);
        }
        else if (typeof props.message === 'object') {
            setMessage(props.message.errors || props.message.error || (I18nManager.isRTL ? 'خطأ في الاتصال' : 'Connection error'));
        }
        else {
            setMessage(I18nManager.isRTL ? 'خطأ في الاتصال' : 'Connection error');
        }
    }

    let hideToast = () => {
        Animated.timing(valY, {
            duration: 500,
            toValue: scaledHeight(6),
            useNativeDriver: true
        }).start(() => Navigation.hideOverlay())
    }

    return (
        <TouchableOpacity style={{ flex: 1, flexDirection: 'column-reverse', backgroundColor: 'transparent' }} activeOpacity={1} onPress={() => {
            hideToast();
        }}> 
            <Animated.View style={{
                height: scaledHeight(6), justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', transform: [{ translateY: valY }], zIndex: 501,
                alignSelf: 'stretch', paddingHorizontal: scale(10), backgroundColor: props.type === 'fail' ? colors.failure : props.type === 'info' ? colors.info : colors.success
            }}>
                <Text color={props.type === 'fail' ? defaultStyles.toastFailure : props.type === 'info' ? defaultStyles.toastInfo : defaultStyles.toastSuccess}
                    size={6} semiBold>{message}</Text>
                <Button title={rtl ? "حسناً" : "Ok"} color={props.type === 'fail' ? defaultStyles.toastFailure : props.type === 'info' ? defaultStyles.toastInfo : defaultStyles.toastSuccess}
                    size={6} onPress={() => {
                        hideToast();
                    }} />
            </Animated.View>
        </TouchableOpacity>
    );
}