import { View, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
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
import { createComplaintApi } from '../../Utils/api';
import { refresh } from '../../Redux/list';

export const ElementSupport = (props) => {
    const { t, i18n } = useTranslation();

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const createComplaint = () => {
        setLoading(true);
        let body = {
            title: {
                ar: props.item.text.ar,
                en: props.item.text.en,
            }
        };
        console.log("bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",body)
        createComplaintApi(body).then(res => {
            dispatch(refresh('chatList'));
            console.log("ressssssssssssssssssssssssssss",res)
            setLoading(false);
            Navigation.push(
                {
                    name: "Chat", options: {
                        statusBar: {
                            backgroundColor: '#F5F6FA'
                        }
                    }, passProps: { title: typeof body.title === 'object' ? body.title[i18n.language] : body.title, complaint: res.id, closed: false,status:"WAITING" }
                });
            // Navigation.showOverlay(t('complaintSuccess'));
        }).catch(error => {
            setLoading(false);
            console.log("ERROR::: ", error);
            Navigation.showOverlay(error, 'fail');
        })
    }

    useEffect(() => {
        // console.log("PROPS ITEM::: ", props.item);
    }, []);

    return (
        <TouchableOpacity disabled={loading/*true*/} onPress={() => {
            createComplaint();
        }} style={{
            flexDirection: "row", paddingVertical: scale(10), paddingHorizontal: scale(12), alignSelf: "stretch", marginHorizontal: scale(10), justifyContent: "space-between",
            backgroundColor: 'white', marginBottom: scale(20), borderRadius: scale(12), alignItems: "center", ...defaultStyles.elevationGame(0.5),borderColor:'#F4F4F4',borderWidth:1
        }}>
            
            <Image source={Images.technical}   style={{width:scale(35),height:scale(30)}} />

            {/* <Button linear circle={8} elevation={1}>
                <Icon name={"info"} type={"Entypo"} size={7} />
            </Button> */}
            <View style={{ flex: 1, paddingHorizontal: scale(10) }}>
                <Text numberOfLines={1} size={7.6}>{typeof props.item.text === 'object' ? props.item.text[i18n.language] : props.item.text}</Text>
            </View>

        </TouchableOpacity>
    );
}

