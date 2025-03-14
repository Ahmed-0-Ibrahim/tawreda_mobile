import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, I18nManager, FlatList, Dimensions, ScrollView, Modal, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { useDispatch, useSelector, connect } from 'react-redux';
import colors from '../../Utils/colors';
import { Text } from '../../Components/Text';
import { Icon } from '../../Components/Icon';
import { Button } from '../../Components/Button';
import { scale, scaledHeight, scaledWidth, responsiveFontSize } from '../../Utils/responsiveUtils';
import { Image } from '../../Components/Image';
import Navigation from "../../Utils/Navigation";
import { RaitingCart } from "../Rating/RatingCart";
import { Input } from '../../Components/Input';
import defaultStyles from '../../Utils/defaultStyles';
import { getRatingApi, rateProductApi } from '../../Utils/api';
import { LottieLoading } from '../../Components/LottieLoading';
import { Empty } from '../../Components/Empty';
import { refresh } from '../../Redux/list';
import { ModalToast } from '../../Components/ModalToast';

const ShowRateModal = (props) => {
    const { t, i18n } = useTranslation();
    const [defaultRate, setRate] = useState(0)
    const [maxRate, setMaxRate] = useState([1, 2, 3, 4, 5]);
    const [comment, setComment] = useState();
    const [ratingData, setRatingData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [loadingApi, setLoadingApi] = useState(false);
    const [toast, setToast] = useState({
        message: '',
        type: '',
        activate: false,
    });
    const inpRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        getRatings(page);
    }, [page]);

    useEffect(() => {
        setPage(1);
        getRatings(1);
    }, [props.rateList]);

    const getRatings = (page) => {
        if (page > pageCount && pageCount !== 0) {
            return;
        }
        setLoading(true);
        getRatingApi(props.id, page).then(res => {
            setPageCount(res.data.pageCount)
            if (page === 1) {
                setRatingData(res.data.data);
            }
            else {
                setRatingData([...ratingData, ...res.data.data]);
            }
            setLoading(false);
            setError(false);
        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }

    const onSubmit = () => {
        if (!defaultRate) {
            // Navigation.showOverlay(t('ratingNeeded'), 'fail');
            setToast({ message: t('ratingNeeded'), type: 'fail', activate: true });
            return;
        }
        if (!comment) {
            // Navigation.showOverlay(t('commentNeeded'), 'fail');
            setToast({ message: t('commentNeeded'), type: 'fail', activate: true });
            return;
        }

        setLoadingApi(true);

        rateProductApi(props.id, { comment: comment, rate: defaultRate }).then(res => {
            setLoadingApi(false);
            dispatch(refresh('rateList'));
            // Navigation.showOverlay(t('rateSuccessfull'));
            setToast({ message: t('rateSuccessfull'), type: 'success', activate: true });
            if (inpRef && inpRef.current) {
                inpRef.current.clear();
            }
            props.reload();
            // props.dismiss();
        }).catch(error => {
            setLoadingApi(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    return (
        <Modal visible={props.visible} animationType="slide" transparent={true}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>

                {/* <TouchableWithoutFeedback> */}
                <View style={{ height: scaledHeight(60), backgroundColor: "#FBFBFD", borderTopStartRadius: scale(20), borderTopEndRadius: scale(20), width: scaledWidth(100), justifyContent: "space-between" }}>

                    <View style={{ alignItems: "center", justifyContent: "center", alignSelf: 'stretch', paddingVertical: scale(15) }}>
                        <Text color={colors.textSecondary} size={8.6}>{t("Rating")}</Text>
                        <Button onPress={() => { props.dismiss() }} backgroundColor={"rgba(118, 118, 128, 0.12)"}
                            style={{ position: 'absolute', top: 0, right: 0, justifyContent: 'center', margin: scale(15), width: scaledWidth(8), height: scaledWidth(8), borderRadius: scaledWidth(4) }}
                            children={<Icon size={10} type="Ionicons" color={colors.Black} name={"close"} />} />
                    </View>
                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "white", elevation: 2, ...defaultStyles.elevationGame(0.5),
                        borderRadius: scale(15), elevation: scale(1), alignSelf: "stretch", paddingVertical: scale(8), marginHorizontal: scale(12)
                    }}>
                        {
                            maxRate.map((item, key) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        key={item}
                                        onPress={() => setRate(item)}
                                        style={{ margin: scale(4), }}
                                    >
                                        <Icon size={12} type="FontAwesome" name={"star"} color={item <= defaultRate ? "rgba(233, 183, 80, 1)" : "rgba(217, 217, 217, 1)"} />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>


                    <FlatList showsVerticalScrollIndicator={false} style={{ alignSelf: "stretch", height: scaledHeight(35), marginVertical: scale(4) }} contentContainerStyle={{ paddingBottom: scale(6) }}
                        showsHorizontalScrollIndicator={false} data={ratingData} renderItem={({ item }) => {
                            return <RaitingCart item={item} />
                        }}
                        ListEmptyComponent={loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieLoading style={{ flex: 1, width: '100%' }} loading={true} />
                        </View> : <View style={{ flex: 1, height: scaledHeight(28), justifyContent: 'center', alignItems: 'center' }}>
                            <Text color={"#9E9E9E"} size={6.5}>{t('noRatingsFound')}</Text>
                        </View>}
                        onEndReachedThreshold={0.2}
                        onEndReached={(d) => setPage(prev => prev + 1)}
                        refreshControl={<RefreshControl refreshing={loading && ratingData.length > 0} onRefresh={() => {
                            setPage(1);
                            getRatings(1);
                        }} />}
                        ListFooterComponent={loading && ratingData.length > 0 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieLoading lottieStyle={{
                                width: scaledWidth(100),
                                height: scaledHeight(12)
                            }} loading={true} />
                        </View> : null} />

                    <View style={{
                        alignSelf: "stretch", flexDirection: 'row', alignContent: 'center', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 1, borderColor: '#DBDBDB',
                        borderRadius: scale(50), marginBottom: scale(15), marginHorizontal: scale(12), backgroundColor: 'white'
                    }}>
                        <Input
                            customRef={r => {
                                inpRef.current = r;
                            }}
                            placeholder={t('AddRate')}
                            style={{
                                paddingBottom: 0,
                                paddingTop: 0,
                                paddingStart: scale(15),
                                fontSize: responsiveFontSize(7)
                            }}
                            inputStyle={{
                                borderBottomWidth: 0,
                            }}
                            containerStyle={{
                                flex: 1,
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }} onChangeText={(text) => {
                                setComment(text);
                            }} />
                        <Button linear circle={12} style={{ margin: scale(5), alignItems: 'center', justifyContent: 'center' }} loading={loadingApi} elevation={2} onPress={() => {
                            onSubmit();
                        }}>
                            <Icon color={'#FFFFFF'} name={'ios-send'} type={'Ionicons'} size={11}
                                style={{ textAlign: 'center', alignSelf: 'center', justifyContent: 'center', transform: [i18n.language === 'ar' ? { scaleX: -1 } : { scaleX: 1 }] }} />
                        </Button>
                    </View>

                </View>
                {/* </TouchableWithoutFeedback> */}
            </View>
            <ModalToast activate={toast.activate} message={toast.message} type={toast.type} hide={() => {
                setToast({ ...toast, activate: false });
            }} />
        </Modal>
    );
}

const mapStateToProps = state => ({
    rateList: state.list.rateList,
    user: state.auth.user,
});

export default connect(mapStateToProps)(ShowRateModal);