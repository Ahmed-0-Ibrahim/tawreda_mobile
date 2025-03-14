import React, { useEffect, useRef, useState } from "react";
import { View, TextInput } from 'react-native';
import { scale, scaledHeight, scaledWidth } from "../Utils/responsiveUtils";
import { useSelector } from "react-redux";
import { Text } from "./Text";
import colors from "../Utils/colors";
import defaultStyles from "../Utils/defaultStyles";
import { useTranslation } from "react-i18next";
import Images from "../Assets/Images";
import { Image } from "./Image";
 
export const Empty = (props) => {
    const { t, i18n } = useTranslation();
    return (
        <View style={[{ justifyContent: 'center', flex: 1, }, props.customStyle]}>
            <Image width={60} height={16} source={Images.emptyLogo} style={{ alignSelf: 'center', justifyContent: 'center' }} />
            <Text color={"#150B3D"} size={9} style={{ alignSelf: 'center', }}>{props.Title?props.Title:t('cartempty')}</Text>
            <Text color={"#9E9E9E"} size={6.5} style={{ textAlign: 'center', alignSelf: 'center', marginHorizontal: scale(50) }}>{props.discreption?props.discreption:t('empty')}</Text>
        </View>
    )
}