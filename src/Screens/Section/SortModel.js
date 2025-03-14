import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Button } from "../../Components/Button";
import { Text } from "../../Components/Text";
import { scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import Images from "../../Assets/Images";
import colors from "../../Utils/colors";
import { Icon } from "../../Components/Icon";
import { Image } from "../../Components/Image";
import { PayType } from "../Wallet/payType";
import { Input } from "../../Components/Input";
import { Formik } from "formik";
import * as yup from 'yup';

export default SortModel = (props) => {
    const { t, i18n } = useTranslation();

    let validationSchema = yup.object({
        phone: yup.string().matches(/^[0-9]+$/, `${t('phone')} ${t('invalid')}`).required(`${t('phone')} ${t('required')}`),
    });

    const [choose1Enabled, set1IsEnabled] = useState(false);
    const [choose2Enabled, set2IsEnabled] = useState(false);
    const [choose3Enabled, set3IsEnabled] = useState(false);

    let submit = (values) => {
        setLoading(true);
        console.log("COUNTRY:::: ", country);
        let _values = { ...values, countryKey: country.countryCode, countryCode: `+${country.cca2}` };
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
        <Modal visible={props.visible} animationType="none" transparent={true}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => {
                props.dismiss();
            }}>
                <TouchableWithoutFeedback>
                    <View style={{
                        alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20),
                        paddingHorizontal: scale(10), paddingVertical: scale(15), backgroundColor: colors.grayBackgroung,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", width: scaledWidth(90), alignContent: 'center', alignItems: "center" }}>
                            <TouchableOpacity style={{
                                alignItems: 'center', justifyContent: 'center',
                                width: scaledWidth(8), height: scaledWidth(8), borderRadius: scaledWidth(8) / 2, backgroundColor: 'rgba(118, 118, 128, 0.12)'
                            }} onPress={() => {
                                props.dismiss();
                            }}>
                                <Icon name="close" type="IonIcons" size={9.5} color={colors.MainBlue} />
                            </TouchableOpacity>

                            <Text semiBold size={scale(7)} color={colors.MainBlue} >{t("SortBy")}</Text>
                            <Icon name="close" type="IonIcons" size={0} />
                        </View>

                        <View activeOpacity={0.8} style={{
                            alignItems: 'center', flexDirection: 'row-reverse', marginHorizontal: scale(15), justifyContent: "flex-start", alignSelf: "flex-start",
                            paddingHorizontal: scale(8), marginVertical: scaledHeight(0.2), marginTop: scaledHeight(2)
                        }} disabled={props.lang} onPress={props.onPress}>
                            <Text size={7.5} color={colors.MainBlue} style={{ marginStart: scaledWidth(3) }}>{t('NewProducts')}</Text>

                            <TouchableOpacity style={{
                                borderRadius: scaledWidth(4) / 2, width: scaledWidth(4), height: scaledWidth(4),
                                justifyContent: 'center', alignItems: 'center', backgroundColor: choose1Enabled == false ? colors.Gray2 : colors.highlight
                            }} activeOpacity={0.8} onPress={() => {
                                set1IsEnabled(true);
                                props.SortLast(true);
                                props.Sort(null);
                                set2IsEnabled(false);
                                set3IsEnabled(false);
                                props.dismiss();
                            }}>
                                <View style={{ borderRadius: scaledWidth(2) / 2, width: scaledWidth(2), height: scaledWidth(2), backgroundColor: 'white' }} />
                            </TouchableOpacity>
                        </View>

                        <View activeOpacity={0.8} style={{
                            alignItems: 'center', flexDirection: 'row-reverse', marginHorizontal: scale(15), justifyContent: "flex-start", alignSelf: "flex-start",
                            paddingHorizontal: scale(8), marginVertical: scaledHeight(0.1)
                        }} disabled={props.lang} onPress={props.onPress}>
                            <Text size={7.5} color={colors.MainBlue} style={{ marginStart: scaledWidth(3) }}>{t('MinProducts')}</Text>

                            <TouchableOpacity style={{
                                borderRadius: scaledWidth(4) / 2, width: scaledWidth(4), height: scaledWidth(4),
                                justifyContent: 'center', alignItems: 'center', backgroundColor: choose2Enabled == false ? colors.Gray2 : colors.highlight
                            }} activeOpacity={0.8} onPress={() => {
                                set2IsEnabled(true);
                                props.Sort(1);
                                props.SortLast(null);
                                set1IsEnabled(false);
                                set3IsEnabled(false);
                                props.dismiss();
                            }}>
                                <View style={{ borderRadius: scaledWidth(2) / 2, width: scaledWidth(2), height: scaledWidth(2), backgroundColor: 'white' }} />
                            </TouchableOpacity>
                        </View>

                        <View activeOpacity={0.8} style={{
                            alignItems: 'center', flexDirection: 'row-reverse', marginHorizontal: scale(15), justifyContent: "flex-start", alignSelf: "flex-start",
                            paddingHorizontal: scale(8), marginVertical: scaledHeight(0.1)
                        }} disabled={props.lang} onPress={props.onPress}>
                            <Text size={7.5} color={colors.MainBlue} style={{ marginStart: scaledWidth(3) }}>{t('MaxProducts')}</Text>

                            <TouchableOpacity style={{
                                borderRadius: scaledWidth(4) / 2, width: scaledWidth(4), height: scaledWidth(4),
                                justifyContent: 'center', alignItems: 'center', backgroundColor: choose3Enabled == false ? colors.Gray2 : colors.highlight
                            }} activeOpacity={0.8} onPress={() => {
                                set3IsEnabled(true);
                                props.Sort(-1);
                                props.SortLast(null);
                                set2IsEnabled(false);
                                set1IsEnabled(false);
                                props.dismiss();
                            }}>
                                <View style={{ borderRadius: scaledWidth(2) / 2, width: scaledWidth(2), height: scaledWidth(2), backgroundColor: 'white' }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}