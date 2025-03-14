import { Text } from '../../Components/Text';
import colors from '../../Utils/colors';
import { scale, scaledHeight, scaledWidth, responsiveFontSize } from "../../Utils/responsiveUtils";
import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Icon } from "../../Components/Icon";
import { Image } from '../../Components/Image';
import { Button } from '../../Components/Button';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINT } from '../../configs';
import { addToCartFn, removeFromCartFn } from '../../Redux/cart';
export const CartItem = (props) => {
    const [count, incrmentCount] = useState(props.quantity);
    const { t, i18n } = useTranslation();
    const { item } = props;
    const [max, setmax] = useState(props.item.maxQuantity < props.item.quantity ? props.item.maxQuantity : props.item.quantity)

    useEffect(() => {
        console.log("prrrrrrrrrrrrrrrrrrrrrrrrrrrr", props)
        incrmentCount(props.quantity);
    }, [props.quantity]);

    const addToCart = (_count) => {
        addToCartFn(item.id, item, true, _count);
    }

    const removeFromCart = () => {
        removeFromCartFn(item.id);
    }

    const renderImage = () => {
        if (item.image) {
            return item.image;
        }
        else if (item.slider && item.slider.length > 0) {
            return item.slider[0];
        }
    }

    return (
        <View style={{ paddingBottom: scale(3), backgroundColor: '#F5F6FA', marginVertical: scale(5), borderRadius: scale(20) }}>
            <View style={{ borderRadius: 18, padding: scale(8), flexDirection: 'row' }}>

                <View style={{ borderRadius: 10, padding: scale(10), backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ width: scaledWidth(25), height: scaledHeight(15), resizeMode: "contain", borderRadius: 10 }} source={{ uri: `${API_ENDPOINT}/${renderImage()}` }} />
                </View>
                <View style={{ justifyContent: 'center', alignSelf: 'stretch', flex: 1, marginStart: scale(15) }}>
                    <Text color={'#1D1E20'} bold size={7.5} >{item.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{}} semiBold color={'#CA944B'} >{props.isInvestor ? item.investorPrice :item.offer === 0 ? item.price : item.price * (100 - item.offer) / 100} {t('pound')}</Text>
                            {props.isInvestor ? <Text size={6} style={{ textDecorationLine: 'line-through', marginLeft: scale(5), }} semiBold color={'#8F959E'} >{item.price} {t('pound')}</Text> : null}
                            {

                                item.offer !== 0 ? <Text
                                    size={6.5} style={{ textDecorationLine: 'line-through', marginLeft: scale(5), }} semiBold color={'#8F959E'}>{item.price}{t('pound')} </Text> : null
                            }
                            <Text style={{ marginHorizontal: scale(5), }} color={'#8F959E'}>{t('currency')}</Text>
                        </View>
                    </View>
                    {/* {item.offer !== 0 ? <View style={{ flexDirection: "row", justifyContent: 'space-between', }}>
                        <View style={{ backgroundColor: "#CA944B", borderRadius: 20, paddingHorizontal: 7 }}>
                            <Text color={colors.Product1} size={6} semiBold>{item.offer}%</Text>
                        </View>
                    </View> : null} */}
                    <View style={{ flexDirection: 'row', paddingVertical: scale(6), alignItems: 'center', marginHorizontal: scale(-5) }}>

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
                                if (count < max) {
                                    incrmentCount(prevCount => {
                                        addToCart(prevCount + 1);
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
                                if (count > 1) {
                                    incrmentCount(prevCount => {
                                        addToCart(prevCount - 1);
                                        return prevCount - 1;
                                    });
                                }
                            }}>
                            <Icon size={9} color={'#8F959E'} type={'Entypo'} name={'minus'} style={{ textAlign: 'center', alignSelf: 'center', justifyContent: 'center' }}></Icon>
                        </TouchableOpacity>

                    </View>


                </View>
                <View style={{ justifyContent: 'flex-end' }}>
                    <TouchableOpacity activeOpacity={0.8} style={{
                        paddingHorizontal: scale(6), color: "white", backgroundColor: colors.Whitebackground,
                        borderRadius: scale(25),
                        shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.5,
                        width: scaledWidth(10),
                        height: scaledWidth(10),
                        alignContent: "center",
                        justifyContent: "center",
                    }} onPress={() => {
                        removeFromCart();
                    }}>
                        <Icon name="delete-forever" type="MaterialCommunityIcons" size={11} color={'#8F959E'} reverse />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

