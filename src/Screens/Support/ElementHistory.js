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
import moment from 'moment';
import defaultStyles from '../../Utils/defaultStyles';

export const ElementHistory = (props) => {
    const { t, i18n } = useTranslation();
    useEffect(() => {
        console.log("ITEM::: ", props.item)
    }, []);
    return (
        <TouchableOpacity style={{
            marginHorizontal: scale(10), alignSelf: 'stretch', paddingHorizontal: scale(10),
            paddingVertical: scale(8),
            elevation: 2,
            ...defaultStyles.elevationGame(0.5),
            backgroundColor: '#F5F6FA',
            borderRadius: scale(9),
            marginBottom: scale(20)
        }} onPress={() => {
            Navigation.push(
                {
                    name: "Chat", options: {
                        statusBar: {
                            backgroundColor: '#F5F6FA'
                        }
                    }, passProps: {
                        title: typeof props.item.message.complaint.title === 'object' ? props.item.message.complaint.title[i18n.language] : props.item.message.complaint.title,
                        complaint: props.item.message.complaint.id, closed: props.item.message.complaint.closed,status:props.item.message.complaint.status
                    }
                });
        }}>
            <Text color={'#8F959E'} size={7}>{moment(props.item.message.createdAt).format('DD/MM/YYYY - hh:mm A')}</Text>
            <View style={{
                flexDirection: "row",
                // justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{ alignSelf: "center" }} size={7.8}>{typeof props.item.message.complaint.title === 'object' ? props.item.message.complaint.title[i18n.language] : props.item.message.complaint.title}</Text>
                <View style={{
                    backgroundColor: '#CA944B33',
                    borderRadius: scale(15),
                    paddingHorizontal: scale(10),
                    marginHorizontal: scale(6),
                    paddingVertical: 0
                }} >
                    {
                        props.item.unReadCount ?
                            <Text size={6.5} color={'#CA944B'} semiBold>{props.item.unReadCount}</Text> : null
                    }
                </View>
            </View>
            <Text color={'#8F959E'} size={7}>{t("complaintnumber")}{props.item.message.complaint.number}</Text>
            <View style={{marginVertical:scale(5), width: scaledWidth(40),backgroundColor: "#FFFFFF", alignItems: "center", borderRadius: 5, }}>
                <Text style={{ alignSelf: "center" }} color={props.item.message.complaint.status === 'WAITING' ? "rgba(27, 56, 98, 1)":props.item.message.complaint.status === 'WAITING'?"#CA944B" : "#EAEAEA"} size={7}>{props.item.message.complaint.status==="RESPONDING" ? t("workingOn"):props.item.message.complaint.status==="ANSWERED" ? t("FinshedComplement"):t("pending")}</Text>
            </View>
        </TouchableOpacity>
    )
}