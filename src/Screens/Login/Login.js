import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView, Platform, TouchableOpacity } from 'react-native';
import Images from "../../Assets/Images";
import { Button } from "../../Components/Button";
import { HeaderDrawing } from "../../Components/HeaderDrawing";
import { Icon } from "../../Components/Icon";
import { Image } from "../../Components/Image";
import { Input } from "../../Components/Input";
import { Text } from "../../Components/Text";
import colors from "../../Utils/colors";
import { scale, scaledWidth, scaledHeight } from "../../Utils/responsiveUtils";
import { Formik } from 'formik';
import * as yup from 'yup';
import Navigation from "../../Utils/Navigation";
import { loginApi } from "../../Utils/api";
import { API_ENDPOINT } from "../../configs";
import { setUserFn } from "../../Redux/auth";
import { authProcedure } from "../../App";
import defaultStyles from "../../Utils/defaultStyles";
import WarningModal from "../../Components/WarningModal";
import { Header } from "../../Components/Header";
// import { GoogleSignin } from 'react-native-google-signin';

// GoogleSignin.configure({
//     webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
//     });

// async function signIn() {
//     try {
//         // Check if the user has Google Play Services installed on their device
//         await GoogleSignin.hasPlayServices();

//         // Start the Google Sign-In flow
//         const userInfo = await GoogleSignin.signIn();

//         // Log the user info to the console
//         console.log('User info:', userInfo);

//         // You can use the user info to authenticate the user and perform other actions.

//     } catch (error) {
//         console.log('Google sign-in failed:', error);
//     }
// }

