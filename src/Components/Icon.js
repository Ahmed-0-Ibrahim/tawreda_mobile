import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { responsiveFontSize, scale } from '../Utils/responsiveUtils';
import defaultStyles from '../Utils/defaultStyles';
import { useSelector } from 'react-redux';

const getType = (type) => {
    switch (type) {
        case "FontAwesome":
            return FontAwesome;
        case "FontAwesome5":
            return FontAwesome5;
        case "AntDesign":
            return AntDesign;
        case "Entypo":
            return Entypo;
        case "EvilIcons":
            return EvilIcons;
        case "IonIcons":
            return IonIcons;
        case "Ionicons":
            return IonIcons;
        case "MaterialIcons":
            return MaterialIcons;
        case "MaterialCommunityIcons":
            return MaterialCommunityIcons;
        case "Feather":
            return Feather;
        case "Foundation":
            return Foundation;
        case "Octicons":
            return Octicons;
        case "Zocial":
            return Zocial;
        case "SimpleLineIcons":
            return SimpleLineIcons;
        case "Fontisto":
            return Fontisto;
        default:
            return AntDesign;
    }
}

export const Icon = (props) => {
    const rtl = useSelector(state => state.lang.rtl);
    let {
        size = 7,
        type = "AntDesign",
        name = 'info',
        color = defaultStyles.icon.color,
        reverse,
        style,
    } = props;

    const IconType = getType(type);

    return (
        <IconType size={responsiveFontSize(size)} name={name} color={color} style={[style, !rtl && reverse && { transform: [{ scaleX: -1 }] }]} />
    );
}