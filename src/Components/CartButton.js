import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity } from 'react-native';
import { scale, scaledHeight, scaledWidth } from "../Utils/responsiveUtils";
import { useSelector } from "react-redux";
import { Text } from "./Text";
import colors from "../Utils/colors";
import defaultStyles from "../Utils/defaultStyles";
import { useTranslation } from "react-i18next";
import Images from "../Assets/Images";
import { Image } from "./Image";
import Navigation from "../Utils/Navigation";
import { store } from "../Redux/store";
import { MadelLogin } from "./ModelLogin";
export const CartButton = (props) => {
    const products = useSelector(state => state.cart.products);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const { t, i18n } = useTranslation();
    return (
        <TouchableOpacity style={{ position: "absolute", right: scale(20), bottom: props.Bottom ? props.Bottom : scale(95) }}
            onPress={() => {
                if (!store.getState().auth.token) {
                    setServiceModalVisible(true);
                } else {
                    Navigation.push({
                        name: 'Cart', options: {
                            statusBar: {
                                backgroundColor: colors.grayBackgroung
                            }
                        },
                    })
                }
            }}>
            <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: "#CA944B", borderWidth: scale(4), padding: scale(8), borderRadius: scale(50), }}>
                {products && products.length > 0 ? <View style={{
                    position: 'absolute', top: 10, left: 10, justifyContent: 'center', alignItems: 'center', zIndex: 201,
                    borderRadius: scaledWidth(3.7), width: scaledWidth(5.7), height: scaledWidth(5.7), backgroundColor: colors.highlight
                }}>
                    <Text size={7} style={{ marginTop: -scale(1) }} color="white">{products.length > 9 ? "9+" : products.length}</Text>
                </View> : null}
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: scaledWidth(18),
                        height: scaledHeight(9),
                        borderRadius: scale(200),
                        backgroundColor: "#1b3862"
                    }}>

                    <Image style={{
                        // borderRadius: scale(50),
                    }} source={Images.basketGif} equalSize={10}></Image>
                </View>
                <MadelLogin visible={serviceModalVisible} dismiss={() => {
                    setServiceModalVisible(false);
                }} method={() => {
                    Navigation.push({
                        name: 'Login', options: {
                            statusBar: {
                                backgroundColor: colors.animationColor,
                                // style: 'light'
                            }
                        }
                    });
                }}></MadelLogin>
            </View>
        </TouchableOpacity>
    )
}