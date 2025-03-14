import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Dimensions,  } from 'react-native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import colors from "../Utils/colors";
import { Icon } from "./Icon";
import defaultStyles from "../Utils/defaultStyles";
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../Utils/responsiveUtils";
//import { Image } from "./Image";
import { Text } from "./Text";
import Images from "../Assets/Images";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { connect, useSelector ,useDispatch} from "react-redux";
import Navigation from "../Utils/Navigation";
import { Image } from "./Image";
import { API_ENDPOINT } from "../configs";
import { useTranslation } from "react-i18next";
import { addToCartFn } from "../Redux/cart";
import { Button } from "./Button";
import { style } from "deprecated-react-native-prop-types/DeprecatedViewPropTypes";
import { updateFavorite, deleteFavorite } from "../Utils/api";
import { MadelLogin } from "./ModelLogin";
import { store } from "../Redux/store";
import { refresh } from "../Redux/list";
const ProductContainerHorizontal = (props) => {
    const product = true;
    const { item, fromSearch, products } = props;
    const { t, i18n } = useTranslation();
    const [isInCart, setIsInCart] = useState(false);
    const [loved, setLoved] = useState(false);
    const dispatch = useDispatch();
    const [serviceModalVisible, setServiceModalVisible] = useState(false);

    useEffect(() => {
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
            Navigation.push({
                name: 'ProductDetails', options: {
                    statusBar: {
                        backgroundColor: 'white'
                    }
                }, passProps: { id: item.id, loved: loved }
            });
        }}
            style={{
                borderRadius: scale(15), marginVertical: scale(5), padding: scale(8), backgroundColor: colors.CategoryBackground2, alignSelf: "center", justifyContent: "center", alignItems: "center", alignContent: "flex-start",
                elevation: 2, flexDirection: "row", width: scale(335), height: scale(121), ...defaultStyles.elevationGame(0.5, colors.MainGray, 5)
            }}
        >
            <View style={{ flexDirection: "row", alignContent: "space-between", width: scale(280) }}>
                <View style={{ height: scale(106), borderRadius: scale(15), width: scale(92), backgroundColor: colors.Whitebackground, padding: scale(10),alignItems:'center' }}>
                    <Image source={{ uri: `${API_ENDPOINT}/${renderImage()}` }} resizeMode={'contain'} equalSize={20} />
                </View>

                <View style={{ padding: scale(5) }}>
                    <Text color={"black"} style={{ width: scale(155) }} bold size={scale(5.5)}>{item.name}</Text>
                    <View style={{ flexDirection: "row", alignSelf: "flex-start", justifyContent: "flex-start", alignContent: "flex-start", alignItems: "flex-start", }}>
                        <Text color={colors.highlight} bold size={6.5}>{parseFloat(item.price).toFixed(2)} {t('pound')}</Text>
                        <Text style={{ marginHorizontal: scale(7), alignSelf: "center" }} semiBold size={6} color={colors.TextGray}>{item.productType.name}</Text>
                    </View>
                    {item.quantity==0 ? <View style={{ alignContent: "stretch", alignItems: "center", justifyContent: "center", alignSelf: "center", marginHorizontal: scale(0), backgroundColor: "red", padding: scale(2), borderRadius: scale(20), width: scaledWidth(50) }} >
                        <Text size={scale(5.5)} semiBold color={colors.Whitebackground}>{t("available")}</Text>
                    </View> : null}
                </View>
            </View>
            <TouchableOpacity onPress={
                /*() => { loved ? setLoved(false) : setLoved(true); props.method }*/
                () => {
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
                }
            } style={{ alignContent: "flex-start", height: scaledWidth(26), }}  >
                <Image source={loved ? Images.Loved : Images.Heart} noLoad equalSize={7} />
            </TouchableOpacity>
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

export default connect(mapStateToProps)(ProductContainerHorizontal);

