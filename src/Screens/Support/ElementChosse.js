import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
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
import colors from '../../Utils/colors';
import { images } from "../../Assets/Images"

export default ChosseElement = (props) => {
    return (
        <TouchableOpacity activeOpacity={1} style={{ backgroundColor:'#F5F6FA' ,alignSelf: 'stretch', alignItems: 'center', paddingVertical: scale(10), justifyContent: 'center', flex: 1 }} onPress={() => {
            props.settrue(true)
            props.setfalse(false)
        }}>
            <View>
                <Text semiBold color={props.checked ? "#1B3862" : "#00000088"} size={7.8}>{props.name}</Text>
            </View>
            {props.checked ? <View style={{
                position: 'absolute',
                bottom: -2,
                alignSelf: 'center',
                backgroundColor: '#CA944B',
                borderRadius: scale(8),
                height: scaledHeight(0.5),
                width: scaledWidth(11),
            }} /> : null}
        </TouchableOpacity>
    )
}