export const Login = (props) => {
    const { t, i18n } = useTranslation();
    const [country, setCountry] = useState({ countryCode: 'EG', cca2: '20', flag: 'flag-ly' });

    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);

    let submit = (values) => {
        console.log("VALUES:::: ", values);
        setLoading(true);
        loginApi({ ...values, countryCode: `${country.cca2}`, type: "CLIENT" }).then(res => {
            console.log("RESPONSE::: ", res);
            if (res && res.ok) {
                setUserFn(res.data, remember);
                Navigation.showOverlay(t('loginSuccess'));
                authProcedure(i18n.language === 'ar' ? true : false);
            }
            else {
                Navigation.showOverlay(res.data.errors, 'fail');
            }
            setLoading(false);
        }).catch(error => {
            setLoading(false);
            Navigation.showOverlay(t('error'), 'fail');
            console.log("ERROR:::: ", error);
        })
    }


    let validationSchema = yup.object({
        phone: yup.string().matches(/^[0-9]+$/, `${t('phone')} ${t('invalid')}`).required(`${t('phone')} ${t('required')}`),
        password: yup.string().required(`${t('password')} ${t('required1')}`),
    });

    return (
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <ScrollView style={{ flex: 1, backgroundColor: colors.grayBackgroung }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} >
               
                <Image source={Images.backgrounfGif} resizeMode={"cover"} style={{ position: "absolute", width: scaledWidth(100), height: scaledHeight(50), left: 0, right: 0, top: -2 }} />
            <Header back />

                <View style={{ alignContent: "center", alignSelf: "center", alignItems: "center", marginTop: scaledHeight(5) }}>
                    <Image source={Images.logo} noLoad equalSize={scale(30)} />
                    <Image source={Images.logoTabActive} noLoad equalSize={scale(25)} style={{ height: scaledHeight(7) }} />
                    <Text color={colors.highlight} bold style={{ marginTop: scaledHeight(2), marginBottom: scaledHeight(2) }}>{t('Login')}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.Whitebackground }}>

                    <Formik initialValues={{ phone: '', password: '' }} validationSchema={validationSchema} onSubmit={(values) => {
                        submit(values);
                    }}>
                        {props => (
                            <>
                                <Input {...props} name="phone" containerStyle={{ marginHorizontal: scale(20), color: colors.Whitebackground, marginBottom: scale(20) }}
                                    style={{ paddingBottom: scale(2) }} placeholder={t('userphone')} inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.grayBackgroung }}
                                    icon={<Image source={Images.mobileIcon} equalSize={5} />} keyboardType="number-pad" onBlur={props.handleBlur('phone')}
                                    onChangeText={props.handleChange('phone')} error={props.touched.phone && props.errors.phone} />

                                <Input {...props} name="password" containerStyle={{ marginHorizontal: scale(20), color: colors.Whitebackground }} placeholder={t("userpass")} onBlur={props.handleBlur('password')}
                                    style={{ paddingBottom: scale(2) }} keyboardType="password" onChangeText={props.handleChange('password')} error={props.touched.password && props.errors.password}
                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.grayBackgroung }} />

                                <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: scale(20), marginTop: scale(15), marginBottom: 0 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button backgroundColor={remember ? colors.goldbackground : "white"} circle={5} style={{ paddingVertical: 0, borderWidth: remember ? 0 : 4.5, borderColor: colors.highlight }}
                                            onPress={() => {
                                                setRemember(!remember)
                                            }}>
                                            {remember && <View style={{ width: scaledWidth(2.6), height: scaledWidth(2.6), borderRadius: scaledWidth(2.6) / 2, backgroundColor: colors.highlight }} />}
                                        </Button>
                                        <Text size={6.5} style={{ marginHorizontal: scale(5) }}>{t('rememberMe')}</Text>
                                    </View>

                                </View>
                                <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(70), marginBottom: scale(5) }}>

                                    <Button title={t('Enter')} size={7.5} elevation={3} style={{
                                        alignSelf: 'stretch',
                                    }} bold radius={28} color="white"
                                        backgroundColor={colors.MainBlue}
                                        onPress={props.handleSubmit} loading={loading} />
                                </View>
                                <Button title={t('forgotYourPass')} size={6.5} color="#1E1E1E" onPress={() => {
                                    Navigation.push({
                                        name: 'ForgetPassword', options: {
                                            statusBar: {
                                                backgroundColor: colors.animationColor,
                                                style: 'light'
                                            }
                                        }
                                    });
                                }} />
                            </>
                        )}
                    </Formik>

                    {Platform.OS === 'ios' ? null : <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', marginHorizontal: scale(40), marginTop: scale(15) }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ alignSelf: 'stretch', borderBottomWidth: 1, borderColor: colors.inputBorder }} />
                        </View>
                        <Text size={6} style={{ marginHorizontal: scale(20) }} color={colors.MainGray}>{t('or')}</Text>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ alignSelf: 'stretch', borderBottomWidth: 1, borderColor: colors.inputBorder }} />
                        </View>
                    </View >}

                    {Platform.OS === 'ios' ? null : <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', marginHorizontal: scale(20), marginTop: scale(15), marginBottom: scale(10) }}>
                        <View style={{ justifyContent: "space-around", flexDirection: 'row', width: scaledWidth(90), paddingHorizontal: Platform.OS === 'ios' ? scale(40) : scale(70) }}>
                            {Platform.OS === 'ios' ? <Button borderRadius={10} elevation={1} backgroundColor={colors.grayBackgroung}
                                style={{ alignSelf: 'center', ...defaultStyles.elevationGame(0.1) }} onPress={() => {
                                    setServiceModalVisible(true);
                                }}>
                                <Image source={Images.appleIcon} noLoad equalSize={6} style={{ margin: scale(15) }} />

                            </Button> : null}

                            <Button borderRadius={10} elevation={1} backgroundColor={colors.grayBackgroung}
                                style={{ alignSelf: 'center', ...defaultStyles.elevationGame(0.1) }} onPress={() => {
                                    setServiceModalVisible(true);
                                }}>
                                <Image source={Images.facebookIcon2} noLoad equalSize={6} style={{ margin: scale(15) }} />


                            </Button>

                            <Button borderRadius={10} elevation={1} backgroundColor={colors.grayBackgroung}
                                style={{ alignSelf: 'center', ...defaultStyles.elevationGame(0.1) }} onPress={() => {
                                    setServiceModalVisible(true);
                                    // signIn();
                                }}>
                                <Image source={Images.googleIcon} noLoad equalSize={6} style={{ margin: scale(15) }} />

                            </Button>
                        </View>

                    </View>}

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: scale(10) }}>
                        <Text size={6.5} style={{ marginHorizontal: scale(5) }} semiBold color={colors.MainGray}>{t('DHAccount')}</Text>
                        <Button title={t('NewEnter')} size={6.5} color={colors.highlight} onPress={() => {
                            Navigation.push({
                                name: 'SignUp', options: {
                                    statusBar: {
                                        backgroundColor: colors.animationColor
                                        ,
                                        style: 'light'
                                    }
                                }
                            });
                        }} />
                    </View>

                    {/* <View style={{ alignSelf: 'stretch', justifyContent: 'center', marginTop: scale(20), marginHorizontal: scale(20), flexDirection: 'row' }}>
                    <Text size={7} color={colors.textTriary}>{t('noAccount')}</Text>
                    <Button color="#AB0311" bold title={t('signup')} style={{ marginHorizontal: scale(3), paddingVertical: 0 }} onPress={() => {

                    }} />
                </View> */}
                    <WarningModal visible={serviceModalVisible} dismiss={() => {
                        setServiceModalVisible(false);
                    }} />
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}