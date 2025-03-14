import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TabBar } from '../../Components//TabBar';
import { Header } from '../../Components/Header';
import { Text } from '../../Components/Text';
import { Empty } from '../../Components/Empty';
import { Icon } from '../../Components/Icon';
import { useTranslation } from "react-i18next";
import { Input } from '../../Components/Input';
import { scale, scaledWidth, scaledHeight, responsiveFontSize } from "../../Utils/responsiveUtils";
import { Button } from '../../Components/Button';
import { PayMethod } from './PayMethod';
import colors from '../../Utils/colors';
import Images from '../../Assets/Images';
import Navigation from "../../Utils/Navigation"
import WarningModal from '../../Components/WarningModal';
import defaultStyles from '../../Utils/defaultStyles';
import { orderApi, getAddress } from '../../Utils/api';
import { CartItem } from '../Cart/CartItem';
import { refresh } from '../../Redux/list';
import { clearCart, removeCartFromStorage, setCartToStorage } from '../../Redux/cart';
import { store } from '../../Redux/store';
export default Pay = (props) => {
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const { t, i18n } = useTranslation();
    const { user, } = useSelector((state) => ({
        user: state.auth.user,
    }));
    const [checkedCash, setCheckedCash] = React.useState(false);
    const [checkedWallet, setCheckedWallet] = React.useState(false);
    const [checkedCredit, setCheckedCredit] = React.useState(false);
    const [checkedE_wallets, setCheckedE_wallets] = React.useState(false);
    const [address, setAddress] = useState();
    const [loading, setLoading] = useState(false);
    const products = useSelector(state => state.cart.products);
    const dispatch = useDispatch();
    const [phone, setphone] = useState('');
    const [isEnabled, setIsEnabled] = useState(props.isEnabled);
    const [totalPrice, setPrice] = useState(props.totalPrice)
    const [totalPriceAfterdiscount, settotal] = useState(props.total)
    const [promoText, setPromoText] = useState();
    const [delevry, setdelevry] = useState(props.delivery)
    const [promoError, setPromoError] = useState(false);
    const [promoCode, setPromoCode] = useState(props.promoCode);
    const [totalDiscount, setDiscount] = useState(props.totalDiscount)
    const [totalDiscountinvestoryPrice, setDiscountinvestoryPrice] = useState(props.totalDiscountinvestoryPrice)
    const [investoryPrice, setinvestoryPrice] = useState(props.investoryPrice)
    const regex = /^\d{11}$/;
    // setPrice(props.totalPrice)
    useEffect(() => {
        getReceiptData();
        getAddressFromAPI(user.id)
    }, [products]);
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
        setDiscount(discount);
    }

    const getAddressFromAPI = (id) => {
        setLoading(true);
        // setError(false);
        console.log("ID AHAME::::Adrrrrrrrrrr ", id);
        getAddress(id).then(res => {
            console.log("RES::::Adrrrrrrrrrrrrr ", res);
            setAddress(res);
            setLoading(false);
            // setError(false);
        }).catch(error => {
            console.log("ERROR::: ", error);
            // setError(true);
            setLoading(false);
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
    const onDone = () => {
        dispatch(refresh('orderList'));
        dispatch(clearCart());
        removeCartFromStorage();
        Navigation.popToRoot('Home');
        let index = i18n.language === 'ar' ? 1 : 2;
        setTimeout(() => {
            // Navigation.mergeOptions(Navigation.bottomTabsID, {
            //     bottomTabs: {
            //         currentTabIndex: index,
            //     }
            // });
            // Navigation.currentTabIndex = index;
            Navigation.push({
                name: 'ConfirmOrder', options: {
                    statusBar: {
                        backgroundColor: colors.animationColor
                        ,
                    }
                }, passProps: { isInvestor: props.isEnabled }
            });
        }, 100);
    }
    const paymethod = () => {
        setLoading(true);
        let order = {};
        let orderProducts = [];
        products.map((item) => {
            orderProducts.push({ product: item.id, quantity: item.quantity });
        });
        order.paymentMethod = checkedCash ? 'CASH' : checkedWallet ? 'WALLET' : checkedCredit ? 'VISA_MASTERCARD' : "ELECTRONIC_WALLET";
        order.products = orderProducts;
        if (props.promoCode) {
            order.promoCode = props.promoCode.id;
        }
        order.type = props.isEnabled ? "STORAGE" : "NORMAL"
        if (!props.isEnabled) {
            order.address = Array.isArray(address) ? Object.assign({}, ...address).id : address.id
        }
        console.log("ordeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer", order)
        orderApi(order).then(res => {
            console.log("cresittttttttttttttttttttt", res)
            setLoading(false);
            // if (order.paymentMethod=="VISA_MASTERCARD"||order.paymentMethod=="ELECTRONIC_WALLET"){
            //     Navigation.push({
            //         name: 'PaymentVisa', options: {
            //             statusBar: {
            //                 backgroundColor: colors.animationColor,
            //                 // style: 'light'
            //             },
            //             passProps:{res:res}
            //         }
            //     });
            // }
            dispatch(refresh('orderList'));
            dispatch(clearCart());
            removeCartFromStorage();
            Navigation.popToRoot('Home');
            let index = i18n.language === 'ar' ? 1 : 2;
            setTimeout(() => {
                // Navigation.mergeOptions(Navigation.bottomTabsID, {
                //     bottomTabs: {
                //         currentTabIndex: index,
                //     }
                // });
                // Navigation.currentTabIndex = index;
                Navigation.push({
                    name: 'ConfirmOrder', options: {
                        statusBar: {
                            backgroundColor: colors.animationColor
                            ,
                        }
                    }, passProps: { isInvestor: props.isEnabled }
                });
            }, 100);
            // Navigation.showOverlay(t('orderSuccessfull'));
            // Navigation.push({
            //     name: 'ConfirmOrder', options: {
            //         statusBar: {
            //             backgroundColor: colors.animationColor
            //             ,
            //         }
            //     }, passProps: { totalPrice: totalPrice, totalDiscount: totalDiscount, total: parseFloat(totalPrice - totalDiscount).toFixed(2), promoCode: promoCode }
            // });
        }).catch(error => {
            console.log("ERRORR:::::: ", error);
            setLoading(false);
            error.data.errors == "noBalanceInWallet" ? Navigation.showOverlay(t(error.data.errors), 'fail') :
                Navigation.showOverlay(error.data.errors, 'fail');
        })
    }
    const paymethodByVisa = () => {
        setLoading(true);
        let order = {};
        let orderProducts = [];
        products.map((item) => {
            orderProducts.push({ product: item.id, quantity: item.quantity });
        });
        order.paymentMethod = checkedCredit ? 'VISA_MASTERCARD' : "ELECTRONIC_WALLET";
        order.products = orderProducts;
        if (props.promoCode) {
            order.promoCode = props.promoCode.id;
        }
        order.type = props.isEnabled ? "STORAGE" : "NORMAL"
        if (!props.isEnabled) {
            order.address = Array.isArray(address) ? Object.assign({}, ...address).id : address.id
        }
        if (checkedE_wallets) {
            order.paymentPhoneNumber = phone
        }
        console.log("ordeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer", order)
        orderApi(order).then(res => {
            console.log("cresittttttttttttttttttttt", res)
            setLoading(false);

            Navigation.push({
                name: 'PaymentVisa', options: {
                    statusBar: {
                        backgroundColor: '##F5F6FA'
                    }
                }, passProps: { res: res, onDone: () => { onDone() } }
            });

            // Navigation.push({
            //     name: 'PaymentVisa', options: {
            //         statusBar: {
            //             backgroundColor: colors.animationColor,
            //             style: 'light'
            //         },
            //         passProps: { res: res }
            //     }
            // });
            // dispatch(refresh('orderList'));
            // dispatch(clearCart());
            // removeCartFromStorage();
            // Navigation.popToRoot('Home');
            // let index = i18n.language === 'ar' ? 1 : 2;
            // setTimeout(() => {
            //     // Navigation.mergeOptions(Navigation.bottomTabsID, {
            //     //     bottomTabs: {
            //     //         currentTabIndex: index,
            //     //     }
            //     // });
            //     // Navigation.currentTabIndex = index;
            //     Navigation.push({
            //         name: 'ConfirmOrder', options: {
            //             statusBar: {
            //                 backgroundColor: colors.animationColor
            //                 ,
            //             }
            //         },
            //     });
            // }, 100);
            // Navigation.showOverlay(t('orderSuccessfull'));
            // Navigation.push({
            //     name: 'ConfirmOrder', options: {
            //         statusBar: {
            //             backgroundColor: colors.animationColor
            //             ,
            //         }
            //     }, passProps: { totalPrice: totalPrice, totalDiscount: totalDiscount, total: parseFloat(totalPrice - totalDiscount).toFixed(2), promoCode: promoCode }
            // });
        }).catch(error => {
            console.log("ERRORR:::::: ", error);
            setLoading(false);
            error.data.errors == "noBalanceInWallet" ? Navigation.showOverlay(t(error.data.errors), 'fail') :
                Navigation.showOverlay(error.data.errors, 'fail');
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bgS, }}>
            <Header style={{ paddingBottom: scale(5), backgroundColor: '#F5F6FA' }} back title={t('confirmorder')} />
            <View style={{ flex: 1, padding: scale(10) }}>

                <FlatList keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: scaledHeight(15) }} data={products}
                    renderItem={({ item }, index) => (
                        <CartItem item={item.product} quantity={item.quantity} isInvestor={props.isEnabled} />)}
                    removeClippedSubviews={false}
                    ListHeaderComponent={
                        <View>

                            {!props.isEnabled ? <Text bold color={'#1B3862'} >{t('address')}</Text> : null}
                            {!props.isEnabled ? <View style={{
                                flexDirection: 'row',
                                marginVertical: scale(10),
                                justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <View style={{ paddingHorizontal: scale(10), justifyContent: 'space-between', backgroundColor: '#F5F6FA', height: scaledHeight(8), width: scaledWidth(95), borderRadius: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{}}>
                                        <Text color={'#8F959E'}>{props.address[0].address}</Text>
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
                                        Navigation.push({
                                            name: 'EditeProfile',
                                            passProps: { address: true }
                                        })
                                    }}>
                                        <Icon name="mode-edit" type="MaterialIcons" size={11} color={'#8F959E'} reverse />
                                    </TouchableOpacity>
                                </View>

                            </View> : <View style={{ backgroundColor: '#F5F6FA', height: scaledHeight(8), borderRadius: scale(10), flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: scale(10) }}>
                                <Text color={'#1B3862'}>{t('store')}</Text>
                                <Image source={Images.profileBox} style={{ width: scale(35), height: scale(35) }} />
                            </View>}

                            <Text bold color={'#1B3862'} >{t('products')}</Text>
                            {/* <View style={{ backgroundColor: '#E1E1E1', width: scaledWidth(90), height: 1, alignSelf: 'center', marginVertical: scale(5) }} /> */}

                        </View>
                    }
                    ListFooterComponent={
                        <View>
                            {/* <View style={{ flexDirection: "row", alignSelf: 'stretch', paddingVertical: scale(15), alignItems: "center", alignItems: "center", justifyContent: "space-between", backgroundColor: '#ffffff', marginHorizontal: scale(10) }}>
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
                                        
                                        
                                        <Button loading={loading} style={{ backgroundColor: colors.highlight, borderRadius: scale(10), width: scale(50), height: scale(50), justifyContent: "center", alignContent: "center", alignItems: "center", }}
                                        onPress={() => {
                                            if (!promoText) {
                                            setPromoError(true);
                                        }
                                        else {
                                            applyPromoCode();
                                        }
                                    }}
                                    >
                                    <Icon size={13} type={"AntDesign"} name={"check"} color={colors.Whitebackground} />
                                    </Button>
                                </View> */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: scale(10) }}>
                                <Text color={'#1B3862'} bold size={7}>{t('price')}</Text>
                                <Text color={'#1B3862'} bold size={6.5} >{totalPrice} {t('pound')}</Text>
                            </View>
                            {!props.isEnabled ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text color={'#1B3862'} bold size={7}>{t('delivry')}</Text>
                                <Text color={'#1B3862'} bold size={6.5} >{delevry ? delevry : 0} {t('pound')}</Text>
                            </View> : null}
                            {totalDiscount || totalDiscountinvestoryPrice ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text color={'#1B3862'} bold size={7}>{t('Discount')}</Text>
                                {totalDiscount ? <Text color={'#1B3862'} bold size={6.5} >{totalDiscount} {t('pound')}</Text> : null}
                                {totalDiscountinvestoryPrice ? <Text color={'#1B3862'} bold size={6.5} >{totalDiscountinvestoryPrice} {t('pound')}</Text> : null}
                            </View> : null}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text color={'#CA944B'} bold size={7}>{t('total')}</Text>
                                <Text color={'#CA944B'} bold size={6.5} >{!props.isEnabled ? totalPrice + delevry - totalDiscount : totalPrice - totalDiscountinvestoryPrice} {t('pound')}</Text>
                            </View>


                            <View style={{ backgroundColor: '#E1E1E1', width: scaledWidth(90), height: 1, alignSelf: 'center', marginVertical: scale(5) }} />

                            <Text bold style={{ marginVertical: scale(5), }} color={'#1B3862'} >{t('chossepmethod')}</Text>


                            {!props.isEnabled ? <PayMethod uri={require('../../Assets/paymentmethod.png')} text={t('cash')} checked={checkedCash} setChecked={setCheckedCash} setChecked1={setCheckedCredit} setChecked2={setCheckedWallet} setChecked3={setCheckedE_wallets} /> : null}
                            <PayMethod uri={require('../../Assets/Profile/wallet.png')} text={t('wallet')} wallet checked={checkedWallet} setChecked={setCheckedWallet} setChecked1={setCheckedCredit} setChecked2={setCheckedCash} setChecked3={setCheckedE_wallets} />
                            <PayMethod uri={require('../../Assets/debitcard.png')} text={t('Creditcard')} checked={checkedCredit} setChecked={setCheckedCredit} setChecked1={setCheckedCash} setChecked2={setCheckedWallet} setChecked3={setCheckedE_wallets} />
                            {!props.isEnabled ? <PayMethod uri={require('../../Assets/smartphone.png')} text={t('wallets')} checked={checkedE_wallets} setChecked={setCheckedE_wallets} setChecked1={setCheckedCash} setChecked2={setCheckedWallet} setChecked3={setCheckedCredit} /> : null}

                            {checkedE_wallets ?
                                <Input {...props} name="phone" onChangeText={newText => setphone(newText)} containerStyle={{ height: scaledHeight(7.5), backgroundColor: '#E3E3E3', alignItems: 'center', justifyContent: 'center', borderColor: '#F5F6FA', borderWidth: 1, paddingHorizontal: scale(5) }} placeholder={t("enterphone")}
                                    style={{ paddingTop: 0, paddingBottom: 0, backgroundColor: '#E3E3E3' }} inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                /> : null

                            }
                            <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(70), marginBottom: scale(5) }}>

                                <Button loading={loading} title={t('confirmpayment')} size={7} elevation={3} /*disabled={true}*/ style={{
                                    alignSelf: 'stretch', paddingVertical: scale(15), paddingHorizontal: scale(30)

                                }} bold radius={28} color="white"
                                    backgroundColor={colors.MainBlue}
                                    onPress={() => {
                                        if (!store.getState().auth.token) {
                                            Navigation.push({
                                                name: 'Login', options: {
                                                    statusBar: {
                                                        backgroundColor: colors.animationColor,
                                                        style: 'light'
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            if (checkedCash || checkedWallet /*|| checkedCredit || checkedE_wallets*/) {
                                                paymethod();
                                                // Navigation.push({
                                                //     name: 'ConfirmOrder', options: {
                                                //         statusBar: {
                                                //             backgroundColor: colors.animationColor
                                                //             ,
                                                //         }
                                                //     }, passProps: { totalPrice: totalPrice, totalDiscount: totalDiscount, total: parseFloat(totalPrice - totalDiscount).toFixed(2), promoCode: promoCode }
                                                // });
                                            }
                                            else if (checkedCredit /*|| checkedE_wallets*/) {
                                                paymethodByVisa()
                                            }
                                            else if (checkedE_wallets) {
                                                if (regex.test(phone) && phone.length === 11) {
                                                    paymethodByVisa()
                                                }
                                                else {
                                                    Navigation.showOverlay(t("phonewallet"))
                                                }
                                            }
                                            else {
                                                Navigation.showOverlay(t('chossepmethod'), 'fail')
                                            }
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
            </View>

            {/* <View style={{ padding: scale(10), }}>
                <Text color={"#1B3862"} size={8} bold style={{ marginBottom: scale(10), }}>{t('address')}</Text>

                <PayMethod uri={require('../../Assets/loan.png')} text={t('cash')} checked={checkedCash} setChecked={setCheckedCash} setChecked1={setCheckedCredit} setChecked2={setCheckedWallet} />
                <PayMethod uri={require('../../Assets/wallet.png')} text={t('wallet')} wallet checked={checkedWallet} setChecked={setCheckedWallet} setChecked1={setCheckedCredit} setChecked2={setCheckedCash} />
                <PayMethod uri={require('../../Assets/creditcard.png')} text={t('Creditcard')} checked={checkedCredit} setChecked={setCheckedCredit} setChecked1={setCheckedCash} setChecked2={setCheckedWallet} />

                <View style={{ alignSelf: 'stretch', borderBottomWidth: 1, borderBottomColor: 'rgba(105, 105, 105, 0.15)' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: scale(10) }}>
                    <Text color={'#230A06'} semiBold size={7}>{t('Productsprice')}</Text>
                    <Text color={'#230A06'} semiBold size={6.5} >{props.totalPrice} {t('currency')}</Text>
                </View>
                {props.totalDiscount ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text color={'#230A06'} semiBold size={7}>{t('Discountprice')}</Text>
                    <Text color={'#230A06'} semiBold size={6.5} >{props.totalDiscount} {t('currency')}</Text>
                </View> : null}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text color={'#ED243C'} bold size={7}>{t('total')}</Text>
                    <Text color={'#ED243C'} bold size={6.5} >{props.total} {t('currency')}</Text>
                </View>

                <Button loading={loading} onPress={() => {
                    if (checkedCash || checkedCredit || checkedWallet) {
                        if (checkedCredit || checkedWallet) {
                            setServiceModalVisible(true);
                        }
                        else {
                            pay();
                        }
                    }
                    else{
                        Navigation.showOverlay(t('chossepmethod'),'fail')
                    }
                }} elevation={2} linear title={t("confirm")} bold size={9} color={colors.Whitebackground} 
                style={{ paddingVertical: scale(10), marginHorizontal: scale(5), marginVertical: scale(20) }} radius={30} />
                <WarningModal visible={serviceModalVisible} dismiss={() => {
                    setServiceModalVisible(false);
                }} />
            </View> */}
        </View>
    )
}