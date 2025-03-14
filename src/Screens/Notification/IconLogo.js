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
import { Image } from '../../Components/Image';
import colors from '../../Utils/colors';
import Images, { images } from "../../Assets/Images"

export default IconLogo = (props) => {
    return(
        <View style={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginEnd:scale(10),
            //borderColor: '#ABABAB',
            //borderWidth: 1,
            //height: scaledWidth(10),
            //width: scaledWidth(10),
        }}>
            <Image equalSize={10} style={{
            }} source={Images.logo} />
        </View>
    )
}