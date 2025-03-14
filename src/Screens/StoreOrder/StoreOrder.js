import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, I18nManager, Dimensions, ScrollView, FlatList, PermissionsAndroid, Platform, Linking, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../Utils/colors';
import { Text } from '../../Components/Text';
import { setLang, setLangStorage } from '../../Redux/lang';
import RNRestart from 'react-native-restart';
import { Header } from '../../Components/Header';
import { Icon } from '../../Components/Icon';
import { Button } from '../../Components/Button';
import { OrderProductDetailsCart } from '../OrderDetails/OrderProductDetailsCart';
import { scale, scaledHeight, scaledWidth } from '../../Utils/responsiveUtils';
import { Image } from '../../Components/Image';
import Images from '../../Assets/Images';
import moment from 'moment';
import defaultStyles from '../../Utils/defaultStyles';
import { cancelOrderApi, getOrderDetailsApi, getOrderReceiptApi, SellOrderApi } from '../../Utils/api';
import { LottieLoading } from '../../Components/LottieLoading';
import Navigation from '../../Utils/Navigation';
import { refresh } from '../../Redux/list';
import ReactNativeBlobUtil from 'react-native-blob-util'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import OrderModel from '../Tabs/Orders/Modal'
import { source } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';
export default StoreOrder = (props) => {
    const dispatch = useDispatch();
    const { rtl, orderList, token } = useSelector(state => ({
        rtl: state.lang.rtl,
        orderList: state.list.orderList,
        token: state.auth.token,
    }));
    const { t, i18n } = useTranslation();
    const [order, setOrder] = useState();
    const [orders, setOrders] = useState([]);
    const [days, setDays] = useState();
    const [soldorder, setsoldorder] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [loadingReceipt, setLoadingReceipt] = useState(false);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [totalPrice, setPrice] = useState(0)
    const [investoryPrice, setinvestoryPrice] = useState(0)
    const [updatedItem, setUpdatedItem] = useState('');
    const currentDate = moment();

    useEffect(() => {
        getOrder();
    }, [orderList]);

    useEffect(() => {
        console.log('orders orders orders', orders)
    }, [orders])
    useEffect(() => {
        if (days <= 0 && order.status === 'ACCEPTED') {
            SeellOrder()
        }
    }, [days]); 

    const getOrder = () => {
        setLoading(true);
        let items = []
        getOrderDetailsApi(props.id).then(res => {
            console.log("RES::: ", res);
            setOrder(res);
            setDays(30 - (moment(currentDate).diff(res.createdAt, 'days')));
            res.products.map((item) => {
                console.log('item.product.item.product.',item)
                items.push({ product: item.product.id, quantity:item.quantity===0?0: 1 });
            });
            setOrders([...items])
            console.log("RES:::products ", orders);
            console.log("RES:::items ", items);
            console.log("dayyyyyyyyyyyyyyyyyyyscurrentDate", currentDate)
            console.log("dayyyyyyyyyyyyyyyyyyysres.createdAt", res.createdAt)
            console.log("dayyyyyyyyyyyyyyyyyyys", moment(res.createdAt).diff(currentDate, 'days'))
            setLoading(false);

        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }

    const updateListItem = (itemId, updatedquantity) => {
        console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", orders)
        console.log("dddddddddddddddddddddddd", itemId, updatedquantity)
        const updatedList = orders.map((item, index) => {
            console.log("item.product", item.product)

            if (item.product == itemId) {
                console.log("in if", { ...item, quantity: updatedquantity })
                return { ...item, quantity: updatedquantity };
            }
            return item;
        });
        setOrders(updatedList);
        setUpdatedItem('');
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", orders)
    }


    const SeellOrder = () => {
        setLoading(true);
        console.log("aaaaaaaaaaaaaainsellllllllaaaaaaaaaaaaaaaaaaaaaaaaaa", orders)
        let orderProducts = [];
        // order.products.map((item) => {
        //     orderProducts.push({ product: item.id, quantity: item.quantity });
        // });
        SellOrderApi({ order: props.id, products: orders }).then(res => {
            console.log("RES sellllll::: ", res);
            setsoldorder(res);
            setLoading(false);
            getOrder()
            dispatch(refresh('orderstorage'));
            Navigation.showOverlay(t("sold"))
            setTimeout(() => {
                Navigation.pop();
            }, 100);

            // setOrders(null);
        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }

    const getQuantity = () => {
        let quantity = 0;
        order.products.map((item) => {
            quantity += item.quantity;
        });
        return quantity;
    }

    const cancelOrder = () => {
        setLoadingCancel(true);
        cancelOrderApi(props.id).then(res => {
            dispatch(refresh('orderList'));
            setLoadingCancel(false);
            getOrder();
            // Navigation.pop();
            Navigation.showOverlay(t('cancelOrderSuccess'));
        }).catch(error => {
            setLoadingCancel(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    const downloadInvoice = () => {
        setLoadingReceipt(true);
        getOrderReceiptApi(props.id).then(async res => {
            let options = {
                html: res.template,
                fileName: `invoice-${order.orderNumber}`,
                directory: 'Documents',
            };
            Navigation.showOverlay(t('downloading'));
            let file = await RNHTMLtoPDF.convert(options);
            console.log("FILE PATH::: ", file);
            if (Platform.OS === 'android') {
                const android = ReactNativeBlobUtil.android;
                android.actionViewIntent(file.filePath);
            }
            else {
                try {
                    ReactNativeBlobUtil.ios.openDocument(file.filePath);
                }
                catch (error) {
                    console.log("ERROR OPEN FILE:::: ", error);
                }
            }
            setLoadingReceipt(false);
        }).catch(error => {
            console.log("ERROR:::: ", error);
            setLoadingReceipt(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    const getdis = () => {
        let prices = 0;
        let investorPriceprices = 0;
        order.products.map((item, index) => {
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
        // setPrice(prices);
        // setinvestoryPrice(investorPriceprices);
        let total = prices - investorPriceprices
        return total;
    }
    const before = () => {
        let prices = 0;
        let investorPriceprices = 0;
        order.products.map((item, index) => {
            let price = 0
            let investorprice = 0
            // if (item.product.offer) {
            //     price = item.product.price - (item.product.price * (item.product.offer / 100));
            // }
            // else {
            price = item.product.price;
            investorprice = item.product.investorPrice
            // }
            prices += (price * item.quantity);
            investorPriceprices += (investorprice * item.quantity);
        });
        // setPrice(prices);
        // setinvestoryPrice(investorPriceprices);
        let total = prices
        return total;
    }

    const checkPermission = () => {
        PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]).then(res => {
            console.log("RES::::: ", res);
            if (res['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' && res['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                downloadInvoice();
            }
        }).catch(error => {
            console.log("ERROR:::: ", error);
        })
    }




    return (
        <View style={{ flex: 1, backgroundColor: colors.bgS }}>
            <Header back title={t("Order_details")} style={{ backgroundColor: colors.grayBackgroung }} />
            {!loading && order ? <View style={{ backgroundColor: colors.grayBackgroung, alignItems: 'center', marginTop: scale(-10) }}>
                <Text> {t('ordernumber') + " : " + order.orderNumber}</Text>
            </View> : null}
            {order && !error ? <ScrollView style={{ alignSelf: "stretch" }} showsVerticalScrollIndicator={false}>
                <View style={{
                    flexDirection: "row", alignSelf: "stretch", justifyContent: "space-between", backgroundColor: '#F5F6FA', paddingHorizontal: scale(8),
                    marginVertical: scale(10), marginHorizontal: scale(15), borderRadius: scale(15), elevation: 0, ...defaultStyles.elevationGame(0.5)
                }}>

                    <View style={{ paddingHorizontal: scale(10), paddingVertical: scale(18) }}>
                        <Text color={colors.Product2} size={5.5} style={{ marginTop: scale(-1) }}>{moment(order.createdAt).format('DD/MM/YYYY - hh:mmA')}</Text>
                        <View style={{ backgroundColor: colors.Whitebackground, alignItems: "center", borderRadius: 5, }}>
                            <Text style={{ alignSelf: "center", marginTop: scale(2) }} color={order.status === 'WAITING' ? colors.pending : order.status === 'ACCEPTED' ? colors.Finished : order.status === "CANCELED" ? colors.Cancel : "#CA944B"} size={6}>{order.status === "WAITING" ? t("workingOn") : order.status === "CANCELED" ? t("CANCELED") : order.status === "ACCEPTED" ? t("accept") : t('sold')} </Text>
                        </View>
                    </View>
                    {(order.status) === 'WAITING' ?
                        // <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'flex-end', justifyContent: 'center', marginHorizontal: scale(20) }}>
                        //     <Image source={Images.exit} equalSize={11} />
                        // </View> 
                        <TouchableOpacity onPress={() => {
                            setServiceModalVisible(true)
                        }} >
                            <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={Images.exit} equalSize={11} />
                            </View>
                        </TouchableOpacity>
                        : (order.status) === 'ACCEPTED' ?
                            <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'flex-end', justifyContent: 'center', marginHorizontal: scale(20) }}>
                                <View style={{ borderRadius: scale(6), borderColor: colors.highlight, borderWidth: scale(0.4), width: scaledWidth(11), height: scaledWidth(11), alignItems: 'center', justifyContent: 'center', backgroundColor: colors.Whitebackground }}>
                                    <Text color={colors.highlight} bold size={8}>{days < 0 ? 0 : days}</Text>
                                    <Text color={colors.Product2} size={5} style={{ marginTop: scale(-15) }}>{t("day")}</Text>
                                </View>
                            </View> : null
                    }
                </View>

                <View style={{ marginHorizontal: scale(15), backgroundColor: '#F5F6FA', height: scaledHeight(8), borderRadius: scale(10), flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: scale(15) }}>
                    <Text color={'#1B3862'}>{t('store')}</Text>
                    <Image source={Images.profileBox} style={{ width: scale(35), height: scale(35) }} />
                </View>
                <Text color={'#1B3862'} bold size={6} style={{ marginHorizontal: scale(18), marginTop: scale(6.5) }}>{t("quentity")} : {getQuantity()} </Text>
                <FlatList
                    refreshControl={<RefreshControl refreshing={loading && order.length > 0} onRefresh={() => {
                        getOrder(1);
                    }} />}
                    showsHorizontalScrollIndicator={false} data={order.products} renderItem={({ item }) => {
                        return <OrderProductDetailsCart days={days} update={(id, q) => { updateListItem(id, q) }} accept={order.status === 'ACCEPTED'} isInvestor={true} item={item} orders={orders} setOrders={() => { setOrders }} />
                    }} />
                <Text color={colors.Product2} bold size={6.5} style={{ marginHorizontal: scale(10), marginTop: scale(5), color: '#1B3862' }}>{t("Payment_method")} </Text>

                <View style={{
                    flexDirection: "row", justifyContent: "space-between", marginTop: scale(6), alignItems: "center", marginHorizontal: scale(10), paddingHorizontal: scale(10), paddingVertical: scale(10),
                    backgroundColor: 'white', borderRadius: scale(18), borderWidth: scale(1), borderColor: colors.Whitebackground
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                        <View style={{ backgroundColor: "white", width: scaledWidth(9), height: scaledWidth(9), borderRadius: scaledWidth(9) / 2, alignItems: "center", justifyContent: "center", marginStart: 5 }}><Image source={order.paymentMethod === "CASH" ? Images.CreditIcon : order.paymentMethod === "WALLET" ? Images.profileWallet : order.paymentMethod === "VISA_MASTERCARD" ? Images.debitcard : Images.smartphone} equalSize={6} /></View>
                        <Text size={6.5} semiBold color={colors.MainBlue} style={{ marginHorizontal: scale(9) }}>{order.paymentMethod === "CASH" ? t('cash') : order.paymentMethod === "WALLET" ? t('wallet') : order.paymentMethod === "VISA_MASTERCARD" ? t('Creditcard') : t('wallets')}</Text>
                    </View>
                </View>
                {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(10), marginHorizontal: scale(10) }}>
                    <Text semiBold color={'#1B3862'} size={7}>{t("price")}</Text>
                    <Text semiBold color={'#1B3862'} size={6.5}>{parseFloat(100).toFixed(2)} {t('pound')}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(10), marginHorizontal: scale(10) }}>
                    <Text semiBold color={'#1B3862'} size={7}>{t("delivry")}</Text>
                    <Text semiBold color={'#1B3862'} size={6.5}>{parseFloat(30).toFixed(2)} {t('pound')}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(10), marginHorizontal: scale(10) }}>
                    <Text semiBold color={'#1B3862'} size={7}>{t("Discount")}</Text>
                    <Text semiBold color={'#1B3862'} size={6.5}>{parseFloat(10).toFixed(2)} {t('pound')}</Text>
                </View>
                {order.promoCode ? <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: scale(10) }}>
                    <Text semiBold color={colors.Product2} size={7}>{t("Discount")}</Text>
                    <Text semiBold color={colors.Product2} size={6.5}>{parseFloat(order.discountValue).toFixed(2)} {t('currency')}</Text>
                </View> : null}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: scale(10), marginBottom: scale(25) }}>
                    <Text color={'#CA944B'} bold size={7}>{t("Total")}</Text>
                    <Text color={'#CA944B'} bold size={6.5}>{parseFloat(120).toFixed(2)} {t('pound')}</Text>
                </View> */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(10), marginHorizontal: scale(10) }}>
                    <Text bold color={'#1B3862'} size={8}>{t("price")}</Text>
                    <Text bold color={'#1B3862'} size={7.5}>{/*order.price*/before()} {t('pound')}</Text>
                </View>
                {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(10), marginHorizontal: scale(10) }}>
                    <Text bold color={'#1B3862'} size={8}>{t("delivry")}</Text>
                    <Text bold color={'#1B3862'} size={7.5}>{order.transportationPrice} {t('pound')}</Text>
                </View> */}
                {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(10), marginHorizontal: scale(10) }}>
                    <Text bold color={'#1B3862'} size={8}>{t("Discount")}</Text>
                    <Text bold color={'#1B3862'} size={7.5}>{parseFloat(order.price).toFixed(2)} {t('pound')}</Text>
                </View> */}
                {/*getdis() !== 0 ?*/
                    <View style={{ flexDirection: "row", marginTop: scale(10), justifyContent: "space-between", alignItems: "center", marginHorizontal: scale(10) }}>
                        <Text bold color={'#1B3862'} size={8}>{t("Discount")}</Text>
                        <Text bold color={'#1B3862'} size={7.5}>{getdis()} {t('pound')}</Text>
                    </View> /*: null*/}
                <View style={{ flexDirection: "row", marginTop: scale(10), justifyContent: "space-between", alignItems: "center", marginHorizontal: scale(10) }}>
                    <Text color={'#CA944B'} bold size={8}>{t("Total")}</Text>
                    <Text color={'#CA944B'} bold size={7.5}>{order.totalPrice} {t('pound')}</Text>
                </View>
                {order.status === 'ACCEPTED' ? <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(70), marginBottom: scale(5) }}>

                    <Button title={t('sellorder')} size={7} elevation={3} loading={loading} style={{
                        alignSelf: 'stretch', paddingVertical: scale(15), paddingHorizontal: scale(30)

                    }} bold radius={28} color="white"
                        backgroundColor={colors.MainBlue}
                        onPress={() => {

                            SeellOrder();
                        }} />
                </View>
                    : null}

                {/* {order.status === 'FINISHED' || order.status === 'ACCEPTED' ? <View style={{
                    flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: scale(10), paddingVertical: scale(8), backgroundColor: 'white', borderRadius: scale(14),
                    elevation: 2, marginHorizontal: scale(10), marginTop: scale(20), marginBottom: scale(10), ...defaultStyles.elevationGame(0.5)
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image style={{ width: scaledWidth(8), height: scaledWidth(8), borderRadius: scaledWidth(8) / 2, alignItems: "center", justifyContent: "center", marginStart: scale(5) }} source={Images.board} equalSize={6} />
                        <Text size={7} semiBold color={"rgba(191, 37, 50, 1)"} style={{ marginHorizontal: scale(7) }}>{t("Invoice")}</Text>
                    </View>
                    <Button linear color={colors.Whitebackground} style={{
                        paddingHorizontal: scale(10), paddingVertical: 0, alignSelf: "center", justifyContent: "center",
                        flexDirection: 'row'
                    }} elevation={2} radius={20} loading={loadingReceipt} onPress={() => {
                        if (Platform.OS === 'ios') {
                            downloadInvoice();
                        }
                        else {
                            checkPermission();
                        }
                    }}>
                        <Icon name="download" type="MaterialCommunityIcons" color="white" size={8} />
                        <Text color="white" size={6.5} bold style={{ paddingHorizontal: scale(2) }}>{t("download")}</Text>
                    </Button>
                </View> : null} */}

            </ScrollView> : loading ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <LottieLoading loading={loading} style={{ flex: 1 }} />
            </View> : error ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>{t('errorHappened')}</Text>
                <Button linear title={t('tryAgain')} color="white" bold radius={20} style={{ width: scaledWidth(40), alignSelf: 'center', paddingVertical: scale(5), marginTop: scale(6) }}
                    onPress={() => {
                        getOrder();
                    }} />
            </View> : null
            }
            <OrderModel visible={serviceModalVisible} dismiss={() => {
                setServiceModalVisible(false);
            }} close={true} text={t('confirmexit')} method={() => { cancelOrder(); setServiceModalVisible(false) }} />
        </View >
    );
}