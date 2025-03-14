import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import colors from "../../Utils/colors";
import { Icon } from "../../Components/Icon";
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import { Text } from "../../Components/Text";
import Images from "../../Assets/Images";
import { useSelector, useDispatch } from "react-redux";
import Navigation from "../../Utils/Navigation";
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Button } from '../../Components/Button';
import defaultStyles from '../../Utils/defaultStyles';

export const QuestionCard = (props) => {
    const { t, i18n } = useTranslation();

    return (
        <TouchableOpacity onPress={() => {
            Navigation.push({
                name: 'CommonAnswers', options: {
                    statusBar: {
                        backgroundColor: '#F5DCDE'
                    }
                },
                passProps: { item: props.item },
            });
        }} style={{
            flexDirection: "row", alignSelf: "stretch", justifyContent: "space-between", backgroundColor: 'white',
            marginBottom: scale(18), borderRadius: scale(12), elevation: 2, alignItems: "center", marginHorizontal: scale(10),
            paddingHorizontal: scale(10), paddingVertical: scale(8), ...defaultStyles.elevationGame(0.5)
        }}>
            <Button linear circle={8} elevation={1} style={{ marginHorizontal: scale(4) }}>
                <Icon name={"info"} type={"Entypo"} size={7} />
            </Button>
            <View style={{ flex: 1, marginHorizontal: scale(6) }}>
                <Text size={7.5} numberOfLines={1}>{`${props.item.title}`}</Text>
            </View>
            <Icon name={"chevron-small-left"} type={"Entypo"} size={12} color={colors.buttonQ} reverse={true} />

        </TouchableOpacity>
    );
}

