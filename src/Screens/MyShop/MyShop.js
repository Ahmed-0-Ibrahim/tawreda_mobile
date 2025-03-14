import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, FlatList, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, connect } from 'react-redux';
import { TabBar } from '../../Components/TabBar';
import { Header } from '../../Components/Header';
import colors from '../../Utils/colors';
import Images from '../../Assets/Images';
import { Image } from '../../Components/Image';
import { Text } from '../../Components/Text';
import { Empty } from '../../Components/Empty';
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import { getOrderApi, orderApi, getOrderStorageApi, cancelOrderApi, getOrderDetailsApi, deleteOrder } from '../../Utils/api';
import { LottieLoading } from '../../Components/LottieLoading';
import { CartButton } from '../../Components/CartButton';
import { MyShopCart } from './MyShopCart';
import { width } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';
import { store } from '../../Redux/store';
import OrderModel from '../Tabs/Orders/Modal'
const MyShop = (props) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState();
    const [error, setError] = useState(false);
    const [current, setcurrent] = useState(true);
    const [finished, setfinished] = useState(false);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);


    // useEffect(() => {
    //     getOrders(page);
    // }, [page]);

    // useEffect(() => {
    //     setPage(1);
    //     getOrders(1);
    // }, [props.orderList]);

    // const getOrders = (page) => {
    //     if (page > pageCount && pageCount !== 0) {
    //         return;
    //     }
    //     console.log("FETCHING ORDERS:::::");
    //     setLoading(true);
    //     getOrderApi(props.user.id, page).then(res => {
    //         setPageCount(res.data.pageCount)
    //         if (page === 1) {
    //             setOrders(res.data.data);
    //         }
    //         else {
    //             setOrders([...orders, ...res.data.data]);
    //         }
    //         setLoading(false);
    //         setError(false);
    //     }).catch(error => {
    //         setError(true);
    //         setLoading(false);
    //     })
    // }
    useEffect(() => {
        getOrders(page);
    }, [page]);
    // useEffect(() => {
    //     getOrder();
    // },);
    useEffect(() => {
        setPage(1);
        getOrders(1);
    }, [props.orderstorage]);


    const getOrder = () => {
        setLoading(true);
        getOrderDetailsApi(id).then(res => {
            console.log("RES::: ", res);
            setOrder(res);
            reorder(res)
            setLoading(false);
        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }
    const cancelOrder = () => {
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
        console.log("FETCHING ORDERS:::::", store.getState().auth.user.id);
        setLoading(true);
        getOrderStorageApi(store.getState().auth.user.id).then(res => {
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
        <View style={{ flex: 1, backgroundColor: colors.Whitebackground, alignContent: "center", alignSelf: "center", alignItems: "center", }}>
            <Header style={{ backgroundColor: colors.grayBackgroung }} back title={t("MyShop")} />
            {/* <View style={{ backgroundColor: colors.grayBackgroung, height: scaledHeight(2), width: scaledWidth(100) }} />

            <FlatList
                refreshControl={<RefreshControl refreshing={loading && orders.length > 0} onRefresh={() => {
                    setPage(1);
                    getOrders(1);
                }} />}
                keyExtractor={(item) => item.id} data={orders} numColumns={1} showsVerticalScrollIndicator={false}
                contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                    return <MyShopCart item={item} />
                }} /> */}
            <View style={{ flex: 1, alignSelf: 'stretch' }}>
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
                        return <MyShopCart settrue={setServiceModalVisible} setId={setId} item={item} />
                    }} />
            </View>
            <OrderModel visible={serviceModalVisible} dismiss={() => {
                setServiceModalVisible(false);
            }} close={true} text={t('confirmexit')} method={() => {
                cancelOrder(); setServiceModalVisible(false); setPage(1);
                getOrders(1);
            }} />
        </View>
    );
}
const mapStateToProps = state => ({
    orderstorage: state.list.orderstorage,
    user: state.auth.user,
});
export default connect(mapStateToProps)(MyShop);