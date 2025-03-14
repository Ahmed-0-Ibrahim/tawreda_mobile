import { View, TouchableOpacity, Dimensions } from 'react-native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import colors from "../../../Utils/colors";
import { Icon } from "./Icon";
import { responsiveFontSize, scale, scaledWidth } from "../../../Utils/responsiveUtils";
//import { Image } from "../../../Components/Image";
import { Text } from "../../../Components/Text";
import Images from "../../../Assets/Images";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from "react-redux";
import Navigation from "../../../Utils/Navigation";
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Image } from '../../../Components/Image';
import defaultStyles from '../../../Utils/defaultStyles';
import { Item } from '../Profile/Item';

export const OrderCart = (props) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { rtl } = useSelector(state => ({
        rtl: state.lang.rtl,
    }));
    const { item } = props;

    const getQuantity = () => {
        let quantity = 0;
        item.products.map((item) => {
            quantity += item.quantity;
        });
        return quantity;
    }
    return (
        <TouchableOpacity onPress={() => {
            Navigation.push({
                name: 'OrderDetails', options: {
                    statusBar: {
                        backgroundColor: colors.grayBackgroung
                    }
                }, passProps: {
                    id: item.id,
                }
            });
        }} style={{
            flexDirection: "row", alignSelf: "stretch", justifyContent: "space-between", backgroundColor: '#F5F6FA', paddingHorizontal: scale(8),
            marginVertical: scale(6), marginHorizontal: scale(10), borderRadius: scale(18), elevation: 0, ...defaultStyles.elevationGame(0.5)
        }}>

            <View style={{ paddingHorizontal: scale(10), paddingVertical: scale(8) }}>
                <Text color={colors.Product2} size={6.5} style={{ marginTop: scale(-1) }}>{moment(item.createdAt).format('DD/MM/YYYY - hh:mmA')}</Text>
                <Text color={colors.TextHome1} size={8}>{t('ordernumber') + " : " + item.orderNumber}</Text>
                <Text color={colors.Product2} semiBold size={7} style={{ marginTop: scale(-1) }}>{t("quentity")} : {getQuantity()}</Text>
                <Text color={colors.TextHome2} bold size={8} style={{ marginTop: scale(-1) }}>{t("Total")} : {parseFloat(item.totalPrice).toFixed(2)} {t('pound')}</Text>
                <View style={{ backgroundColor: "#FFFFFF", alignItems: "center", borderRadius: 5, }}>
                    <Text style={{ alignSelf: "center" }} color={item.status === 'ACCEPTED' ? colors.pending : (item.status === 'SHIPPED') ? "#1B3862" : item.status === 'DELIVERED' ? colors.Finished : colors.Cancel} size={7}>{t(item.status)}</Text>
                </View>
            </View>
            {item.status !== 'SHIPPED' ?
                <TouchableOpacity onPress={() => {
                    props.setId(item.id);
                    props.settrue(true)
                }
                }>
                    <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={item.status === 'ACCEPTED' ? Images.exit : Images.retry} equalSize={11} />
                    </View>
                </TouchableOpacity> : null
            }
        </TouchableOpacity>
    );
}

