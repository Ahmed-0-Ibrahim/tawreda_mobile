import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, FlatList, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useSelector } from 'react-redux';
import { TabBar } from '../../Components/TabBar';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Header } from '../../Components/Header';
import { Text } from '../../Components/Text';
import colors from '../../Utils/colors';
import { Empty } from '../../Components/Empty';
import { Icon } from '../../Components/Icon';
import { useTranslation } from "react-i18next";
import { Input } from '../../Components/Input';
import { scale, scaledWidth, scaledHeight, responsiveFontSize } from "../../Utils/responsiveUtils";
import { CartItem } from "./CartItem";
import { Button } from '../../Components/Button';
import Navigation from "../../Utils/Navigation";
import defaultStyles from '../../Utils/defaultStyles';
import { confirmPromoCodeApi, getAddress } from '../../Utils/api';
import { MadelLogin } from '../../Components/ModelLogin';
import Images from '../../Assets/Images';
import { store } from '../../Redux/store';
export default Cart = (props) => {
    const company = useSelector(state => state.auth.company);
    const rtl = useSelector(state => state.auth.rtl)
    const limit = useSelector(state => state.auth.company);
    const delivery = useSelector(state => state.auth.company.transportationPrice);
    const { t, i18n } = useTranslation();
    const products = useSelector(state => state.cart.products);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => { setIsEnabled(previousState => !previousState); caldis();  }
    const [on, setOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [promoText, setPromoText] = useState();
    const [promoError, setPromoError] = useState(false);
    const [openStorage, setopenStorage] = useState(company.openStorage);
    const [promoCode, setPromoCode] = useState();
    const [totalPrice, setPrice] = useState(0)
    const [totalDiscount, setDiscount] = useState(0)
    const [totalDiscountinvestoryPrice, setDiscountinvestoryPrice] = useState(0)
    const [investoryPrice, setinvestoryPrice] = useState(0)
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [addresslocatio, setAddresslocatio] = useState();
    const { user1, } = useSelector((state) => ({
        user1: state.auth.user,
    }));
    const getCartonCount = () => {
        console.log("staaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", limit)
        let cartons = 0;
        products.map((item, index) => {
            cartons += item.quantity;
        });
        return cartons;
    }

    const getAddressFromAPI = (id) => {
        setLoadingAddress(true);
        // setError(false);
        console.log("ID AHAME::::Adrrrrrrrrrr ", id);
        getAddress(id).then(res => {
            console.log("RES::::Adrrrrrrrrrrrrr ", res);
            setAddresslocatio(res);
            setLoadingAddress(false);

            // setError(false);
        }).catch(error => {
            console.log("ERROR::: ", error);
            // setError(true);
            setLoadingAddress(false);
        })
    }

    const getReceiptData = () => {
        let prices = 0;
        let investorPriceprices = 0;
        products.map((item, index) => {
            let price = 0
            let investorprice = 0
            if (item.product.offer) {
                price = item.product.price - (item.product.price * (item.product.offer / 100));
            }
            else {
                price = item.product.price;
                investorprice = item.product.investorPrice
            }
            prices += (price * item.quantity);
            investorPriceprices += (investorprice * item.quantity);
        });
        setPrice(prices);
        setinvestoryPrice(investorPriceprices);
    }

    useEffect(() => {
        // getAddressFromAPI(user1.id)
        console.log("company",company.openStorage)
        getCartonCount();
        getReceiptData();
    }, [products]);

    useEffect(() => {
        getAddressFromAPI(user1.id)
    }, []);


    useEffect(() => {
        calculatePromoCode(promoCode);
    }, [totalPrice]);

    const calculatePromoCode = (promo) => {
        if (!promo) {
            return;
        }
        let discount = 0;
        if (promo.promoCodeType === 'RATIO') {
            discount = (totalPrice * (promo.discount / 100));
        }
        else {
            discount = promo.discount;
        }
        setDiscount(Math.ceil(discount));
    }

    const applyPromoCode = () => {
        setLoading(true);
        confirmPromoCodeApi(promoText).then(res => {
            console.log("RESULT promoooooooooooo:::: ", res);
            setPromoCode(res);
            calculatePromoCode(res);
            setLoading(false);
            Navigation.showOverlay(t('promoActivated'));
        }).catch(error => {
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }
    const caldis = () => {
        isEnabled ? setDiscountinvestoryPrice(0) : setDiscountinvestoryPrice(totalPrice - investoryPrice)
    }

    return (

        <View style={{ flex: 1, backgroundColor: colors.bgS, }}>
            <Header title={t('myCart')} style={{ backgroundColor: colors.grayBackgroung }} back />
            {!loadingAddress && addresslocatio ? <View style={{ flex: 1, marginHorizontal: scale(10) }}>
                {products.length !== 0 ?
                    <View style={{ flex: 1 }}>

                        <FlatList keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: scaledHeight(15) }} data={products}
                            renderItem={({ item }, index) => (
                                <CartItem item={item.product} quantity={item.quantity} isInvestor={isEnabled} />)}
                            removeClippedSubviews={false}
                            ListHeaderComponent={
                                <View>
                                    {!totalDiscount ?
                                        // <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                                        //     setOn(!on)
                                        // }} >
                                            <Tooltip
                                            isVisible={on}
                                            placement='bottom'
                                            animationDuration={2}
                                            animationType="spring"
                                            onClose={() => setOn(false)}
                                            content={<Text>{t('Invest')}</Text>}
                                        >
                                            {company.openStorage?
                                                <View style={{
                                                flexDirection: "row",
                                                marginVertical: scale(10),
                                                justifyContent: 'space-between', alignItems: 'center'
                                            }}>
                                                <View style={{ width: scaledWidth(15), height: scaledHeight(8), backgroundColor: '#1B3862', justifyContent: 'center', alignItems: 'center', borderRadius: scale(10), }}>
                                                    <Image source={Images.profileBox} style={{ width: scale(35), height: scale(35) }} />
                                                </View>

                                                <View style={{ backgroundColor: '#F5F6FA', height: scaledHeight(8), width: scaledWidth(78), borderRadius: scale(10), flexDirection: rtl ? "row-reverse" : "row", justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: scale(10) }}>
                                                    <View style={{}}>
                                                        <View style={{ flexDirection: rtl ? "row" : "row-reverse", alignItems: 'center', justifyContent: 'center' }}>
                                                            <View>
                                                                <TouchableOpacity activeOpacity={0.8} style={{
                                                                    marginHorizontal: scale(5),
                                                                    paddingHorizontal: scale(6), color: "#CA944B", backgroundColor: '#CA944B',
                                                                    borderRadius: scale(25),
                                                                    // shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.5,
                                                                    width: scaledWidth(5),
                                                                    height: scaledWidth(5),
                                                                    // shadowRadius: scale(25),
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    // shadowOffset: { width: 0, height: 4 }
                                                                }} onPress={() => {
                                                                    setOn(!on)
                                                                }}>
                                                                    <Icon name="info" type="Fontisto" size={5} color={'#ffffff'} /*reverse*/ />
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View>
                                                                <Text semiBold color={'#1B3862'} >{t('supscrube')}</Text>
                                                            </View>

                                                        </View>
                                                        <Text color={'#CA944B'}>{t('storetime')}</Text>
                                                    </View>
                                                    <View style={{ width: scaledWidth(14), height: scaledHeight(4), backgroundColor: isEnabled ? "rgba(52, 168, 83, 0.28)" : "#72727234", borderRadius: scale(20), alignItems: 'center', justifyContent: 'center' }}
                                                    ><Switch
                                                            trackColor={{ false: "#00000000", true: "#00000000" }}
                                                            thumbColor={isEnabled ? "rgba(52, 168, 83, 1)" : "#FFFFFF"}
                                                            ios_backgroundColor="#3e3e3e"
                                                            onValueChange={toggleSwitch}
                                                            value={isEnabled} />
                                                    </View>
                                                </View>

                                            </View>:null}
                                        </Tooltip>
                                        // </TouchableOpacity>
                                        : null}

                                    {!isEnabled ? <View style={{
                                        flexDirection: 'row',
                                        marginVertical: scale(10),
                                        justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <View style={{ width: scaledWidth(15), height: scaledHeight(8), backgroundColor: '#CA944B', justifyContent: 'center', alignItems: 'center', borderRadius: scale(10), }}>
                                            <Image source={Images.loc} style={{ width: scale(25), height: scale(32) }} />
                                        </View>

                                        <View style={{ paddingHorizontal: scale(10), justifyContent: 'space-between', backgroundColor: '#F5F6FA', height: scaledHeight(8), width: scaledWidth(78), borderRadius: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{}}>
                                                <Text semiBold color={'#1B3862'} >{t('address')}</Text>
                                                <Text color={'#8F959E'}>{addresslocatio.length == 0 ? t("noAddress") : addresslocatio[0].address}</Text>
                                            </View>
                                            <TouchableOpacity activeOpacity={0.8} style={{
                                                paddingHorizontal: scale(6), color: "white", backgroundColor: colors.Whitebackground,
                                                borderRadius: scale(25),
                                                // shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.5,
                                                width: scaledWidth(10),
                                                height: scaledWidth(10),
                                                // shadowRadius: scale(25),
                                                alignContent: "center",
                                                justifyContent: "center",
                                                // shadowOffset: { width: 0, height: 4 }
                                            }} onPress={() => {
                                                addresslocatio.length == 0 ?
                                                    Navigation.push({
                                                        name: 'AddAdress',
                                                    })
                                                    :
                                                    Navigation.push({
                                                        name: 'EditeProfile',
                                                        passProps: {
                                                            address: true, updateAddress: () => {
                                                                getAddressFromAPI(user1.id)
                                                            }
                                                        }
                                                    })
                                            }}>
                                                <Icon name={addresslocatio.length == 0 ? "add" : "mode-edit"} type="MaterialIcons" size={11} color={'#8F959E'} reverse />
                                            </TouchableOpacity>
                                        </View>

                                    </View> : null}
                                    <View style={{ backgroundColor: '#E1E1E1', width: scaledWidth(90), height: 1, alignSelf: 'center', marginVertical: scale(5) }} />

                                </View>
                            }
                            ListFooterComponent={
                                <View>
                                    <View style={{ backgroundColor: '#E1E1E1', width: scaledWidth(90), height: 1, alignSelf: 'center', marginVertical: scale(5) }} />
                                    {!isEnabled ?
                                        <View style={{ flexDirection: "row", alignSelf: 'stretch', paddingVertical: scale(15), alignItems: "center", alignItems: "center", justifyContent: "space-between", backgroundColor: '#ffffff', marginHorizontal: scale(10) }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center", backgroundColor: '#F5F6FA', borderRadius: scale(10), height: scale(50), padding: scale(7) }}>
                                                <Icon size={10} type={"AntDesign"} name={"tag"} color={'#1B3862'} />
                                                <Input containerStyle={{ alignContent: "center", borderRadius: scale(10), backgroundColor: '#F5F6FA', marginHorizontal: scale(5), width: scaledWidth(60), height: scale(50), justifyContent: "center", alignSelf: "center", alignItems: "center" }}
                                                    style={{ alignContent: "center", backgroundColor: '#F5F6FA', justifyContent: "center", alignSelf: "center", alignItems: "center" }}
                                                    placeholder={t('Discountcode')}
                                                    onChangeText={(text) => {
                                                        setPromoText(text);
                                                        if (text) {
                                                            setPromoError(false);
                                                        }
                                                    }}
                                                    onPress={() => {
                                                        setTextHolder("");
                                                    }}
                                                    inputStyle={{ borderRadius: scale(10), paddingHorizontal: scale(4), backgroundColor: '#F5F6FA', height: scale(50), justifyContent: "center" }} />
                                            </View>


                                            <Button disabled={totalDiscount ? true : false} loading={loading} style={{ backgroundColor: totalDiscount ? "#DDDDDD" : colors.highlight, borderRadius: scale(10), width: scale(50), height: scale(50), justifyContent: "center", alignContent: "center", alignItems: "center", }}
                                                onPress={() => {
                                                    if (!store.getState().auth.token) {
                                                        setServiceModalVisible(true);
                                                    }
                                                    else {
                                                        if (!promoText) {
                                                            setPromoError(true);
                                                        }
                                                        else {
                                                            applyPromoCode();
                                                        }
                                                    }
                                                }}
                                            >
                                                <Icon size={13} type={"AntDesign"} name={"check"} color={totalDiscount ? "#A6A6A6" : colors.Whitebackground} />
                                            </Button>
                                        </View> : null}
                                    {totalDiscount ?
                                        <Text color={'#CA944B'} size={7}>{t('codedone1') + totalDiscount + t('codedone2')}</Text> : null
                                    }
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: scale(10) }}>
                                        <Text color={'#1B3862'} semiBold size={7}>{t('price')}</Text>
                                        <Text color={'#1B3862'} semiBold size={6.5} >{totalPrice} {t('pound')}</Text>
                                    </View>
                                    {!isEnabled ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text color={'#1B3862'} semiBold size={7}>{t('delivry')}</Text>
                                        <Text color={'#1B3862'} semiBold size={6.5} >{delivery ? delivery : 0} {t('pound')}</Text>
                                    </View> : null}
                                    {totalDiscount || totalDiscountinvestoryPrice? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text color={'#1B3862'} semiBold size={7}>{t('Discount')}</Text>
                                        {totalDiscount ? <Text color={'#1B3862'} semiBold size={6.5} >-{totalDiscount} {t('pound')}</Text> : null}
                                        {totalDiscountinvestoryPrice ? <Text color={'#1B3862'} semiBold size={6.5} >-{totalDiscountinvestoryPrice} {t('pound')}</Text> : null}
                                    </View> : null}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text color={'#CA944B'} bold size={7}>{t('total')}</Text>
                                        <Text color={'#CA944B'} bold size={6.5} >{!isEnabled ? totalPrice + parseFloat(delivery ? delivery : 0) - totalDiscount : totalPrice -totalDiscountinvestoryPrice} {t('pound')}</Text>
                                    </View>




                                    <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(70), marginBottom: scale(5) }}>

                                        <Button title={t('confirmorder')} size={7} elevation={3} style={{
                                            alignSelf: 'stretch', paddingVertical: scale(15), paddingHorizontal: scale(30)

                                        }} bold radius={28} color="white"
                                            backgroundColor={colors.MainBlue}
                                            onPress={() => {
                                                if (!store.getState().auth.token) {
                                                    setServiceModalVisible(true);
                                                } else if (addresslocatio.length == 0 && !isEnabled) {
                                                    Navigation.showOverlay(t("noAddress"))
                                                }
                                                else {
                                                    Navigation.push({
                                                        name: 'Pay', options: {
                                                            statusBar: {
                                                                backgroundColor: '##F5F6FA'
                                                            }
                                                        }, passProps: { address: addresslocatio, investoryPrice: investoryPrice, totalPrice: totalPrice, totalDiscountinvestoryPrice: totalDiscountinvestoryPrice, totalDiscount: totalDiscount, total: !isEnabled ? totalPrice + parseFloat(delivery) - totalDiscount : totalPrice - totalDiscountinvestoryPrice, promoCode: promoCode, delivery: delivery, isEnabled: isEnabled }
                                                    });
                                                }
                                            }} />
                                    </View>

                                    {/* <Button elevation={2} onPress={() => {
                                        Navigation.push({
                                            name: 'Pay', options: {
                                                statusBar: {
                                                    backgroundColor: '#F5DCDE'
                                                }
                                            }, passProps: { totalPrice: totalPrice, totalDiscount: totalDiscount, total: parseFloat(totalPrice - totalDiscount).toFixed(2), promoCode: promoCode }
                                        });
                                    }} linear title={t("Placeorder")} bold size={8.5} color={colors.Whitebackground}
                                        style={{ paddingVertical: scale(10), marginHorizontal: scale(5), marginTop: scale(25) }} radius={30} /> */}
                                </View>
                            }
                        />
                    </View> : <View style={{ flex: 1, paddingBottom: scaledHeight(15) }}><Empty /></View>
                }
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
            </View>
                : null}
        </View>
    );
}   