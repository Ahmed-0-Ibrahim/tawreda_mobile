import { View, TouchableOpacity, Dimensions } from 'react-native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import colors from "../../Utils/colors";
import { Icon } from "./Icon";
import { responsiveFontSize, scale, scaledWidth } from "../../Utils/responsiveUtils";
//import { Image } from "../../../Components/Image";
import { Text } from "../../Components/Text";
import Images from "../../Assets/Images";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from "react-redux";
import Navigation from "../../Utils/Navigation";
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Image } from '../../Components/Image';
import defaultStyles from '../../Utils/defaultStyles';
import OrderModel from '../Tabs/Orders/Modal'
import { cancelOrderApi } from '../../Utils/api'
export const MyShopCart = (props) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [days, setDays] = useState(false);

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

    const status = props.status;
    return (
        // <TouchableOpacity onPress={() => {
        //     Navigation.push({
        //         name: 'StoreOrder', options: {
        //             statusBar: {
        //                 backgroundColor: colors.grayBackgroung
        //             }
        //         }, passProps: {
        //             id: item.id,
        //         }
        //     });
        // }} style={{
        //     flexDirection: "row", alignSelf: "stretch", justifyContent: "space-between", backgroundColor: colors.grayBackgroung, paddingHorizontal: scale(8),
        //     borderRadius: scale(15), elevation: 0, ...defaultStyles.elevationGame(0.5),
        //     width: scale(335), height: scale(114), alignContent: "center", alignItems: "center", marginHorizontal: scale(20), marginVertical: scale(7)
        // }}>
        <TouchableOpacity onPress={() => {
            Navigation.push({
                name: 'StoreOrder', options: {
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
            <View style={{ padding: scale(10) }}>
                <Text color={colors.Product2} size={6} style={{ marginTop: scale(-1) }}>{moment(item.createdAt).format('DD/MM/YYYY - hh:mmA')}</Text>
                <Text color={colors.Black} size={6.5}>{t('ordernumber')} : {item.orderNumber}</Text>
                <Text color={colors.Product2} size={6} style={{ marginTop: scale(-1) }}>{t("quentity")} : {props.quantity ? props.quantity : getQuantity()}</Text>
                <View style={{ backgroundColor: colors.Whitebackground, alignItems: "center", borderRadius: scale(6), borderColor: colors.Gray2, borderWidth: scale(0.5), }}>
                    <Text style={{ alignSelf: "center" }} color={(item.status) === 'WAITING' ? colors.pending : item.status === "CANCELED" ? colors.Cancel : item.status==="ACCEPTED"? colors.Approval:"#CA944B"} size={6}>{item.status === "WAITING" ? t("workingOn") : item.status === "CANCELED" ? t("CANCELED") : item.status==="ACCEPTED" ?t("accept"):t("sold")}</Text>
                </View>
            </View>
            {(item.status) === 'WAITING' ?

                <TouchableOpacity onPress={() => {
                    props.setId(item.id);
                    props.settrue(true)
                }
                }>
                    <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'flex-end', justifyContent: 'center', marginHorizontal: scale(20) }}>
                        <Image source={Images.exit} equalSize={11} />
                    </View>
                </TouchableOpacity>
                : (item.status) === 'ACCEPTED' ?
                    <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'flex-end', justifyContent: 'center', marginHorizontal: scale(20) }}>
                        <View style={{ borderRadius: scale(6), borderColor: colors.highlight, borderWidth: scale(0.4), width: scaledWidth(11), height: scaledWidth(11), alignItems: 'center', justifyContent: 'center', backgroundColor: colors.Whitebackground }}>
                            <Text color={colors.highlight} bold size={8}>{(30-(moment().diff(item.createdAt,'days')))<0?0:30-(moment().diff(item.createdAt,'days'))}</Text>
                            <Text color={colors.Product2} size={5} style={{ marginTop: scale(-15) }}>{t("day")}</Text>
                        </View>
                    </View> : null
            }
        </TouchableOpacity>
    );
}

