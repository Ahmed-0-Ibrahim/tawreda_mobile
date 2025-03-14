import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, } from 'react-redux';
import { View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useInfiniteQuery, useQuery } from 'react-query';
import { Empty } from '../../Components/Empty';
import { Header } from '../../Components/Header';
import { Icon } from '../../Components/Icon';
import { Image } from '../../Components/Image';
import { Input } from '../../Components/Input';
import { LottieLoading } from '../../Components/LottieLoading';
import ProductContainer from '../../Components/ProductContainer';
import ProductContainerHorizontal from '../../Components/ProductContainerHorizontal';
import { Text } from '../../Components/Text';
import { API_ENDPOINT } from '../../configs';
import { Api } from '../../Utils/api';
import colors from '../../Utils/colors';
import { scale, scaledWidth, scaledHeight } from '../../Utils/responsiveUtils';
import { LatestSearchContainer } from './LatestSearchContainer';
import Images from '../../Assets/Images';
import { Controls } from '../../Components/Controls';
import { getLatestProducts } from '../../Utils/api';
import { CartButton } from '../../Components/CartButton';
import FilterModel from '../Section/FilterModel';
import SortModel from '../Section/SortModel';

export const NewProducts = (props) => {
    const [choose, setChoose] = useState(false);
    const user = useSelector(state => state.auth.user);
    const { t, i18n } = useTranslation();
    const [sortId, setSort] = useState(null);
    const [ShowLast, setShowLast] = useState(null);
    const [brandID, setBrandID] = useState(null);
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [serviceModalVisible, setServiceModalVisible] = useState(false);

    const [serviceModalVisible2, setServiceModalVisible2] = useState(false);

    const [List, setList] = useState(false);

    useEffect(() => {
        GetData();
    }, [sortId, brandID, ShowLast, minPrice, maxPrice]);

    const [products, setProducts] = useState([]);

    const GetData = async () => {
        setProducts([]);
        getLatestProducts(user.id, sortId, ShowLast, brandID, minPrice, maxPrice).then(res => {
            console.log("RESPONSE::::: ", res);
            setProducts(res.data.data);
        }).catch(error => {
            console.log("ERROR:::: ", error);
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bgS }}>
            <Header style={{ backgroundColor: colors.grayBackgroung }} title={t('LatestProducts')} back />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ backgroundColor: colors.serchColor, flexDirection: "row", width: scaledWidth(33), alignSelf: "stretch", alignItems: "center", justifyContent: "center", paddingVertical: scale(5) }}>
                    <TouchableOpacity style={{}} onPress={() => { setList(false) }} ><Icon size={11} type={"Ionicons"} name={"md-grid-sharp"} color={List === false ? colors.highlight : colors.MainGray} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{}} onPress={() => { setList(true) }} >
                        <Icon size={15} type={"MaterialCommunityIcons"} name={"view-list"} color={List === true ? colors.highlight : colors.MainGray} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ backgroundColor: colors.serchColor, flexDirection: "row", width: scaledWidth(33), alignSelf: "stretch", alignItems: "center", justifyContent: "center", paddingVertical: scale(5) }}
                    onPress={() => {
                        setServiceModalVisible2(true);

                    }}>
                    <Image source={Images.sort} equalSize={5} noLoad />
                    <Text bold>  {t('sort')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: colors.serchColor, flexDirection: "row", width: scaledWidth(33), alignSelf: "stretch", alignItems: "center", justifyContent: "center", paddingVertical: scale(5) }}
                    onPress={() => {
                        setServiceModalVisible(true);

                    }}>
                    <Image source={Images.filter} equalSize={5} noLoad />
                    <Text bold>  {t('filter')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {products && products.length > 0 && !List ?
                    <FlatList keyExtractor={(item) => item.id} data={products} numColumns={Math.ceil(2)} showsVerticalScrollIndicator={false}
                        style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                            return <ProductContainer item={item} />
                        }} /> : null}
                {products && products.length > 0 && List ? <FlatList keyExtractor={(item) => item.id} data={products} numColumns={Math.ceil(1)} showsVerticalScrollIndicator={false}
                    style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                        return <ProductContainerHorizontal item={item} />
                    }} /> : null}
            </ScrollView>

            <CartButton Bottom={scale(20)} />
            <FilterModel visible={serviceModalVisible} dismiss={() => {
                setServiceModalVisible(false);
            }} dismiss2={() => {
                setServiceModalVisible(false);
            }} chooiseBrand={(id) => { setBrandID(id); }} priceFilter={(min, max) => { setMinPrice(min); setMaxPrice(max); }} />

            <SortModel visible={serviceModalVisible2} dismiss={() => {
                setServiceModalVisible2(false);
            }} Sort={(id) => { setSort(id); console.log('loooooooooooool', id, sortId); }} SortLast={(id2) => { setShowLast(id2); }} />
        </View>
    );
}