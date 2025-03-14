import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, FlatList, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, connect } from 'react-redux';
import { TabBar } from '../../../Components/TabBar';
import { Header } from '../../../Components/Header';
import colors from '../../../Utils/colors';
import Images from '../../../Assets/Images';
import { Image } from '../../../Components/Image';
import { Text } from '../../../Components/Text';
import { OrderCart } from '../Orders/OrderCart';
import { Empty } from '../../../Components/Empty';
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../../Utils/responsiveUtils";
import { getOrderApi, orderApi, cancelOrderApi, getOrderDetailsApi, deleteOrder, chechkProductApi } from '../../../Utils/api';
import { LottieLoading } from '../../../Components/LottieLoading';
import { OrderChosse } from './OrderChosse'
import { CartButton } from '../../../Components/CartButton';
import { refresh } from '../../../Redux/list';
import OrderModel from './Modal';
import ModalReorder from './ModalReorder';
import Navigation from '../../../Utils/Navigation';
const Orders = (props) => {
    const dispatch = useDispatch();
    // const { orderList } = useSelector(state => state.list.orderList);
    const { t, i18n } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [id, setId] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [current, setcurrent] = useState(true);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [loadingReorder, setloadingReorder] = useState(false);
    const [finished, setfinished] = useState(false);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [reorderModalVisible, setreorderModalVisible] = useState(false);
    const [order, setOrder] = useState();
    const [productsChechked, setproductsChechked] = useState([]);
    const [productsId, setproductsId] = useState([]);

    useEffect(() => {
        getOrders(page);
    }, [page]);
    // useEffect(() => {
    //     getOrder();
    // },);
    useEffect(() => {
        setPage(1);
        getOrders(1);
    }, [props.orderList]);
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
    const reorder = (order) => {
        setloadingReorder(true)

        console.log("orderrrrrrrrrrrrrrrrrrrrrrr", order)
        let order1 = {};
        let orderProducts = [];
        order.products.map((item) => {
            orderProducts.push({ product: item.product.id, quantity: item.quantity });
        });
        console.log("affffffffffffffffffffffffffffffff", orderProducts)
        order1.paymentMethod = order.paymentMethod
        order1.products = orderProducts;
        if (order.promoCode) {
            order1.promoCode = order.promoCode.id;
        }
        order1.type = order.type
        order1.address = order.address.id
        console.log("orderrrrrrrrrrrrrrrrrrrrrrr11111", order1)
        orderApi(order1).then(res => {
            setLoading(false);
            dispatch(refresh('orderList'));
            setloadingReorder(false)
            getOrders(1);
            Navigation.showOverlay(t('orderSuccessfull'));

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
                dispatch(refresh('orderList'));
                setloadingReorder(false)
                getOrders(1);
                Navigation.showOverlay(t('orderSuccessfull'));

            }).catch(error => {
                setloadingReorder(false)
                Navigation.showOverlay(error, 'fail');
            })
        }
        else{
            Navigation.showOverlay(t('noProducts'))
        }
    }
    const deleteorde = () => {
        setLoading(true)
        deleteOrder(id).then(res => {
            dispatch(refresh('orderList'));
            setLoading(false);
            getOrders(1);
            // Navigation.pop();
            Navigation.showOverlay(t('cancelOrderSuccess'));
        }).catch(error => {
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }
    const getOrder = () => {
        setLoading(true);
        getOrderDetailsApi(id).then(res => {
            console.log("RES::: ", res);
            setOrder(res);
            // reorder(res)
            Check(res)
            setLoading(false);
        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }
    const cancelOrder = () => {
        setLoadingCancel(true);
        cancelOrderApi(id).then(res => {
            dispatch(refresh('orderList'));
            setLoadingCancel(false);
            getOrders(1);
            // Navigation.pop();
            Navigation.showOverlay(t('cancelOrderSuccess'));
        }).catch(error => {
            setLoadingCancel(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    const getOrders = (page) => {
        if (page > pageCount && pageCount !== 0) {
            return;
        }
        console.log("FETCHING ORDERS:::::", props);
        setLoading(true);
        getOrderApi(props.user.id, page).then(res => {
            setPageCount(res.data.pageCount)
            if (page === 1) {
                setOrders(res.data.data);
            }
            else {
                setOrders([...orders, ...res.data.data]);
            }
            setLoading(false);
            setError(false);
        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bgS }}>
            <Header style={{ backgroundColor: colors.bgS }} support notif logo />
            <View style={{ flex: 1, alignSelf: 'stretch' }}>
                <Text color={'#1B3862'} bold size={12} style={{ marginHorizontal: scale(10) }}>{t("My_Orders")}</Text>
                <View style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: '#D1D1D1',
                    marginHorizontal: scale(8),
                    marginBottom: scale(20)
                }}>
                    <OrderChosse name={t('cureentorder')} settrue={setcurrent} setfalse={setfinished} checked={current} />
                    <View style={{ borderRightColor: '#D1D1D1', borderRightWidth: 1, marginVertical: scale(8) }} />
                    <OrderChosse name={t('finishedorder')} settrue={setfinished} setfalse={setcurrent} checked={finished} />
                </View>
                <FlatList showsVerticalScrollIndicator={false} keyExtractor={(item) => item.id} data={orders}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: scaledHeight(15) }}
                    ListEmptyComponent={loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieLoading style={{ flex: 1, width: '100%' }} loading={true} />
                    </View> : <Empty Title={t("Orders_Empty")} discreption={t("OrderEmptyDiscreption")} />}
                    onEndReachedThreshold={0.2}
                    onEndReached={(d) => setPage(prev => prev + 1)}
                    refreshControl={<RefreshControl refreshing={loading && orders.length > 0} onRefresh={() => {
                        setPage(1);
                        getOrders(1);
                    }} />}
                    ListFooterComponent={loading && orders.length > 0 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieLoading lottieStyle={{
                            width: scaledWidth(100),
                            height: scaledHeight(12)
                        }} loading={true} />
                    </View> : null}
                    renderItem=
                    {({ item }) => {
                        return current ? (item.status === 'ACCEPTED' || item.status === 'SHIPPED') ? <OrderCart settrue={setServiceModalVisible} setId={setId} item={item} /> : null : (item.status === 'DELIVERED' || item.status === 'CANCELED') ? <OrderCart settrue={setServiceModalVisible} setId={setId} item={item} /> : null
                    }} />
            </View>
            <CartButton Bottom={scale(100)} />
            <TabBar name="Orders" />
            <OrderModel visible={serviceModalVisible} dismiss={() => {
                setServiceModalVisible(false);
            }} close={current} text={current ? t('confirmexit') : t('confirretry')} method={current ? () => {
                cancelOrder(); setServiceModalVisible(false); setPage(1);
                getOrders(1);
            } : () => { getOrder(); /*deleteorde();*/ setServiceModalVisible(false); setPage(1); getOrders(1); }} />
            <ModalReorder ids={productsChechked} visible={reorderModalVisible} dismiss={() => {
                setreorderModalVisible(false);
                setproductsChechked([])
            }} method={() => { reorderAfterFilter(order); setproductsChechked([]);/*deleteorde();*/ setreorderModalVisible(false); setPage(1); getOrders(1); }} />
        </View>
    );
}

const mapStateToProps = state => ({
    orderList: state.list.orderList,
    user: state.auth.user,
});

export default connect(mapStateToProps)(Orders);