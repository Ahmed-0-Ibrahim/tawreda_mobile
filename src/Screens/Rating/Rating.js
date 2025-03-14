import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Dimensions, ScrollView, FlatList, Modal } from 'react-native';
import { useDispatch, useSelector, connect } from 'react-redux';
import colors from '../../Utils/colors';
import { Text } from '../../Components/Text';
import { setLang, setLangStorage } from '../../Redux/lang';
import RNRestart from 'react-native-restart';
import { Header } from '../../Components/Header';
import { Icon } from '../../Components/Icon';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Button } from '../../Components/Button';
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from '../../Utils/responsiveUtils';
import { Image } from '../../Components/Image';
import Images from '../../Assets/Images';
import { RaitingCart } from './RatingCart';
import { Input } from '../../Components/Input';

const Rating = (props) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const [defaultRate, setRate] = useState(0)
    const [maxRate, setMaxRate] = useState([1, 2, 3, 4, 5])

    const [RatingData, setRaiting] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getRatings(page);
    }, [page]);

    useEffect(() => {
        setPage(1);
        getRatings(1);
    }, [props.rateList]);

    const getRatings = (page) => {
        if (page > pageCount) {
            return;
        }
        setLoading(true);
        getOrderApi(props.user.id, page).then(res => {
            setPageCount(res.data.pageCount)
            if (page === 1) {
                setRaiting(res.data.data);
            }
            else {
                setRaiting([...orders, ...res.data.data]);
            }
            setLoading(false);
            setError(false);
        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.53)", justifyContent: "flex-end", alignItems: "center", alignContent: "center", }}>

            <View style={{ height: scaledHeight(60), backgroundColor: "rgba(251, 251, 253, 1)", borderTopStartRadius: scale(20), borderTopEndRadius: scale(20), width: scaledWidth(100),justifyContent:"space-between" }}>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: scaledWidth(95), height: scaledHeight(8), }}>
                    <Button onPress={() => { }} style={{ alignSelf: "flex-end", margin: scale(15), width: scale(30), height: scale(30), borderRadius: scale(50) }}
                    />
                    <Text color={colors.Black} size={scale(9)} >Rating</Text>
                    <Button onPress={() => { }} backgroundColor={"rgba(118, 118, 128, 0.12)"} style={{ alignSelf: "flex-end", margin: scale(15), width: scale(30), height: scale(30), borderRadius: scale(50) }}
                        children={<Icon size={scale(8)} color={colors.Black} name={"close"} />} />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "white", elevation: 1, borderRadius: scale(12), width: scaledWidth(95), height: scaledHeight(8), elevation: scale(1), marginBottom: scaledHeight(1), alignSelf: "center" }}>
                    {
                        maxRate.map((item, key) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    key={item}
                                    onPress={() => setRate(item)}
                                    style={{ margin: scale(4), }}
                                >
                                    <Icon size={scale(12)} name={"star"} color={item <= defaultRate ? "rgba(233, 183, 80, 1)" : "rgba(217, 217, 217, 1)"} />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>


                <FlatList showsVerticalScrollIndicator={false} style={{ width: scaledWidth(95), alignSelf: "center", height: scaledHeight(35) }} showsHorizontalScrollIndicator={false} data={RatingData} renderItem={({ item }) => {
                    return <RaitingCart item={item} />
                }} />

                <View style={{ width: scaledWidth(90), height: scaledHeight(8), alignSelf: "center", flexDirection: 'row', alignContent: 'center', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 1, borderColor: '#DBDBDB', borderRadius: scale(100), marginVertical: scaledHeight(2) }}>
                    <Input
                        placeholder={t('AddRate')}
                        style={{
                            paddingBottom: 0,
                            paddingStart: scale(15),
                            fontSize: responsiveFontSize(7)
                        }}
                        inputStyle={{
                            borderBottomWidth: 0,
                        }}
                        containerStyle={{
                            flex: 1,
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }} />
                    <Button linear circle={scale(12)} style={{ margin: scale(5), }} elevation={1} >
                        <Icon color={'#FFFFFF'} name={'ios-send'} type={'Ionicons'} size={13} style={{ textAlign: 'center', alignSelf: 'center', justifyContent: 'center' }} />
                    </Button>
                </View>

            </View>

        </View>
    );
}

const mapStateToProps = state => ({
    rateList: state.list.rateList,
    user: state.auth.user,
});

export default connect(mapStateToProps)(Rating);