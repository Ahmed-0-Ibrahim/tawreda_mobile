import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { TabBar } from '../../Components/TabBar';
import { Header } from '../../Components/Header';
import colors from '../../Utils/colors';
import Images from '../../Assets/Images';
import { Image } from '../../Components/Image';
import { Text } from '../../Components/Text';
import { OrderCart } from '../Tabs/Orders/OrderCart';
import { Empty } from '../../Components/Empty';
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import { Button } from '../../Components/Button';
import { Icon } from '../../Components/Icon';
import { QuestionCard } from './QuestionCard';
import { likeDislikeApi } from '../../Utils/api';
import Navigation from '../../Utils/Navigation';

export default CommonAnswers = (props) => {

    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { item } = props;

    const [choice, setChoice] = useState('');
    const [loading, setLoading] = useState(false);

    const likeDislike = (ch) => {
        setLoading(true);
        likeDislikeApi(item.id, ch).then(res => {
            console.log("RES:::: ", res);
            setLoading(false);
            Navigation.showOverlay(t('opinionRecorded'));
        }).catch(error => {
            console.log("ERROR:::: ", error);
            setChoice('');
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header back title={t("CommonQ")} />
            <ScrollView style={{ alignContent: 'center', alignSelf: "stretch" }} showsVerticalScrollIndicator={false}>
                <View style={{ marginVertical: scale(10), marginHorizontal: scale(10) }}><Text bold size={8}>{item ? item.title : ''}</Text></View>
                <Text size={6.5} color={colors.TextAnswer} style={{ marginHorizontal: scale(10) }}>{item ? item.text : ''}</Text>
                <View style={{ marginHorizontal: scale(10), marginTop: scale(10), borderBottomColor: '#DADADA', borderBottomWidth: 1, alignSelf: 'stretch', }}>
                    <View style={{ position: 'absolute', bottom: scale(-12), alignSelf: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                        <Text color={colors.textNumPices} size={6.5} style={{ paddingHorizontal: scale(6) }}>{t("SolvedQuestion")}</Text>
                    </View>
                </View>
                {loading ? <View style={{ alignSelf: 'center', marginTop: scale(25) }}>
                    <ActivityIndicator size={responsiveFontSize(12)} color={colors.textPrimary} />
                </View> : <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: scale(25) }}>
                    <TouchableOpacity style={{ borderRadius: 15, borderColor: colors.Rate, borderWidth: choice === 'happy' ? 1 : 0, alignItems: "center", justifyContent: "center", alignContent: "center", marginHorizontal: scale(5) }}
                        onPress={() => {
                            setChoice('happy');
                            likeDislike('happy');
                        }}>
                        <Image source={Images.emojiHappy} equalSize={13} style={{}} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ borderRadius: 15, borderColor: colors.Rate, borderWidth: choice === 'sad' ? 1 : 0, alignItems: "center", justifyContent: "center", alignContent: "center", marginHorizontal: scale(5) }}
                        onPress={() => {
                            setChoice('sad');
                            likeDislike('sad');
                        }}>
                        <Image source={Images.emojiSad} equalSize={13} style={{}} />
                    </TouchableOpacity>
                </View>}
            </ScrollView>
        </View>
    );
}