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
import { OrderCart } from '../Tabs/Orders/OrderCart';
import { Empty } from '../../../Components/Empty';
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../../Utils/responsiveUtils";
import { getOrderApi, orderApi } from '../../../Utils/api';
import { LottieLoading } from '../../../Components/LottieLoading';
import {OrderChosse} from './OrderChosse'
import { CartButton } from '../../../Components/CartButton';
 const Orders = (props) => {
    const dispatch = useDispatch();
    // const { orderList } = useSelector(state => state.list.orderList);
    const { t, i18n } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [current, setcurrent] = useState(true);
    const [finished, setfinished] = useState(false);

    useEffect(() => {
        getOrders(page);
    }, [page]);

    useEffect(() => {
        setPage(1);
        getOrders(1);
    }, [props.orderList]);

    const getOrders = (page) => {
        if (page > pageCount && pageCount !== 0) {
            return;
        }
        console.log("FETCHING ORDERS:::::");
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
                        return current? (item.status==='ACCEPTED'||item.status==='WAITING')? <OrderCart item={item} />:null:(item.status==='FINISHED'||item.status==='CANCELED')? <OrderCart item={item} />:null
                    }} />
            </View>
            <CartButton Bottom={scale(100)}/>
            <TabBar name="Orders" />
        </View>
    );
}

const mapStateToProps = state => ({
    orderList: state.list.orderList,
    user: state.auth.user,
});

export default connect(mapStateToProps)(Orders);