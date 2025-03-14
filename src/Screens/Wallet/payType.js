import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, I18nManager, ActivityIndicator, Platform, Switch } from 'react-native';
import { Button } from "../../Components/Button";
import { Text } from "../../Components/Text";
import { Icon } from "../../Components/Icon";
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import colors from "../../Utils/colors";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import defaultStyles from "../../Utils/defaultStyles";
import { setLangStorage } from '../../Redux/lang';
import RNRestart from 'react-native-restart';
import { Image } from "../../Components/Image";

export const PayType = (props) => {

    const user = useSelector(state => state.auth.user);
    const { t, i18n } = useTranslation();


    return (
        <TouchableOpacity activeOpacity={0.8} style={{
            alignSelf: 'stretch', alignItems: 'center', flexDirection: 'row', marginHorizontal: scale(15), backgroundColor: props.MyShop ? colors.MainBlue : colors.Whitebackground,
            paddingVertical: scale(10), paddingHorizontal: scale(8), borderRadius: scale(15), marginVertical: scaledHeight(0.6)
        }} disabled={props.lang} onPress={props.onPress}>
            <Image source={props.imgName} equalSize={scale(7)} noLoad />

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingStart: scale(10) }}>
                <Text size={7.5} color={props.color ? props.color : colors.MainBlue}>{props.title}</Text>

            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                </View>
                <TouchableOpacity style={{
                    borderRadius: scaledWidth(4) / 2, width: scaledWidth(4), height: scaledWidth(4),
                    justifyContent: 'center', alignItems: 'center', backgroundColor: i18n.language === 'ar' ? colors.Gray2 : colors.highlight
                }} activeOpacity={0.8} onPress={() => {
                   
                }}>
                    <View style={{ borderRadius: scaledWidth(2) / 2, width: scaledWidth(2), height: scaledWidth(2), backgroundColor: 'white' }} />
                </TouchableOpacity>

        </TouchableOpacity>
    );
}