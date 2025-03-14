
import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import colors from "../../../Utils/colors";
import { Text } from "../../../Components/Text";
// import Navigation from "../../Utils/Navigation";
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../../Utils/responsiveUtils";
import { Image } from "../../../Components/Image";
import { useTranslation } from "react-i18next";
import { API_ENDPOINT } from "../../../configs";
// import { Icon } from "../../Components/Icon";
// import Images from "../../Assets/Images";
import { getProductApi } from "../../../Utils/api";
import defaultStyles from "../../../Utils/defaultStyles";
export const Card = (props) => {
    const { t, i18n } = useTranslation();
    const [count, incrmentCount] = useState(1);
    const [item, setItem] = useState();
    const [loding, setLoading] = useState(false);
    const getProduct = () => {
        console.log('id get :::')
        setLoading(true);
        props.method(true)
        getProductApi(props.id).then(res => {
            console.log("RES::: ", res);
            setItem(res);
            setLoading(false);
            props.method(false)
        }).catch(error => {
            setError(true);
            setLoading(false);
            props.method(false)

        })
    }
    useEffect(() => {
        getProduct()
        console.log("count", count)
        console.log("props", props)
    }, []);
    const renderImage = () => {
        if (props.image) {
            return props.image;
        }
        else if (item.image) {
            return item.image;
        }
        else if (item.slider && item.slider.length > 0) {
            return item.slider[0];
        }
    }

    return (
        <TouchableOpacity disabled={true} style={{ paddingHorizontal: scale(10), paddingBottom: scale(10), paddingTop: scale(8), }}>
            {!loding && item ? <View style={{ flexDirection: "row", alignItems: 'center', backgroundColor: colors.grayBackgroung, borderRadius: scale(15), padding: scale(10) }}>
                <View style={{ backgroundColor: 'white', borderRadius: scale(15), padding: scale(5) }}>
                    <Image equalSize={20} source={{ uri: `${API_ENDPOINT}/${renderImage()}` }} style={{ borderRadius: scale(15) }} />
                </View>

                <View style={{ paddingHorizontal: scale(10), }}>
                    <Text color={'#1D1E20'} style={{ width: scale(200) }} semiBold size={6.5}>{item.name}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginTop: scale(-4) }}>

                        <Text color={'#CA944B'} style={{}} semiBold size={7}>{props.offer ? props.offer : item.offer === 0 ? item.price + t('pound') : item.priceAfterOffer + t('pound')} </Text>
                        {props.isInvestor ? <Text size={6.5} style={{ textDecorationLine: 'line-through', marginLeft: scale(5), }} semiBold color={'#8F959E'} >{item.price} {t('pound')}</Text> : null}
                        {item.offer !== 0 ?
                            <Text
                                size={6.5} style={{ textDecorationLine: 'line-through', marginLeft: scale(5), }} semiBold color={'#8F959E'}>{item.price} {t('pound')}</Text>
                            : null
                        }
                        <Text color={"#8F959E"} style={{ marginEnd: scale(3) }} semiBold size={6}>{t('currency')} </Text>
                    </View>
                </View>

            </View> :
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color='#CA944B' />
                </View>
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

