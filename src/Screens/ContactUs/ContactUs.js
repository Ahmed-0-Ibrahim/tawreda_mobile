import React, { useState } from "react";
import { View, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Input } from "../../Components/Input";
import { Header } from "../../Components/Header";
import { Icon } from "../../Components/Icon";
import { Text } from "../../Components/Text";
import { Image } from "../../Components/Image";
import Images from "../../Assets/Images";
import { useTranslation } from "react-i18next";
import { Formik } from 'formik';
import * as yup from 'yup';
import { scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import colors from "../../Utils/colors";
import { Button } from "../../Components/Button";
import { contactUsApi } from "../../Utils/api";
import Navigation from "../../Utils/Navigation";
import { useSelector } from "react-redux";
import defaultStyles from "../../Utils/defaultStyles";

export const ContactUs = (props) => {
    const { user } = useSelector(state => state.auth);
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState({ countryCode: user.countryKey, cca2: user.countryCode.split('+')[1] });

    let validationSchema = yup.object({
        name: yup.string().required(`${t('name')} ${t('required')}`),
        phone: yup.string().matches(/^[0-9]+$/, `${t('phone')} ${t('invalid')}`).required(`${t('phone')} ${t('required')}`),
        email: yup.string().email(`${t('email')} ${t('invalid')}`).required(`${t('email')} ${t('required')}`),
        notes: yup.string().required(`${t('notes')} ${t('required1')}`),
    });

    let submit = (values) => {
        setLoading(true);
        console.log("COUNTRY:::: ", country);
        let _values = { ...values, countryKey: country.countryCode, countryCode: `${country.cca2}` };
        console.log("COUNTRY:::: ", _values);
        contactUsApi(_values).then(res => {
            console.log("RES::: ", res);
            setLoading(false);
            Navigation.showOverlay(t('sentOpinionSuccessfully'));
            setTimeout(() => {
                Navigation.pop();
            }, 250);
        }).catch(error => {
            console.log("ERROR::: ", error);
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    return (
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: colors.grayBackgroung }}>
                <Header title={t('contactUs')} back />
                <ScrollView style={{ alignSelf: 'stretch', flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
                    <Image source={Images.logo} width={40} height={18} style={{ alignSelf: 'center', marginTop: scale(6), }} />
                    <Image source={Images.logoTabActive} width={40} height={10} style={{ alignSelf: 'center', justifyContent: "flex-start", alignItems: "flex-start", }} />

                    <Formik initialValues={{ name: t('username'), email: t('useremail'), phone: t('userphone'), notes: t('usernotes') }}
                        validationSchema={validationSchema} onSubmit={(values) => {
                            submit(values);
                        }}>
                        {props => (
                            <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center' }}>

                                <Input {...props} name="name" placeholder={t('username')} icon={<Image source={Images.userIcon} equalSize={5.5} />}
                                    onBlur={props.handleBlur('name')} onChangeText={props.handleChange('name')} error={props.touched.name && props.errors.name}
                                    containerStyle={{ marginHorizontal: scale(20), marginBottom: scale(20), color: colors.Whitebackground }} style={{ paddingTop: 0, paddingBottom: 0 }}
                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }} />

                                <Input {...props} name="email" keyboardType="email-address" placeholder={t('useremail')} icon={<Image source={Images.messageIcon} equalSize={5} />}
                                    onBlur={props.handleBlur('email')} onChangeText={props.handleChange('email')} error={props.touched.email && props.errors.email}
                                    containerStyle={{ marginHorizontal: scale(20), marginBottom: scale(20), color: colors.Whitebackground }} style={{ paddingTop: 0, paddingBottom: 0 }}
                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }} />

                                <Input {...props} name="phone" containerStyle={{ marginHorizontal: scale(20), color: colors.Whitebackground }} placeholder={t("userphone")}
                                    icon={<Image source={Images.mobileIcon} equalSize={5} />} keyboardType="number-pad" onBlur={props.handleBlur('phone')}
                                    style={{ paddingTop: 0, paddingBottom: 0 }} inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                    onChangeText={props.handleChange('phone')} error={props.touched.phone && props.errors.phone} />

                                <Input {...props} multiline={true} name="usernotes" inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }} placeholder={t('usernotes')}
                                    onBlur={props.handleBlur('notes')} style={{ height: scaledHeight(15), textAlignVertical: 'top' }} onChangeText={props.handleChange('notes')}
                                    error={props.touched.notes && props.errors.notes} containerStyle={{ marginTop: scale(30), marginHorizontal: scale(20), marginBottom: scale(10), color: colors.Whitebackground }} />

                                <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(60), marginBottom: scale(50) }}>
                                    <Button title={t('send')} bold size={8} elevation={3} backgroundColor={colors.MainBlue} color="white" loading={loading}
                                        style={{
                                            alignSelf: 'stretch',
                                            paddingVertical: scale(10),
                                        }} radius={28} onPress={props.handleSubmit} />
                                </View>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
}