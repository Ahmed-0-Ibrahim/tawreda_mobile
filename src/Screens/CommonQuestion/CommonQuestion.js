import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { TabBar } from '../../Components/TabBar';
import { Header } from '../../Components/Header';
import colors from '../../Utils/colors';
import Images from '../../Assets/Images';
import { Image } from '../../Components/Image';
import { Text } from '../../Components/Text';
import { OrderCart } from '../../Screens/Tabs/Orders/OrderCart';
import { Empty } from '../../Components/Empty';
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import { Button } from '../../Components/Button';
import { Icon } from '../../Components/Icon';
import { QuestionCard } from './QuestionCard';
import { getCommonQApi } from '../../Utils/api';
import { LottieLoading } from '../../Components/LottieLoading';

export default CommonQuestion = (props) => {

    const company = useSelector(state => state.auth.company);
    const { t, i18n } = useTranslation();

    const [questions, setQuestions] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        getCommonQ();
    }, []);

    const getCommonQ = () => {
        setLoading(true);
        setQuestions([]);
        getCommonQApi().then(res => {
            console.log("RESPONSE::::: ", res);
            setQuestions(res.data);
            setError(false);
            setLoading(false);
        }).catch(error => {
            console.log("ERROR:::: ", error);
            setError(true);
            setLoading(false);
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bgS }}>
            <Header back title={t("CommonQ")} />
            <FlatList data={questions} renderItem={({ item }) => {
                return <QuestionCard item={item} />
            }} keyExtractor={(item) => item.id} ListHeaderComponent={<Image source={Images.logo} equalSize={40} style={{ justifyContent: "center", alignSelf: "center" }} />}
                showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={loading ? <LottieLoading style={{ flex: 1 }} loading={loading} /> :
                    error ? <View style={{ flex: 1, marginBottom: scale(100), alignItems: 'center', justifyContent: 'center' }}>
                        <Text>{t('errorHappened')}</Text>
                        <Button linear title={t('tryAgain')} color="white" bold radius={20} style={{ width: scaledWidth(40), alignSelf: 'center', paddingVertical: scale(5), marginTop: scale(6) }}
                            onPress={() => {
                                getCommonQ();
                            }} />
                    </View> : <View style={{ flex: 1, marginBottom: scale(100), alignItems: 'center', justifyContent: 'center' }}>
                        <Text color="#9E9E9E">{t('noResultsFound')}</Text>
                    </View>} />
        </View>
    );
}