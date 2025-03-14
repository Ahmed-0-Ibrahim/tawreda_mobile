import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, FlatList, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector, connect } from 'react-redux';
import { TabBar } from '../../Components//TabBar';
import { Header } from '../../Components/Header';
import { Text } from '../../Components/Text';
import { Empty } from '../../Components/Empty';
import { Icon } from '../../Components/Icon';
import { useTranslation } from "react-i18next";
import { Input } from '../../Components/Input';
import { scale, scaledWidth, scaledHeight, responsiveFontSize } from "../../Utils/responsiveUtils";
import { Button } from '../../Components/Button';
import colors from '../../Utils/colors';
import { images } from "../../Assets/Images"
import Navigation from "../../Utils/Navigation"
import { ElementSupport } from './Element';
import ElementChosse from './ElementChosse';
import { ElementHistory } from './ElementHistory';
import { LottieLoading } from '../../Components/LottieLoading';
import { getComplaintsChatApi,getCommonQApi } from '../../Utils/api';
const Support = (props) => {
    const { t, i18n } = useTranslation();
    const { company, user } = props;
    const [general, setgeneral] = useState(true);
    const [history, sethistory] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [questions, setQuestions] = useState();
    const [pageCount, setPageCount] = useState(1);

    useEffect(() => {
        getComplaints(page);
    }, [page]);

    useEffect(() => {
        setPage(1);
        getComplaints(1);
    }, [props.chatList]);

    useEffect(() => {
        getGenreal();
    }, []);

    const getGenreal = () => {
        setLoading(true);
        setQuestions([]);
        getCommonQApi().then(res => {
            console.log("RESPONSE::::: ", res.data);
            setQuestions(res.data);
            setError(false);
            setLoading(false);
        }).catch(error => {
            console.log("ERROR:::: ", error);
            setError(true);
            setLoading(false);
        })
    }

    const getComplaints = (page) => {
        if (page > pageCount && pageCount !== 0) {
            return;
        }
        setLoading(true);
        getComplaintsChatApi(user.id, page).then(res => {
            setPageCount(res.pageCount);
            if (page === 1) {
                setHistoryData(res.data);
            }
            else {
                setHistoryData([...historyData, ...res.data]);
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
            <Header style={{ backgroundColor: '#F5F6FA', paddingBottom: scale(5) }} back title={t('support')} />
            <View style={{}}>
                <View style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: '#F5F6FA',
                    // marginHorizontal: scale(10),
                    marginBottom: scale(20)
                }}>

                    <ElementChosse name={t('General')} half={true} settrue={setgeneral} setfalse={sethistory} checked={general} />
                    <View style={{ borderRightColor: '#D1D1D1', borderRightWidth: 1, marginVertical: scale(8) }} />
                    <ElementChosse name={t('History')} settrue={sethistory} setfalse={setgeneral} checked={history} />
                </View>
                {
                    general ?
                        <FlatList showsVerticalScrollIndicator={false} style={{ marginBottom: scale(15) }} data={questions ? questions : []} renderItem={({ item }, index) => (
                            <ElementSupport item={item} />)} ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text color="#9E9E9E">{t('noResultsFound')}</Text>
                            </View>} /> : null
                }
                {
                    history ?
                        <View>
                            <FlatList showsVerticalScrollIndicator={false} style={{ marginBottom: scale(15) }} data={historyData} renderItem={({ item }, index) => (
                                <ElementHistory item={item} />)}
                                keyExtractor={(item) => item.id}
                                ListEmptyComponent={loading ? <View style={{ flex: 1, height: scaledHeight(100), justifyContent: 'center', alignItems: 'center' }}>
                                    <LottieLoading style={{ flex: 1, width: '100%' }} loading={true} />
                                </View> : <Empty Title={t("complaintsEmpty")} discreption={" "} customStyle={{ height: scaledHeight(60), alignItems: 'center' }} />}
                                onEndReachedThreshold={0.2}
                                onEndReached={(d) => setPage(prev => prev + 1)}
                                refreshControl={<RefreshControl refreshing={loading && historyData.length > 0} onRefresh={() => {
                                    setPage(1);
                                    getComplaints(1);
                                }} />}
                                ListFooterComponent={loading && historyData.length > 0 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <LottieLoading lottieStyle={{
                                        width: scaledWidth(100),
                                        height: scaledHeight(12)
                                    }} loading={true} />
                                </View> : null} />
                        </View> : null
                }
                {/* <ElementSupport question={"I can't pay by card?"} />
                <ElementSupport question={"I can't pay by card?"} /> */}
            </View>
        </View>
    )
}

const mapStateToProps = state => ({
    chatList: state.list.chatList,
    user: state.auth.user,
    company: state.auth.company,
});

export default connect(mapStateToProps)(Support);