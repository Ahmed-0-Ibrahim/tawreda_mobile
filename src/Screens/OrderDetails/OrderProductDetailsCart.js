
import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import colors from "../../Utils/colors";
import { Text } from "../../Components/Text";
import Navigation from "../../Utils/Navigation";
import { responsiveFontSize, scale, scaledWidth } from "../../Utils/responsiveUtils";
import { Image } from "../../Components/Image";
import { useTranslation } from "react-i18next";
import { API_ENDPOINT } from "../../configs";
import { Icon } from "../../Components/Icon";
import Images from "../../Assets/Images";
export const OrderProductDetailsCart = (props) => {
    const { t, i18n } = useTranslation();
    const [count, incrmentCount] = useState(props.days<=0?props.item.quantity:props.item.quantity==0?0: 1);
    const { item } = props;
    useEffect(() => {
        if (props.isInvestor&& props.orders.length !== 0) {
            props.update(props.item.product.id,props.days<=0?props.item.quantity: count);
        }
        incrmentCount(props.days<=0?props.item.quantity:count)
        console.log("count", props.days<=0?props.item.quantity:count)
        console.log("props", props.item.product.id)
    }, [count,props.days]);
    const renderImage = () => {
        if (props.image) {
            return props.image;
        }
        else if (item.product.image) {
            return item.product.image;
        }
        else if (item.product.slider && item.product.slider.length > 0) {
            return item.product.slider[0];
        }
    }

    return (
        <TouchableOpacity disabled={true} style={{ paddingHorizontal: scale(10), paddingBottom: scale(10), paddingTop: scale(8), }}>
            <View style={{ flexDirection: "row", alignItems: 'center', backgroundColor: colors.grayBackgroung, borderRadius: scale(15), padding: scale(10) }}>
                <View style={{ backgroundColor: 'white', borderRadius: scale(15), padding: scale(5) }}>
                    <Image equalSize={20} source={{ uri: `${API_ENDPOINT}/${renderImage()}` }} style={{ borderRadius: scale(15) }} />
                </View>

                <View style={{ paddingHorizontal: scale(10), }}>
                    <Text color={'#1D1E20'} style={{ width: scale(200) }} semiBold size={6.5}>{item.product.name}</Text>
                    {props.accept ?
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginTop: scale(-4) }}>

                            <Text color={'#CA944B'} style={{ marginEnd: scale(3) }} semiBold size={7}>{t('buyprice') + " : "}{/*props.offer ? props.offer : item.product.offer === 0 ? item.price : item.priceAfterOffer*/item.price}{t('pound')} </Text>
                            <Text color={"#8F959E"} style={{ marginEnd: scale(3) }} semiBold size={6}>{t('currency')} </Text>
                        </View>
                        : <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginTop: scale(-4) }}>

                            <Text color={'#CA944B'} style={{}} semiBold size={7}>{props.offer ? props.offer : item.product.offer === 0 ? item.price + t('pound') : item.priceAfterOffer + t('pound')} </Text>
                            {props.isInvestor ? <Text size={6.5} style={{ textDecorationLine: 'line-through', marginLeft: scale(5), }} semiBold color={'#8F959E'} >{item.product.price} {t('pound')}</Text> : null}
                            {item.product.offer !== 0 ?
                                <Text
                                    size={6.5} style={{ textDecorationLine: 'line-through', marginLeft: scale(5), }} semiBold color={'#8F959E'}>{item.price} {t('pound')}</Text>
                                : null
                            }
                            <Text color={"#8F959E"} style={{ marginEnd: scale(3) }} semiBold size={6}>{t('currency')} </Text>
                        </View>
                    }
                    {props.accept ?
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginTop: scale(-4) }}>

                            <Text color={'#EB4335'} style={{ marginEnd: scale(3) }} semiBold size={7}>{t('sellbrice') + " : "}{item.product.dailyPrice + t('pound')} </Text>
                            <Text color={"#8F959E"} style={{ marginEnd: scale(3) }} semiBold size={6}>{t('currency')} </Text>
                        </View>
                        : null
                    }
                    {
                        props.accept ? <View style={{ flexDirection: 'row', paddingVertical: scale(6), alignItems: 'center', marginHorizontal: scale(-5) }}>

                            <TouchableOpacity
                                style={{
                                    // linear,
                                    alignContent: "center",
                                    justifyContent: 'center',
                                    backgroundColor: "#00000000",
                                    // padding: 2,
                                    height: scaledWidth(7),
                                    width: scaledWidth(7),
                                    borderRadius: scaledWidth(7) / 2,
                                }} onPress={() => {
                                    if (count < item.quantity) {
                                        incrmentCount(prevCount => {
                                            return prevCount + 1;
                                        });
                                    }
                                }}>
                                <Icon color={'#1B3862'} name={'plus'} type={'Entypo'} size={9} style={{ textAlign: 'center', alignSelf: 'center', justifyContent: 'center' }}></Icon>
                            </TouchableOpacity>
                            <View activeOpacity={0.8} style={{
                                marginHorizontal: scale(10),
                                borderWidth: 1, borderColor: '#E2E2E2',
                                paddingHorizontal: scale(6), color: "white", backgroundColor: colors.Whitebackground,
                                borderRadius: scale(25), shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.5,
                                width: scaledWidth(10),
                                height: scaledWidth(10),
                                shadowRadius: scale(25),
                                alignContent: "center",
                                justifyContent: "center",
                                shadowOffset: { width: 0, height: 4 }
                            }} >
                                <Text bold size={9} color={"#404B52"} style={{ textAlign: 'center', alignSelf: 'center', }}>{count}</Text>
                            </View>

                            <TouchableOpacity
                                style={{
                                    alignContent: "center",
                                    justifyContent: 'center',
                                    backgroundColor: "#00000000",
                                    // padding: 2,
                                    height: scaledWidth(7),
                                    width: scaledWidth(7),
                                    borderRadius: scaledWidth(7) / 2,
                                }} onPress={() => {
                                    if (count > 0) {
                                        incrmentCount(prevCount => {
                                            return prevCount - 1;
                                        });
                                    }
                                }}>
                                <Icon size={9} color={'#8F959E'} type={'Entypo'} name={'minus'} style={{ textAlign: 'center', alignSelf: 'center', justifyContent: 'center' }}></Icon>
                            </TouchableOpacity>

                        </View> :
                            <Text color={colors.textNumPices} style={{ marginTop: scale(-2) }} semiBold size={5.5}>{"x" + item.quantity}</Text>
                    }


                </View>

            </View>
        </TouchableOpacity>
    );
}

