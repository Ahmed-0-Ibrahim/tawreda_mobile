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
import { confirmCodeApi, forgetPasswordByEmailApi } from "../../Utils/api";
import colors from "../../Utils/colors";
import Navigation from "../../Utils/Navigation";
import { scale, scaledWidth, scaledHeight } from "../../Utils/responsiveUtils";
import { Header } from "../../Components/Header";

export const ForgetPassword = (props) => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [codeConfirmed, setCodeConfirmed] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState(59);

    let timer = null;

    useEffect(() => {
        return () => clearInterval(timer);
    }, []);

    let validationSchema = yup.object({
        email: yup.string().email(`${t('email')} ${t('invalid')}`).required(`${t('email')} ${t('required')}`),
    });

    let validationSchemaPassword = yup.object({
        password: yup.string().required(`${t('newPassword')} ${t('required1')}`).min(6, `${t('newPassword')} ${t('password_length')} 6 ${t('chars_and_numbers')}`),
        confirmPassword: yup.string().oneOf([password], t('must_match')).required(`${t('confirmPassword')} ${t('required1')}`),
    });

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

    let submitFirstStep = (values) => {
        setLoading(true);
        forgetPasswordByEmailApi({ email: values.email, type: 'CLIENT' }).then(res => {
            setLoading(false);
            setEmail(values.email);
            setTime(59);
            setTimer();
        }).catch(error => {
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    let submitCode = (code) => {
        console.log("CODE:::: ", code);
        if (code.length < 4) {
            Navigation.showOverlay(t('codeNeeded'), 'fail');
            return;
        }
        setLoading(true);
        confirmCodeApi({ email: email, type: 'CLIENT', code: code }).then(res => {
            setLoading(false);
            setCodeConfirmed(true);
            if (timer) {
                clearInterval(timer);
            }
        }).catch(error => {
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    let submitThirdStep = (values) => {
        setLoading(true);
        forgetPasswordByEmailApi({ email: email, type: 'CLIENT', newPassword: values.password }).then(res => {
            setLoading(false);
            Navigation.pop();
            Navigation.showOverlay(t('passwordChanged'));
        }).catch(error => {
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    const firstStep = (
        <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: colors.Whitebackground }}>
            <Formik initialValues={{ email: '' }} validationSchema={validationSchema} onSubmit={(values) => {
                submitFirstStep(values);
            }}>
                {props => (
                    <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', alignContent: "center" }}>
                        <Text size={scale(6)} style={{ alignSelf: "center", alignItems: "center", textAlign: "center", marginHorizontal: scaledWidth(11) }}>{t('enterEmailToSendCode')}</Text>
                        <Input {...props} name="email" keyboardType="email-address" placeholder={t('email')} icon={<Image source={Images.messageIcon} equalSize={5} />}
                            onBlur={props.handleBlur('email')} onChangeText={props.handleChange('email')} error={props.touched.email && props.errors.email}
                            inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.grayBackgroung }}
                            containerStyle={{ marginTop: scale(20), marginHorizontal: scale(20), marginBottom: scale(10), color: colors.Whitebackground, }} />


                        <View style={{ flex: 1, flexGrow: 1, justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(5), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(70), marginBottom: scale(5), }}>
                                <Button title={t('next')} backgroundColor={colors.MainBlue} bold size={7.5} elevation={2} color="white" loading={loading}
                                    style={{ alignSelf: 'stretch', }} radius={28} onPress={props.handleSubmit} />
                            </View>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );

    const secondStep = (
        <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', backgroundColor: colors.grayBackgroung }}>
            <Text color={colors.textPrimary}>{t('enterCode')}</Text>
            <CodeInput style={{ marginHorizontal: scale(30), marginTop: scale(20) }} codeStyle={{ marginHorizontal: scale(10) }} onChange={(code) => {
                setCode(code);
            }} onDone={(code) => {
                submitCode(code);
            }} />

            <Text color={colors.textTriary} style={{ marginTop: scale(20) }} size={6}>{renderTimer()}</Text>
            {time === 0 ? <Button onPress={() => {
                submitFirstStep({ email: email })
            }}>
                <Text color={colors.highlight} size={6} style={{ textDecorationLine: 'underline' }}>{t('resend')}</Text>
            </Button> : null}


            <View style={{ flex: 1, flexGrow: 1, justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center' }}>
                <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(5), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(70), marginBottom: scale(5), }}>
                    <Button title={t('next')} backgroundColor={colors.MainBlue} bold size={7.5} elevation={2} color="white" loading={loading}
                        style={{ alignSelf: 'stretch', }} radius={28} onPress={() => {
                            submitCode(code);
                        }} />
                </View>
            </View>
        </View>
    );

    const thirdStep = (
        <View style={{ flex: 1, flexGrow: 1, alignSelf: 'stretch' }}>
            <Formik initialValues={{ password: '', confirmPassword: '' }} validationSchema={validationSchemaPassword} onSubmit={(values) => {
                submitThirdStep(values);
            }}>
                {props => (
                    <View style={{ flex: 1, flexGrow: 1, alignSelf: 'stretch', alignItems: 'center' }}>
                        <Text color={colors.textPrimary}>{t('enterNewPassword')}</Text>
                        <Input {...props} name="password" title={t('newPassword')} keyboardType="password" placeholder={"*************"}
                            onBlur={props.handleBlur('password')} onChangeText={(text) => {
                                props.handleChange('password')(text);
                                setPassword(text);
                            }} error={props.touched.password && props.errors.password} containerStyle={{ marginTop: scale(20), marginHorizontal: scale(20) }} />

                        <Input {...props} name="confirmPassword" title={t('confirmPassword')} keyboardType="password" placeholder={"*************"}
                            onBlur={props.handleBlur('confirmPassword')} onChangeText={props.handleChange('confirmPassword')}
                            error={props.touched.confirmPassword && props.errors.confirmPassword} containerStyle={{ marginTop: scale(20), marginHorizontal: scale(20), marginBottom: scale(10) }} />

                        <View style={{ flex: 1, flexGrow: 1, justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center' }}>
                            <Button title={t('save')} bold size={7.5} elevation={2} linear color="white" loading={loading}
                                style={{ alignSelf: 'stretch', marginHorizontal: scale(20), paddingVertical: scale(15), marginBottom: scale(15) }} radius={28} onPress={props.handleSubmit} />
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );

    return (
        <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: colors.Whitebackground }} onPress={Keyboard.dismiss}>
            <ScrollView style={{ flex: 1, backgroundColor: colors.Whitebackground }} contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.Whitebackground }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>

                <View style={{ backgroundColor: colors.grayBackgroung }}>
                    <Image source={Images.backgrounfGif} resizeMode={"cover"} style={{ position: "absolute", width: scaledWidth(100), height: scaledHeight(55), left: 0, right: 0, top: -2 }} />
                    <Header back />
                    <Image source={Images.cloud} noLoad equalSize={scale(45)} style={{ alignSelf: "center", paddingTop: 0, paddingBottom: 0, marginTop: scaledHeight(1) }} />
                    <Text color={colors.highlight} size={8.5} bold style={{ alignSelf: "center", margin: scale(10) }}>{t('forgotYourPass')}</Text>
                    {email && codeConfirmed ? thirdStep : email ? secondStep : firstStep}
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}