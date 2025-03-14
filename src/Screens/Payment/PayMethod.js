import React, { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { TabBar } from '../../Components//TabBar';
import { Header } from '../../Components/Header';
import { Text } from '../../Components/Text';
import { Empty } from '../../Components/Empty';
import { Icon } from '../../Components/Icon';
import { useTranslation } from "react-i18next";
import { Input } from '../../Components/Input';
import { scale, scaledWidth, scaledHeight, responsiveFontSize } from "../../Utils/responsiveUtils";
import { Button } from '../../Components/Button';
import { images } from '../../Assets/Images'
import colors from '../../Utils/colors';
import { Image } from '../../Components/Image';
import defaultStyles from '../../Utils/defaultStyles';


export const PayMethod = (props) => {
    const user = useSelector(state => state.auth.user);
    const { t, i18n } = useTranslation();

    return (
        <View style={{
            marginBottom: scale(20), flexDirection: 'row', backgroundColor: '#F4F4F4', borderRadius: scale(15), justifyContent: 'space-between',
            paddingVertical: scale(8), paddingHorizontal: scale(15), alignItems: 'center', ...defaultStyles.elevationGame(0.5),borderWidth: .5,borderColor:'#FFFFFF'
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                <Image equalSize={8} source={props.uri} />
                <Text color={'#1B3862'} semiBold size={7.5} style={{ textAlign: 'center', alignSelf: 'center', marginHorizontal: scale(10) }}>{props.text}</Text>
                {props.wallet ? <View style={{
                    alignItems: 'center', justifyContent: 'center', borderRadius: scale(15), paddingHorizontal: scale(12),
                    marginHorizontal: scale(10), paddingTop: scale(1)
                }}>
                    <Text bold size={6} color={colors.highlight}>{`${user.wallet?parseFloat(user.wallet).toFixed(2):"0.00"} ${t('pound')}`}</Text>
                </View> : null}
            </View>
            <TouchableOpacity onPress={() => {
                props.setChecked(!props.checked);
                props.setChecked1(false);
                props.setChecked2(false);
                props.setChecked3(false);
            }}>
                <View style={{ backgroundColor: props.checked ? '#CA944B' : "#CDCDCD", width: scaledWidth(5), height: scaledWidth(5), borderRadius: scaledWidth(5) / 2, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#F7F7FC', width: scaledWidth(2.5), height: scaledWidth(2.5), borderRadius: scaledWidth(2.5) / 2 }}>

                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}