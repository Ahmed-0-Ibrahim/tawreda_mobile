import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import * as yup from 'yup';
import Images from "../../Assets/Images";
import { Button } from "../../Components/Button";
import { CodeInput } from "../../Components/CodeInput";
import { HeaderDrawing } from "../../Components/HeaderDrawing";
import { Image } from "../../Components/Image";
import { Input } from "../../Components/Input";
import { Text } from "../../Components/Text";
import { confirmChangeApi,sendCode } from "../../Utils/api";
import colors from "../../Utils/colors";
import Navigation from "../../Utils/Navigation";
import { scale, scaledWidth, scaledHeight } from "../../Utils/responsiveUtils";
import { Header } from "../../Components/Header";

export const ActivePhone = (props) => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [codeConfirmed, setCodeConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState(59);

    let timer = null;

    useEffect(() => {
        setTimer();

        return () => clearInterval(timer);
    }, []);

   
    const setTimer = () => {
        if (timer) {
            return;
        }
        timer = setInterval(() => {
            setTime(prev => {
                // console.log("TIMER:::: ", prev);
                if (prev <= 0) {
                    // console.log("TIMER ENDED:::: ");
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            })
        }, 1000);
    }

    const renderTimer = () => {
        return `00:${time > 9 ? time : `0${time}`}`;
    }

    let SendCodeToPhone = (phone) => {
        return sendCode({ phone: phone, countryCode:"20", })
    }
    let submitCode = (code) => {
        console.log("CODE:::: ", code);
        if (code.length < 4) {
            Navigation.showOverlay(t('codeNeeded'), 'fail');
            return;
        }
        setLoading(true);
        confirmChangeApi({ phone: props.mobile, countryCode:"20", code: code }).then(res => {
            console.log("coddddddd",res)
            setLoading(false);
            setCodeConfirmed(true);
            props.onValidate();
            props.settrure(true)
            Navigation.pop();
            if (timer) {
                clearInterval(timer);
            }
        }).catch(error => {
            console.log("rrrrrrrrrrrrrrrrrrrrrrrrrwwwwww",error)
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }
    return (
        <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: colors.grayBackgroung }} onPress={Keyboard.dismiss}>
                <ScrollView style={{ flex: 1, backgroundColor: colors.grayBackgroung }} contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.grayBackgroung }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>

                    <Image source={Images.backgrounfGif} resizeMode={"cover"} style={{ position: "absolute", width: scaledWidth(100), height: scaledHeight(55), left: 0, right: 0, top: -2 }} />
                    <Header back />
                    <Image source={Images.active} noLoad equalSize={scale(40)} style={{ alignSelf: "center", paddingTop: 0, paddingBottom: 0, }} />
                    <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', backgroundColor: colors.grayBackgroung }}>

                    <Text color={colors.highlight} bold style={{ alignSelf: "center" ,marginVertical:scaledHeight(2)}}>{t('activePhone')}</Text>
                        <Text color={colors.textPrimary}>{t('enterPhoneCode')}</Text>
                        <CodeInput style={{ marginHorizontal: scale(30), marginTop: scale(20) }} codeStyle={{ marginHorizontal: scale(10) }} onChange={(code) => {
                            setCode(code);
                        }} onDone={(code) => {
                            submitCode(code);
                        }} />

                        <Text color={colors.textTriary} style={{ marginTop: scale(20) }} size={6}>{renderTimer()}</Text>
                        {time === 0 ? <Button onPress={() => {
                            // submitFirstStep({ phone: phone })
                            SendCodeToPhone(props.mobile);
                            setTime(59);
                            setTimer();
                        }}>
                            <Text color={colors.highlight} size={7} style={{ textDecorationLine: 'underline' }}>{t('resend')}</Text>
                        </Button> : null}


                        <View style={{ flex: 1, flexGrow: 1, justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(5), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(70), marginBottom: scale(5), }}>
                                <Button title={t('save')} backgroundColor={colors.MainBlue} bold size={7.5} elevation={2} color="white" loading={loading}
                                    style={{ alignSelf: 'stretch', }} radius={28} onPress={() => {
                                        submitCode(code);
                                    }} />
                            </View>
                        </View>
                    </View>
                </ScrollView>

        </TouchableWithoutFeedback>
    );
}