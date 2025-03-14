import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { TabBar } from '../../Components//TabBar';
import { Header } from '../../Components/Header';
import { Text } from '../../../Components/Text';
import { Empty } from '../../Components/Empty';
import { Icon } from '../../Components/Icon';
import { useTranslation } from "react-i18next";
import { Input } from '../../Components/Input';
import { scale, scaledWidth, scaledHeight, responsiveFontSize } from "../../../Utils/responsiveUtils";
import { CartItem } from "./CartItem";
import { Button } from '../../Components/Button'; 
import { PayMethod } from './PayMethod';
import { images } from "../../Assets/Images"

export const OrderChosse = (props) => {
    return(
        <View style={{  paddingHorizontal: scale(40), alignItems: 'center', paddingTop: scale(10), justifyContent: 'center', width: scaledWidth(50),}}>
                <TouchableOpacity onPress={() => {
                    props.settrue(true)
                    props.setfalse(false)
                 }}>
                    <Text semiBold color={props.checked?"#1B3862":"#00000077" } style={{height: scaledHeight(6)}} >{props.name}</Text>
                </TouchableOpacity>
                {props.checked?<View style={{
                    backgroundColor:'#CA944B',
                    borderRadius: scale(8),
                    height: scale(4),
                    width: scaledWidth(11),
                }} />:null}
            </View>
    )
}