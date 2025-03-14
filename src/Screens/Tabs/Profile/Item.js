import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, I18nManager, ActivityIndicator, Platform, Switch } from 'react-native';
import { Button } from "../../../Components/Button";
import { Text } from "../../../Components/Text";
import { Icon } from "../../../Components/Icon";
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../../Utils/responsiveUtils";
import colors from "../../../Utils/colors";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import defaultStyles from "../../../Utils/defaultStyles";
import { setLangStorage } from '../../../Redux/lang';
import RNRestart from 'react-native-restart';
import { Image } from "../../../Components/Image";
import { updateUserFn } from "../../../Redux/auth";
import { changeProfile } from "../../../Utils/api";
export const Item = (props) => {

    const [isEnabled, setIsEnabled] = useState(props.workNotif);
    const toggleSwitch = () =>{update(!isEnabled); setIsEnabled(previousState => !previousState)  };

    const user = useSelector(state => state.auth.user);
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [wait, setWait] = useState(true);

    useEffect(() => {
        if (props.lang) {
            setTimeout(() => {
                setWait(false);
            }, 2000);
        }
    }, []);
    let update = (value) => {
        setLoading(true);
        let _values = { notification:value};
        console.log("COUNTRY:::: ", _values);
        changeProfile(_values).then(res => {
            console.log("RES::: ", res);
            setLoading(false);
            updateUserFn(res)
            // Navigation.showOverlay(t('udatedate'));
            // setTimeout(() => {
            //     Navigation.pop();
            // }, 250);
        }).catch(error => {
            console.log("ERROR::: ", error);
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }
    return (
        <TouchableOpacity activeOpacity={0.8} style={{
            alignSelf: 'stretch', alignItems: 'center', flexDirection: 'row', marginHorizontal: scale(15), backgroundColor: props.MyShop ? colors.MainBlue : colors.grayBackgroung,
            paddingVertical: scale(10), paddingHorizontal: scale(8), borderRadius: scale(15), marginVertical: scaledHeight(0.6)
        }} disabled={props.lang} onPress={props.onPress}>
            <Image source={props.imgName} equalSize={scale(7)} noLoad />

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingStart: scale(10) }}>
                <Text size={7.5} color={props.color ? props.color : colors.MainBlue}>{props.title}</Text>
                {props.wallet ? <View style={{
                    alignItems: 'center', justifyContent: 'center', borderRadius: scale(15), paddingHorizontal: scale(12),
                    marginHorizontal: scale(10), paddingTop: scale(1)
                }}>
                    <Text bold size={6} color={colors.highlight}>{`${user.wallet?parseFloat(user.wallet).toFixed(2):"0.00"} ${t('pound')}`}</Text>
                </View> : null}
            </View>
            {props.lang ? loading || wait ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={colors.highlight} size={responsiveFontSize(8)} /></View> : <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <TouchableOpacity style={{
                        borderRadius: scaledWidth(4) / 2, width: scaledWidth(4), height: scaledWidth(4),
                        justifyContent: 'center', alignItems: 'center', backgroundColor: i18n.language === 'ar' ? colors.Gray2 : colors.highlight
                    }} activeOpacity={0.8} onPress={() => {
                        if (i18n.language === 'ar') {
                            setLoading(true);
                            setLangStorage(false);
                            i18n.changeLanguage('en').then(l => {
                                I18nManager.forceRTL(false);
                                I18nManager.allowRTL(false);
                                RNRestart.Restart();
                                setLoading(false);
                            });
                        }
                    }}>
                        <View style={{ borderRadius: scaledWidth(2) / 2, width: scaledWidth(2), height: scaledWidth(2), backgroundColor: 'white' }} />
                    </TouchableOpacity>
                    <Text style={{ paddingStart: scale(i18n.language === 'en' || Platform.OS === 'ios' ? 4 : 0), paddingEnd: scale(i18n.language === 'ar' ? 4 : Platform.OS === 'ios' ? 4 : 0), paddingTop: scale(2) }} color={i18n.language === 'ar' ? colors.Gray2 : colors.highlight} size={6.5}>{t('english')}</Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', paddingStart: scale(12) }}>
                    <TouchableOpacity style={{
                        borderRadius: scaledWidth(4) / 2, width: scaledWidth(4), height: scaledWidth(4),
                        justifyContent: 'center', alignItems: 'center', backgroundColor: i18n.language === 'en' ? colors.Gray2 : colors.highlight
                    }} activeOpacity={0.8} onPress={() => {
                        if (i18n.language === 'en') {
                            setLoading(true);
                            setLangStorage(true);
                            i18n.changeLanguage('ar').then(l => {
                                I18nManager.allowRTL(true);
                                I18nManager.forceRTL(true);
                                RNRestart.Restart();
                                setLoading(false);
                            });
                        }
                    }}>
                        <View style={{ borderRadius: scaledWidth(2) / 2, width: scaledWidth(2), height: scaledWidth(2), backgroundColor: colors.Whitebackground }} />
                    </TouchableOpacity>
                    <Text style={{ paddingStart: scale(i18n.language === 'en' || Platform.OS === 'ios' ? 4 : 0), paddingEnd: scale(i18n.language === 'ar' ? 4 : Platform.OS === 'ios' ? 4 : 0), paddingTop: scale(2) }} color={i18n.language === 'en' ? colors.Gray2 : colors.highlight} size={6.5}>{t('arabic')}</Text>
                </View>
            </View> : (props.notifcation ? <View style={{ backgroundColor: isEnabled ? "rgba(52, 168, 83, 0.28)" : "#767577", borderRadius: scale(20) }}
            ><Switch
            trackColor={{ false: "#00000000", true: "#00000000" }}
                    thumbColor={isEnabled ? "rgba(52, 168, 83, 1)" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled} /></View>
                : <Icon name="keyboard-arrow-left" type="MaterialIcons" color={colors.highlight} size={14} reverse />)}
        </TouchableOpacity>
    );
}