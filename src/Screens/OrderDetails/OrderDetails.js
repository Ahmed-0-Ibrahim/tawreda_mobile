import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, I18nManager, Dimensions, ScrollView, FlatList, PermissionsAndroid, Platform, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../Utils/colors';
import { Text } from '../../Components/Text';
import { setLang, setLangStorage } from '../../Redux/lang';
import RNRestart from 'react-native-restart';
import { Header } from '../../Components/Header';
import { Icon } from '../../Components/Icon';
import { Button } from '../../Components/Button';
import { OrderProductDetailsCart } from './OrderProductDetailsCart';
import { scale, scaledHeight, scaledWidth } from '../../Utils/responsiveUtils';
import { Image } from '../../Components/Image';
import Images from '../../Assets/Images';
import moment from 'moment';
import defaultStyles from '../../Utils/defaultStyles';
import { cancelOrderApi, getOrderDetailsApi, getOrderReceiptApi, orderApi, deleteOrder ,chechkProductApi} from '../../Utils/api';
import { LottieLoading } from '../../Components/LottieLoading';
import Navigation from '../../Utils/Navigation';
import { refresh } from '../../Redux/list';
import ReactNativeBlobUtil from 'react-native-blob-util'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import OrderModel from '../Tabs/Orders/Modal'
import ModalReorder from '../Tabs/Orders/ModalReorder';
export default OrderDetails = (props) => {
    const dispatch = useDispatch();
    const { rtl, orderList, token } = useSelector(state => ({
        rtl: state.lang.rtl,
        orderList: state.list.orderList,
        token: state.auth.token,
    }));

    const { t, i18n } = useTranslation();
    const [order, setOrder] = useState();
    const delivery = useSelector(state => state.auth.company.transportationPrice);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [loadingReceipt, setLoadingReceipt] = useState(false);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [loadingReorder, setloadingReorder] = useState(false);
    const [reorderModalVisible, setreorderModalVisible] = useState(false);
    const [productsChechked, setproductsChechked] = useState([]);
    const [productsId, setproductsId] = useState([]);
    useEffect(() => {
        getOrder();
    }, [orderList]);

    const getOrder = () => {
        setLoading(true);
        getOrderDetailsApi(props.id).then(res => {
            console.log("RES::: ", res);
            setOrder(res);
            setLoading(false);
        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }

    const reorder = () => {
        setloadingReorder(true)
        let order1 = {};
        let orderProducts = [];
        order.products.map((item) => {
            orderProducts.push({ product: item.product.id, quantity: item.quantity });
        });
        order1.paymentMethod = order.paymentMethod
        order1.products = orderProducts;
        if (order.promoCode) {
            order1.promoCode = order.promoCode.id;
        }
        order1.type = order.type
        order1.address = order.address.id
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", order1)
        orderApi(order1).then(res => {
            setLoading(false);
            // dispatch(refresh('orderList'));
            setloadingReorder(false)
            Navigation.showOverlay(t('orderSuccessfull'));
            setTimeout(() => {
                Navigation.pop();
            }, 250);

        }).catch(error => {
            setloadingReorder(false)
            Navigation.showOverlay(error, 'fail');
        })
    }
    const Check = (order) => {
        let ProductsId = [];
        let Productsquantity = [];
        let idNotAvalibale = []
        order.products.map((item) => {
            ProductsId.push(item.product.id);
            Productsquantity.push(item.quantity);
        });
        console.log("affffffffffffffffffffffffffffffff", ProductsId)
        console.log("affffffffffffffffffffffffffffffff", Productsquantity)
        setproductsId(ProductsId)
        chechkProductApi({ data: ProductsId }).then(res => {
            setLoading(false);
            // dispatch(refresh('orderList'));
            console.log("res checked ::: ", res)
            res.products.forEach((item, index) => {
                console.log("itemmmm", item)
                console.log('indexxxx', index)
                console.log('Productsquantity[index]', Productsquantity[index])

                if (item.available) {
                    console.log('true')
                    if (item.quantity < Productsquantity[index]) {
                        console.log("item.quantity<Productsquantity[index]")
                        idNotAvalibale.push(index)
                    }
                }
                else {
                    idNotAvalibale.push(index)
                }

                console.log('endddddddddd')
            })
            console.log('iddddnot ::: ', idNotAvalibale)
            if (idNotAvalibale.length == 0) {
                reorder(order)
            }
            else {
                idNotAvalibale.forEach((item) => {
                    productsChechked.push(ProductsId[item])
                })
                setreorderModalVisible(true)
            }
            console.log('productsChechked productsChechked ::: ', productsChechked)
            // setproductsChechked(res)
            setloadingReorder(false)
            // getOrders(1);
            // Navigation.showOverlay(t('orderSuccessfull'));

        }).catch(error => {
            setloadingReorder(false)
            Navigation.showOverlay(error, 'fail');
        })

    }
    const reorderAfterFilter = (order) => {
        setloadingReorder(true)

        console.log("orderrrrrrrrrrrrrrrrrrrrrrr", order)
        let order1 = {};
        let orderProducts = [];
        order.products.map((item) => {
            orderProducts.push({ product: item.product.id, quantity: item.quantity });
        });
        console.log("affffffffffffffffffffffffffffffff", orderProducts)
        const updatedProducts = orderProducts.filter(item => !productsChechked.includes(item.product));
        console.log("affffffffffffffffffffffffffffffff", updatedProducts)
        if (updatedProducts.length != 0) {
            order1.paymentMethod = order.paymentMethod
            order1.products = updatedProducts;
            if (order.promoCode) {
                order1.promoCode = order.promoCode.id;
            }
            order1.type = order.type
            order1.address = order.address.id
            console.log("orderrrrrrrrrrrrrrrrrrrrrrr11111", order1)
            orderApi(order1).then(res => {
                setLoading(false);
                // dispatch(refresh('orderList'));
                setloadingReorder(false)
                Navigation.showOverlay(t('orderSuccessfull'));
                setTimeout(() => {
                    Navigation.pop();
                }, 250);

            }).catch(error => {
                setloadingReorder(false)
                Navigation.showOverlay(error, 'fail');
            })
        }
        else {
            Navigation.showOverlay(t('noProducts'))
        }
    }
    const deleteorde = () => {
        setLoading(true)
        deleteOrder(props.id).then(res => {
            dispatch(refresh('orderList'));
            setLoading(false);
            // getOrders(1);
            // Navigation.pop();
            // Navigation.showOverlay(t('cancelOrderSuccess'));
        }).catch(error => {
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
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
        <View style={{ flex: 1, backgroundColor: colors.bgS, paddingHorizontal: scale(5) }}>
            <Header back title={t("Order_details")} style={{ backgroundColor: colors.grayBackgroung }} />
            {loading ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <LottieLoading loading={loading} style={{ flex: 1 }} />
            </View> : <View style={{ backgroundColor: colors.grayBackgroung, alignItems: 'center', marginTop: scale(-10) }}>
                <Text> {t('ordernumber') + " : " + order?.orderNumber}</Text>
            </View>}
            {order && !error ? <ScrollView style={{ alignSelf: "stretch", }} showsVerticalScrollIndicator={false}>
                <View style={{
                    flexDirection: "row", alignSelf: "stretch", justifyContent: "space-between", backgroundColor: '#F5F6FA', paddingHorizontal: scale(10),
                    marginVertical: scale(6), marginHorizontal: scale(10), borderRadius: scale(18), elevation: 0, ...defaultStyles.elevationGame(0.5)
                }}>
                    <View style={{ paddingHorizontal: scale(1), paddingVertical: scale(8) }}>
                        <Text color={colors.Product2} size={6.5} style={{ marginTop: scale(-1) }}>{moment(order.createdAt).format('DD/MM/YYYY - hh:mmA')}</Text>
                        <Text color={colors.TextHome2} bold size={8} style={{ marginTop: scale(-1) }}>{t("Total")} : {order.totalPrice} {t('pound')}</Text>
                        <View style={{ backgroundColor: "#FFFFFF", alignItems: "center", borderRadius: 5, }}>
                            <Text style={{ alignSelf: "center" }} color={order.status === 'ACCEPTED' ? colors.pending : (order.status === 'SHIPPED') ? "#1B3862" : order.status === 'DELIVERED' ? colors.Finished : colors.Cancel} size={7}>{t(order.status)}</Text>
                        </View>
                    </View>
                    {order.status !== 'SHIPPED' ?
                        <TouchableOpacity onPress={() => {
                            setServiceModalVisible(true)
                        }} >
                            <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={order.status === 'ACCEPTED' ? Images.exit : Images.retry} equalSize={11} />
                            </View>
                        </TouchableOpacity> : null
                    }
                </View>
                <Text color={colors.Product2} bold size={8} style={{ marginHorizontal: scale(10), marginTop: scale(6), color: '#1B3862' }}>{t("address")} </Text>
                <View style={{
                    flexDirection: "row", alignItems: 'center', alignSelf: "stretch", justifyContent: "space-between", backgroundColor: '#F5F6FA', paddingHorizontal: scale(8), paddingVertical: scale(8),
                    marginVertical: scale(6), marginHorizontal: scale(10), borderRadius: scale(9), elevation: 0, ...defaultStyles.elevationGame(0.5)
                }}>
                    <Text color={'#8F959E'}>{order.address.name}</Text>
                    <Image source={Images.location} style={{ width: scale(35), height: scale(30) }} />
                </View>

                <Text color={'#1B3862'} bold size={8} style={{ marginHorizontal: scale(10), marginTop: scale(6) }}>{t("quentity")} : {getQuantity()}</Text>
                <FlatList showsHorizontalScrollIndicator={false} data={order.products} renderItem={({ item }) => {
                    return <OrderProductDetailsCart item={item} />
                }} />
                <Text color={colors.Product2} bold size={8} style={{ marginHorizontal: scale(10), marginTop: scale(6), color: '#1B3862' }}>{t("Payment_method")} </Text>

                <View style={{
                    flexDirection: "row", justifyContent: "space-between", marginTop: scale(6), alignItems: "center", paddingHorizontal: scale(10), paddingVertical: scale(10),
                    backgroundColor: 'white', borderRadius: scale(18), borderWidth: scale(1), borderColor: '#F4F4F4'
                }}>
                    <View style={{
                        flexDirection: "row", alignItems: "center", elevation: 2, ...defaultStyles.elevationGame(.5, '#1B3862'),

                    }}>
                        <View style={{ backgroundColor: "white", width: scaledWidth(9), height: scaledWidth(9), borderRadius: scaledWidth(9) / 2, alignItems: "center", justifyContent: "center", marginStart: 5 }}><Image source={order.paymentMethod === "CASH" ? Images.CreditIcon : order.paymentMethod === "WALLET" ? Images.profileWallet : order.paymentMethod === "VISA_MASTERCARD" ? Images.debitcard : Images.smartphone} equalSize={6} /></View>
                        <Text size={8} semiBold color={colors.Product2} style={{ marginHorizontal: scale(9) }}>{order.paymentMethod === "CASH" ? t('cash') : order.paymentMethod === "WALLET" ? t('wallet') : order.paymentMethod === "VISA_MASTERCARD" ? t('Creditcard') : t('wallets')}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(10), marginHorizontal: scale(10) }}>
                    <Text bold color={'#1B3862'} size={8}>{t("price")}</Text>
                    <Text bold color={'#1B3862'} size={7.5}>{order.price} {t('pound')}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(10), marginHorizontal: scale(10) }}>
                    <Text bold color={'#1B3862'} size={8}>{t("delivry")}</Text>
                    <Text bold color={'#1B3862'} size={7.5}>{order.transportationPrice} {t('pound')}</Text>
                </View>
                {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(10), marginHorizontal: scale(10) }}>
                    <Text bold color={'#1B3862'} size={8}>{t("Discount")}</Text>
                    <Text bold color={'#1B3862'} size={7.5}>{parseFloat(order.price).toFixed(2)} {t('pound')}</Text>
                </View> */}
                {order.promoCode ? <View style={{ flexDirection: "row", marginTop: scale(10), justifyContent: "space-between", alignItems: "center", marginHorizontal: scale(10) }}>
                    <Text bold color={'#1B3862'} size={8}>{t("Discount")}</Text>
                    <Text bold color={'#1B3862'} size={7.5}>{order.discountValue} {t('pound')}</Text>
                </View> : null}
                <View style={{ flexDirection: "row", marginTop: scale(10), justifyContent: "space-between", alignItems: "center", marginHorizontal: scale(10) }}>
                    <Text color={'#CA944B'} bold size={8}>{t("Total")}</Text>
                    <Text color={'#CA944B'} bold size={7.5}>{order.totalPrice} {t('pound')}</Text>
                </View>
                <View style={{
                    height: scaledHeight(10),
                }} />
                {/* {order.status === 'WAITING' ? <Button bold size={8} title={t("Cancel")} elevation={2} linear color={colors.Whitebackground}
                    loading={loadingCancel} onPress={() => {
                        cancelOrder();
                    }} style={{
                        marginHorizontal: scale(20), alignSelf: "stretch", justifyContent: "center", marginTop: scale(20),
                        paddingVertical: scale(8), marginBottom: scale(10),
                    }} radius={20} /> : null} */}

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
                <OrderModel visible={serviceModalVisible} dismiss={() => {
                    setServiceModalVisible(false);
                }} close={order.status === 'ACCEPTED'} text={order.status === 'ACCEPTED' ? t('confirmexit') : t('confirretry')} method={order.status === 'ACCEPTED' ? () => { cancelOrder(); setServiceModalVisible(false) } : () => { Check(order);  /*deleteorde();*/ setServiceModalVisible(false) }} />
                <ModalReorder ids={productsChechked} visible={reorderModalVisible} dismiss={() => {
                setreorderModalVisible(false);
                setproductsChechked([])
            }} method={() => { reorderAfterFilter(order); setproductsChechked([]);/*deleteorde();*/ setreorderModalVisible(false); }} />

            </ScrollView> : loading ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <LottieLoading loading={loading} style={{ flex: 1 }} />
            </View> : error ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>{t('errorHappened')}</Text>
                <Button linear title={t('tryAgain')} color="white" bold radius={20} style={{ width: scaledWidth(40), alignSelf: 'center', paddingVertical: scale(5), marginTop: scale(6) }}
                    onPress={() => {
                        getOrder();
                    }} />
            </View> : null}
        </View>
    );
}