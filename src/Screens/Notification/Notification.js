import React, { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { TabBar } from '../../Components//TabBar';
import { Header } from '../../Components/Header';
import { Text } from '../../Components/Text';
import { Empty } from '../../Components/Empty';
import { Icon } from '../../Components/Icon';
import { useTranslation } from "react-i18next";
import { Input } from '../../Components/Input';
import { Image } from '../../Components/Image';
import { scale, scaledWidth, scaledHeight, responsiveFontSize } from "../../Utils/responsiveUtils";
import { Button } from '../../Components/Button';
import colors from '../../Utils/colors';
import Images, { images } from "../../Assets/Images"
import Navigation from "../../Utils/Navigation"
import WarningModal from '../../Components/WarningModal';
import Notice from "./notice"
import { getNotifApi } from '../../Utils/api';
import { LottieLoading } from '../../Components/LottieLoading';
const Notifications = (props) => {
    const { t, i18n } = useTranslation();
    const [notifications, setnotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        getNotifs(page);
    }, [page]);

    useEffect(() => {
        setPage(1);
        getNotifs(1);
    }, [props.notifList]);

    const getNotifs = (page) => {
        if (page > pageCount && pageCount !== 0) {
            return;
        }
        setLoading(true);
        getNotifApi(page).then(res => {
            setPageCount(res.data.pageCount)
            if (page === 1) {
                setnotifications(res.data.data);
            }
            else {
                setnotifications([...notifications, ...res.data.data]);
            }
            setLoading(false);
            setError(false);
        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }

    return (

        <View style={{ flex: 1, backgroundColor: colors.grayBackgroung, }}>
            <Header style={{ paddingBottom: scale(5), }} back title={t('Notifications')} />
            <View style={{ flex: 1 }}>
               {!loading && notifications? <FlatList contentContainerStyle={{ paddingTop: scale(15), flexGrow: 1 }} showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id} data={notifications} renderItem={({ item }, index) => (
                        <Notice item={item}  />)}//noti itemEdit 
                    ListEmptyComponent={loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieLoading style={{ flex: 1, width: '100%' }} loading={true} />
                    </View> : <View style={{ justifyContent: 'center', flex: 1, marginHorizontal: scale(80) }}>
                        <Image width={30} height={8} style={{ alignItems: "center", justifyContent: "center", alignSelf: "center" }} resizeMode={"contain"} source={Images.noNotif} />
                        <Text color={"#150B3D"} size={8} bold style={{ alignSelf: 'center', marginTop: scale(6), }}>{t('noNotifications')}</Text>
                        <Text color={"#9E9E9E"} size={6.5} style={{ textAlign: 'center', alignSelf: 'center', }}>{t('getnotify')}</Text>
                    </View>}
                    onEndReachedThreshold={0.2}
                    onEndReached={(d) => setPage(prev => prev + 1)}
                    refreshControl={<RefreshControl refreshing={loading && notifications.length > 0} onRefresh={() => {
                        setPage(1);
                        getNotifs(1);
                    }} />}
                    ListFooterComponent={loading && notifications.length > 0 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieLoading lottieStyle={{
                            width: scaledWidth(100),
                            height: scaledHeight(12)
                        }} loading={true} />
                    </View> : null} />:null}
            </View>
        </View>
    )
}

const mapStateToProps = state => ({
    notifList: state.list.notifList
});

export default connect(mapStateToProps)(Notifications);