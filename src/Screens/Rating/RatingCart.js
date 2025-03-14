
import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import colors from "../../Utils/colors";
import { Text } from "../../Components/Text";
import Navigation from "../../Utils/Navigation";
import { scaledHeight, scale, scaledWidth } from "../../Utils/responsiveUtils";
import { Image } from "../../Components/Image";
import { Icon } from "../../Components/Icon";
import { API_ENDPOINT } from "../../configs";
import moment from "moment";
import Images from "../../Assets/Images";
import 'moment/locale/ar';
import { useSelector } from "react-redux";

export const RaitingCart = (props) => {
    const maxRate = [1, 2, 3, 4, 5];

    const rtl = useSelector(state => state.lang.rtl);

    return (

        <View style={{ borderBottomColor: '#EDEDED', marginHorizontal: scale(12), borderBottomWidth: scale(1), paddingTop: scale(8) }}>
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Image style={{ width: scaledWidth(10), height: scaledWidth(10), borderRadius: scaledWidth(5) }}
                        // source={{ uri: `${API_ENDPOINT}${props.item.user.image}` }}
                        source={Images.logo}
                    />
                    <View style={{ flex: 1, alignContent: "center", justifyContent: "center", marginHorizontal: scale(8), }}>
                        <Text semiBold color={colors.textSecondary} style={{ marginTop: scale(4) }}>{props.item.user.name}</Text>
                        <Text semiBold color={colors.timeRateColor} size={6} style={{ marginTop: -scale(5) }}>{moment(props.item.createdAt).locale(rtl ? 'ar' : 'en').fromNow()}</Text>
                    </View>
                </View>
                <View style={{ alignSelf: 'stretch', flexDirection: "row", alignItems: "center" }}>
                    {
                        maxRate.map((item, key) => {
                            return (
                                <Icon style={{ marginVertical: scale(2), marginHorizontal: scale(3) }} size={7} name={"star"} type="FontAwesome" color={item <= props.item.rate ? "rgba(233, 183, 80, 1)" : "rgba(217, 217, 217, 1)"} />
                            );
                        })
                    }
                </View>
            </View>
            {props.item.comment ? <Text color={colors.dicreptioRate} style={{ marginTop: scale(2), marginBottom: scale(6) }} size={6.8}>{props.item.comment}</Text> : null}
        </View>
    );
}

