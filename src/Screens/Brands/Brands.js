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
import { getBrands, getCategory } from '../../Utils/api';
import { LottieLoading } from '../../Components/LottieLoading';
import MainBrandsContainer from './MainBrandsContainer';
import { CartButton } from '../../Components/CartButton';
export default Brands = (props) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        setLoading(true);
        setCategories([]);
        const [categoryRes] = await Promise.all([getBrands()]);
        if (categoryRes && categoryRes.ok && categoryRes.data) {
            setCategories(categoryRes.data.data);
            setLoading(false);
        }
        else {
            setError(true);
            setLoading(false);
        }
    }
    const [categories, setCategories] = useState();

    return (
        <View style={{ flex: 1, backgroundColor: colors.Whitebackground }}>
            <Header back title={t("Brands")} style={{ backgroundColor: colors.grayBackgroung }} />
            {categories && categories.length > 0 ? <ScrollView showsHorizontalScrollIndicator={false} style={{alignContent:"center",alignSelf:"center"}}>
                <FlatList keyExtractor={(item) => item.id} data={categories} numColumns={4} showsVerticalScrollIndicator={false}
                     renderItem={({ item }) => {
                        return <MainBrandsContainer item={item} />
                    }} />
            </ScrollView> : null}
            <CartButton Bottom={scale(20)}/>
        </View>
    );
}
