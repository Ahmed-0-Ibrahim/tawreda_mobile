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
import { SignUpApi, sendCode } from "../../Utils/api";
import { API_ENDPOINT } from "../../configs";
import { setUserFn } from "../../Redux/auth";
import { authProcedure } from "../../App";
import defaultStyles from "../../Utils/defaultStyles";
import WarningModal from "../../Components/WarningModal";
import { Header } from "../../Components/Header";

export const SignUp = (props) => {
    const { t, i18n } = useTranslation();
    const [country, setCountry] = useState({ countryCode: 'EG', cca2: '20', flag: 'flag-ly' });

    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [phoneActive, setPhoneActive] = useState(false);

    let submit = (values) => {
        setLoading(true)
        SignUpApi({ ...values, countryCode: `${country.cca2}`, countryKey: `${country.countryCode}` }).then(res => {
            console.log("RESPONSE::: ", res);
            if (res && res.ok) {
                Navigation.showOverlay(t('RegisterSucess'));
                Navigation.push(
                    {
                        name: "Login", options: {
                            statusBar: {
                                backgroundColor: colors.animationColor
                            }
                        }
                    })
                setLoading(false)
            }
            else {
                console.log("aaaaaaaaaaaaaasssssssssdddddddd",res)
                Navigation.showOverlay(t(res.data.errors), 'fail');
                setLoading(false)
            }
        }).catch(error => {
            setLoading(false);
            Navigation.showOverlay(t('error'), 'fail');
            console.log("ERROR:::: ", error);
        })
    }

    let SendCodeToPhone = (phone) => {
        return sendCode({ phone: phone, countryCode: "20", })
    }

    let validationSchema = yup.object({
        name: yup.string().required(`${t('username')} ${t('required')}`),
        email: yup.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, `${t('useremail')} ${t('invalid')}`).required(`${t('useremail')} ${t('required')}`),
        phone: yup.string().matches(/^[0-9]+$/, `${t('phone')} ${t('invalid')}`).required(`${t('phone')} ${t('required')}`),
        password: yup.string().required(`${t('password')} ${t('required1')}`),
    });

    return (
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <ScrollView style={{ flex: 1, backgroundColor: colors.grayBackgroung }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} >
                <Image source={Images.backgrounfGif} resizeMode={"cover"} style={{ position: "absolute", width: scaledWidth(100), height: scaledHeight(55), left: 0, right: 0, top: -2 }} />
                <Header backToHome />
                <View style={{ alignContent: "center", alignSelf: "center", alignItems: "center" }}>
                    <Image source={Images.logo} noLoad equalSize={scale(30)} />
                    <Image source={Images.logoTabActive} noLoad equalSize={scale(35)} style={{ height: scaledHeight(7) }} />
                    <Text color={colors.highlight} bold style={{ marginTop: scaledHeight(2), marginBottom: scaledHeight(2) }}>{t('NewRegister')}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.Whitebackground }}>

                    <Formik initialValues={{ name: '', email: '', phone: '', password: '' }} validationSchema={validationSchema} onSubmit={(values) => {
                        console.log("VAAAAAAAAAALue", values);
                        submit(values);

                    }}>
                        {props => (
                            <>

                                <Input {...props} name="name" placeholder={t('username')} icon={<Image source={Images.userIcon} equalSize={5.5} />}
                                    onBlur={props.handleBlur('name')} onChangeText={props.handleChange('name')} error={props.touched.name && props.errors.name}
                                    containerStyle={{ marginHorizontal: scale(20), marginBottom: scale(20), color: colors.Whitebackground }} style={{ paddingTop: 0, paddingBottom: 0 }}
                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.grayBackgroung }} />

                                <Input {...props} name="email" keyboardType="email-address" placeholder={t('useremail')} icon={<Image source={Images.messageIcon} equalSize={5} />}
                                    onBlur={props.handleBlur('email')} onChangeText={props.handleChange('email')} error={props.touched.email && props.errors.email}
                                    containerStyle={{ marginHorizontal: scale(20), marginBottom: scale(20), color: colors.Whitebackground }} style={{ paddingTop: 0, paddingBottom: 0 }}
                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.grayBackgroung }} />

                                <Input active    {...props} name="phone" containerStyle={{ marginHorizontal: scale(20), color: colors.grayBackgroung, marginBottom: scale(20) }}
                                    style={{ paddingBottom: scale(2) }} placeholder={t('userphone')} inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.grayBackgroung }}
                                    icon={<Button title={phoneActive ? t('Activated') : t('Active')} size={5} color={phoneActive ? colors.highlight : colors.grayBackgroung} style={{ backgroundColor: phoneActive ? colors.goldbackground : colors.highlight, paddingHorizontal: scaledWidth(4) }}
                                        onPress={() => {

                                            //phoneActive ? setPhoneActive(false) : setPhoneActive(true);
                                            // props.handleSubmit;

                                            SendCodeToPhone(props.values.phone).then(() => {
                                                Navigation.push({
                                                    name: 'ActivePhone', options: {
                                                        statusBar: {
                                                            backgroundColor: colors.animationColor
                                                        }
                                                    }, passProps: {
                                                        settrure: setPhoneActive, mobile: props.values.phone, onValidate: () => {
                                                            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa update done", props.values)
                                                            submit(props.values)
                                                        }
                                                    }
                                                });
                                            }).catch(error => {
                                                Navigation.showOverlay(error, 'fail');
                                            })
                                        }} />} keyboardType="number-pad" onBlur={props.handleBlur('phone')}
                                    onChangeText={props.handleChange('phone')} error={props.touched.phone && props.errors.phone} />

                                <Input {...props} name="password" containerStyle={{ marginBottom: scale(20), marginHorizontal: scale(20), color: colors.Whitebackground }} placeholder={t("password")} onBlur={props.handleBlur('password')}
                                    style={{ paddingBottom: scale(2) }} keyboardType="password" onChangeText={props.handleChange('password')} error={props.touched.password && props.errors.password}
                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.grayBackgroung }} />

                                <Input {...props} name="password" containerStyle={{ marginHorizontal: scale(20), color: colors.Whitebackground }} placeholder={t("confirmPassword")} onBlur={props.handleBlur('password')}
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
                                        <Text size={6.5} style={{ marginHorizontal: scale(5) }}>{t('Readed')}</Text>
                                        <Button title={t('terms')} size={6.5} color={colors.highlight} onPress={() => {
                                            Navigation.push({
                                                name: 'Terms', options: {
                                                    statusBar: {
                                                        backgroundColor: colors.grayBackgroung
                                                        ,
                                                        style: 'light'
                                                    }
                                                }
                                            });
                                        }} />
                                    </View>

                                </View>
                                <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(70), marginBottom: scale(5) }}>

                                    <Button title={t('register')} size={7.5} elevation={3} style={{
                                        alignSelf: 'stretch',

                                    }} bold radius={28} color="white"
                                        backgroundColor={colors.MainBlue}
                                        onPress={props.handleSubmit} loading={loading} />
                                </View>

                            </>
                        )}
                    </Formik>




                    <WarningModal visible={serviceModalVisible} dismiss={() => {
                        setServiceModalVisible(false);
                    }} />
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}