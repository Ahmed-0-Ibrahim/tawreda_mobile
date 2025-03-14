import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import colors from "../Utils/colors";
import { Icon } from "./Icon";
import defaultStyles from "../Utils/defaultStyles";
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../Utils/responsiveUtils";
//import { Image } from "./Image";
import { Text } from "./Text";
import Images from "../Assets/Images";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { connect, useSelector, useDispatch } from "react-redux";
import Navigation from "../Utils/Navigation";
import { Image } from "./Image";
import { API_ENDPOINT } from "../configs";
import { useTranslation } from "react-i18next";
import { addToCartFn } from "../Redux/cart";
import { Button } from "./Button";
import { style } from "deprecated-react-native-prop-types/DeprecatedViewPropTypes";
import { store } from "../Redux/store";
import { deleteFavorite, updateFavorite } from "../Utils/api";
import { MadelLogin } from "./ModelLogin";
import { refresh } from "../Redux/list";
const ProductContainer = (props) => {

    const product = true;
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const { item, fromSearch, products } = props;
    const { t, i18n } = useTranslation();
    const [isInCart, setIsInCart] = useState(false);
    const [loved, setLoved] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        // console.log("faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaavcccc",props.item.favorite)
        props.loved ? setLoved(props.loved) : setLoved(props.item.favorite)
        let exist = products.findIndex(x => x.id === item.id);
        if ((isInCart && exist === -1) || (!isInCart && exist !== -1)) {
            setIsInCart(exist !== -1 ? true : false);
        }
    }, [products]);



    const updateFAv = async (data) => {
        let _values = { product: data };
        console.log("_valuessssssssssssssssssu", _values);
        updateFavorite(_values).then(res => {
            dispatch(refresh('productList'));
            Navigation.showOverlay(t('addFav'));
            // console.log("RESPONSEeeeeeeeeee::::: u",res.data.data);
            // getFavData()
        }).catch(error => {
            console.log("ERROR::::u ", error);
        });
    }

    const removeFavData = async (data) => {
        // let _values = { product:data};
        console.log("_valuessssssssssssssssss", data);
        deleteFavorite(data).then(res => {
            dispatch(refresh('productList'));
            Navigation.showOverlay(t('removeFav'));
            // console.log("RESPONSEeeeeeeeeee::::: ",res.data.data);
            // getFavData()
        }).catch(error => {
            console.log("ERROR:::: ", error);
        });
    }
    const addToCart = () => {
        let found = addToCartFn(item.id, item, true);
        // if (found) {
        //     Navigation.showOverlay(t('productAlreadyInCart'), 'info');
        // }
        // else {
        //     Navigation.showOverlay(t('productAddedSuccessfullyToCart'));
        // }
        Navigation.showOverlay(t('productAddedSuccessfullyToCart'));
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
        <TouchableOpacity onPress={() => {
            // props.true?null:
            Navigation.push({
                name: 'ProductDetails', options: {
                    statusBar: {
                        backgroundColor: "#F5F6FA"
                    }
                }, passProps: { id: item.id, loved: loved }
            });
        }}
            style={{ marginTop: scale(5), width: scaledWidth(47),height: scaledWidth(70) , }}

        >
            <View style={{
                borderRadius: scale(15), padding: scale(8), margin: scale(5), height: scaledWidth(50) , backgroundColor: colors.CategoryBackground2,
                elevation: 2, ...defaultStyles.elevationGame(0.5, colors.MainGray, 5)
            }}>

                <View style={{ borderRadius: scale(15), width: scaledWidth(40), flex:1, backgroundColor: colors.Whitebackground, padding: scale(5) }}>
                    <TouchableOpacity onPress={() => {
                        if (!store.getState().auth.token) {
                            setServiceModalVisible(true);
                        } else {
                            if (loved) {
                                setLoved(false);
                                removeFavData(item.id)
                            } else {
                                setLoved(true)
                                updateFAv(item.id)

                            }
                            // loved ? setLoved(false) : setLoved(true)
                        }
                    }} >
                        <Image source={loved ? Images.Loved : Images.Heart} style={{ alignContent: "flex-start", }} noLoad equalSize={7}  /*"item.favorite"*/ />
                    </TouchableOpacity>
                    <Image source={{ uri: `${API_ENDPOINT}/${renderImage()}` }} equalSize={item.quantity==0 ? 25 : 35} resizeMode={'contain'} style={{ resizeMode: 'contain', alignContent: "center", alignItems: "center", justifyContent: "center", alignSelf: "center", marginHorizontal: scale(5) }} />
                    {item.quantity==0 ? <View style={{ alignContent: "stretch", alignItems: "center", justifyContent: "center", alignSelf: "center", marginHorizontal: scale(0), marginTop: scale(10), backgroundColor: "red", padding: scale(2), borderRadius: scale(20), width: scaledWidth(37) }} >
                        <Text size={scale(5.5)} semiBold color={colors.Whitebackground}>{t("available")}</Text>
                    </View> : null
                        // <View style={{ flexDirection: "row", alignContent: "stretch", alignItems: "center", marginTop: scale(10), justifyContent: "center", alignSelf: "center", marginHorizontal: scale(0), backgroundColor: colors.MainBlue, padding: scale(2), borderRadius: scale(20), width: scaledWidth(37) }} >
                        //     <Icon size={8} type={"MaterialCommunityIcons"} name={"cart-check"} color={colors.Whitebackground} style={{ marginHorizontal: scale(5) }} />
                        //     <Text size={scale(5.5)} semiBold color={colors.Whitebackground}>{t("doneAddToCart")}</Text>

                        // </View>
                    }
                </View>
            </View>

            <View style={{ paddingHorizontal: scale(8), }}>
                <Text color={"black"} bold numberOfLines={1}>{item.name}</Text>
                <View style={{ flexDirection: "row", alignSelf: "flex-start", justifyContent: "flex-start", alignContent: "flex-start", alignItems: "flex-start", }}>
                    <Text color={colors.highlight} semiBold size={7.5}>{parseFloat(item.price).toFixed(2)} {t('pound')}</Text>
                    <Text numberOfLines={1} style={{ marginHorizontal: scale(5), alignSelf: "center" }} color={colors.TextGray}>{item.productType.name}</Text>
                </View>
            </View>
            <MadelLogin visible={serviceModalVisible} dismiss={() => {
                setServiceModalVisible(false);
            }} method={() => {
                Navigation.push({
                    name: 'Login', options: {
                        statusBar: {
                            backgroundColor: colors.animationColor,
                            //style: 'light'
                        }
                    }
                });
            }}>

            </MadelLogin>
        </TouchableOpacity>
    );
}

const mapStateToProps = state => ({
    products: state.cart.products,
    user: state.auth.user,
});

export default connect(mapStateToProps)(ProductContainer);

