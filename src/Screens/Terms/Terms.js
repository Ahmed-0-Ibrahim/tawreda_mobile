import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, connect } from 'react-redux';
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
import { getTermsApi, getCompanyData } from '../../Utils/api';
import { LottieLoading } from '../../Components/LottieLoading';

const Terms = (props) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const [error, setError] = useState(false);

    const terms1 = useSelector(state => state.auth.company);
    const [terms, set] = useState(Array.isArray(terms1) ? Object.assign({}, ...terms1).termsAndConditions : terms1.termsAndConditions);
    useEffect(() => {
        // getTerms();
        console.log("terms1.termsAndConditions",)
    }, []);




    const renderTextItem = (item) => {
        return (
            <View>
                <Text color={colors.MainBlue} bold style={{ marginBottom: scale(8) }}>
                    {typeof item.title === 'object' ? item.title[i18n.language] : item.title}
                </Text>
                <Text color={colors.MainBlue} style={{ marginBottom: scale(8) }}>
                    {typeof item.description === 'object' ? item.description[i18n.language] : item.description}
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.grayBackgroung }}>
            <Header back title={t("TermsTitle")} />
            <FlatList data={terms} keyExtractor={(item) => item.id} style={{ flex: 1, alignSelf: 'stretch', paddingHorizontal: scale(15), backgroundColor: colors.Whitebackground }} ListHeaderComponent={<Image source={Images.logoTabActive} equalSize={45} style={{ justifyContent: "flex-start", alignSelf: "flex-start", alignSelf: "flex-start", height: scaledHeight(15) }} />}
                showsVerticalScrollIndicator={false} renderItem={({ item }) => renderTextItem(item)} contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    );
}

export default connect()(Terms)