import React, { useState } from "react";
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Input } from "../../Components/Input";
import { Header } from "../../Components/Header";
import { Icon } from "../../Components/Icon";
import { Text } from "../../Components/Text";
import { Image } from "../../Components/Image";
import Images from "../../Assets/Images";
import { useTranslation } from "react-i18next";
import { Formik } from 'formik';
import * as yup from 'yup';
import { scale } from "../../Utils/responsiveUtils";
import colors from "../../Utils/colors";
import { Button } from "../../Components/Button";
import { changePasswordApi } from "../../Utils/api";
import Navigation from "../../Utils/Navigation";
import defaultStyles from "../../Utils/defaultStyles";

export const ChangePassword = (props) => {
    const { t, i18n } = useTranslation();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    let validationSchema = yup.object({
        currentPassword: yup.string().required(`${t('currentPassword')} ${t('required1')}`),
        newPassword: yup
            .string()
            .required(`${t('newPassword')} ${t('required1')}`)
            .min(6, `${t('newPassword')} ${t('password_length')} 6 ${t('chars_and_numbers')}`),
        confirmPassword: yup
            .string()
            .oneOf([password], `${t('must_match')}`)
            .required(`${t('confirmPassword')} ${t('required1')}`),
    });

    let submit = (values) => {
        setLoading(true);
        changePasswordApi(values).then(res => {
            console.log("RES::: ", res);
            setLoading(false);
            Navigation.showOverlay(t('confirmChangePass'));
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
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Header title={t('changePassword')} back />
                <Formik initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                    validationSchema={validationSchema} onSubmit={(values) => {
                        submit(values);
                    }}>
                    {props => (
                        <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center' }}>
                            <Input {...props} name="currentPassword" title={t('currentPassword')} keyboardType="password" placeholder={"*************"}
                                onBlur={props.handleBlur('currentPassword')} style={{ paddingTop: 0, paddingBottom: 0 }} onChangeText={(text) => {
                                    props.handleChange('currentPassword')(text);
                                    setPassword(text);
                                }} error={props.touched.currentPassword && props.errors.currentPassword} containerStyle={{ marginTop: scale(20), marginHorizontal: scale(20) }} />
                            <Input {...props} name="newPassword" title={t('newPassword')} keyboardType="password" placeholder={"*************"}
                                onBlur={props.handleBlur('newPassword')} style={{ paddingTop: 0, paddingBottom: 0 }} onChangeText={(text) => {
                                    props.handleChange('newPassword')(text);
                                    setPassword(text);
                                }} error={props.touched.newPassword && props.errors.newPassword} containerStyle={{ marginTop: scale(20), marginHorizontal: scale(20) }} />

                            <Input {...props} name="confirmPassword" title={t('confirmPassword')} keyboardType="password" placeholder={"*************"}
                                onBlur={props.handleBlur('confirmPassword')} style={{ paddingTop: 0, paddingBottom: 0 }} onChangeText={props.handleChange('confirmPassword')}
                                error={props.touched.confirmPassword && props.errors.confirmPassword} containerStyle={{ marginTop: scale(20), marginHorizontal: scale(20), marginBottom: scale(10) }} />

                            <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15) }}>
                                <Button title={t('save')} bold size={8} elevation={2} linear color="white" loading={loading}
                                    style={{
                                        alignSelf: 'stretch', marginHorizontal: scale(20), ...defaultStyles.elevationGame(0.5),
                                        paddingVertical: scale(10), marginBottom: scale(15)
                                    }} radius={28} onPress={props.handleSubmit} />
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
        </TouchableWithoutFeedback>
    );
}