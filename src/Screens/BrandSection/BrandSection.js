import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Api, getProductsByBrandID, getSubCategories, getAllSubCategories } from '../../Utils/api';
import colors from '../../Utils/colors';
import { scale, scaledWidth, scaledHeight } from '../../Utils/responsiveUtils';
import { LatestSearchContainer } from './LatestSearchContainer';
import Images from '../../Assets/Images';
import { Controls } from '../../Components/Controls';
import { CartButton } from '../../Components/CartButton';
import FilterModel from '../Section/FilterModel';
import SortModel from '../Section/SortModel';

export const BrandSection = (props) => {
    const [choose, setChoose] = useState(false);
    const { t, i18n } = useTranslation();
    const [serviceModalVisible, setServiceModalVisible] = useState(false);

    const [serviceModalVisible2, setServiceModalVisible2] = useState(false);
    const [cat, setcat] = useState([
        { id: 1, name: "الكل" },
        { id: 2, name: "التونة" },
        { id: 3, name: "الفول" },
        { id: 4, name: "الذرة" },
        { id: 5, name: "الكريمة" },
        { id: 6, name: "التونة" },
        { id: 7, name: "الفول" },
        { id: 8, name: "الذرة" },
        { id: 9, name: "الكريمة" }
    ]);

    const [cate, setcate] = useState([]);
    const [List, setList] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortId, setSort] = useState(null);
    const [ShowLast, setShowLast] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    const renderContainer = (item) => {
        return (
            <TouchableOpacity onPress={() => { setSelectedCategory(item.id); getFavData(); }} style={{ backgroundColor: item.id === selectedCategory ? colors.highlight : colors.grayBackgroung, borderRadius: scale(10), paddingHorizontal: scale(10), paddingVertical: scale(5), margin: scale(4) }} >
                <Text color={colors.MainBlue}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    useEffect(() => {
        getFavData();
    }, [selectedCategory, sortId, ShowLast, maxPrice, minPrice]);

    useEffect(() => {
        getFavData();
        GetData2();
    }, []);

    const [products, setProducts] = useState([]);

    const getFavData = async () => {
        setProducts([]);
        getProductsByBrandID(props.id, selectedCategory, sortId, ShowLast, minPrice, maxPrice).then(res => {
            console.log("RESPONSE::::: ", res);
            setProducts(res.data.data);
        }).catch(error => {
            console.log("ERROR:::: ", error);
        });
    }

    const GetData2 = async () => {
        setcate([]);
        getAllSubCategories().then(res => {
            console.log("SUBBBB RESPONSE 22::::: ", res);
            setcate(res.data.data);
        }).catch(error => {
            console.log("ERROR 22:::: ", error);
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bgS }}>
            <Header style={{ backgroundColor: colors.grayBackgroung }} title={t("Products") + " " + props.name} back />
            <View style={{ backgroundColor: colors.grayBackgroung, paddingBottom: scale(15) }}>
                <View style={{ backgroundColor: colors.Whitebackground, padding: 5, width: scale(70), height: scale(38), justifyContent: "center", alignSelf: "center", borderRadius: scale(10) }}>
                    <Image source={{ uri: `${API_ENDPOINT}${props.image}` }} equalSize={15} style={{ justifyContent: "center", alignSelf: "center", margin: scale(5) }} />
                </View>
            </View>
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

            {<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', marginTop: scale(10), marginHorizontal: scale(5),height:scaledHeight(9) }}>
                <TouchableOpacity onPress={() => { setSelectedCategory(null); }} style={{ backgroundColor: selectedCategory == null ? colors.highlight : colors.grayBackgroung, borderRadius: scale(10), paddingHorizontal: scale(10), paddingVertical: scale(5), margin: scale(4), height: scaledHeight(5) }} >
                    <Text color={colors.MainBlue}>{t("all")}</Text>
                </TouchableOpacity>
                {cate.map((item) => {
                    return (<TouchableOpacity onPress={() => { setSelectedCategory(item.id); }} style={{ backgroundColor: item.id === selectedCategory ? colors.highlight : colors.grayBackgroung, borderRadius: scale(10), paddingHorizontal: scale(10), paddingVertical: scale(5), margin: scale(4), height: scaledHeight(5) }} >

                        <Text color={colors.MainBlue}>{item.name}</Text>
                    </TouchableOpacity>)
                })}

            </ScrollView>}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: "flex-start", height: products.length <4 ? scaledHeight(65) : null, width: products.length > 0 ? null : scaledWidth(100) }}>
                {products && products.length > 0 && !List ?
                    <FlatList key={(item) => item.id} data={products} numColumns={Math.ceil(2)} showsVerticalScrollIndicator={false}
                        style={{ marginStart: scale(10) }} contentContainerStyle={{ alignItems: "flex-start", alignSelf: "flex-start", alignContent: "flex-start", marginTop: scale(3) }} renderItem={({ item }) => {
                            return <ProductContainer item={item} />
                        }} /> : null}
                {products && products.length > 0 && List ? <FlatList keyExtractor={(item) => item.id} data={products} numColumns={Math.ceil(1)} showsVerticalScrollIndicator={false}
                    style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                        return <ProductContainerHorizontal item={item} />
                    }} /> : null}
                {products.length == 0 ? <View style={{ alignItems: "center", alignContent: "center", justifyContent: "center",alignSelf:"center", marginTop: scaledHeight(5) }}><Image source={Images.emptyLogo} equalSize={scale(30)} />
                    <Text size={10} bold color={colors.MainBlue}>{t('noProducts')}</Text>
                </View> : null}
            </ScrollView>

            <CartButton Bottom={scale(20)} />

            <FilterModel visible={serviceModalVisible} dismiss={() => {
                setServiceModalVisible(false);
            }} dismiss2={() => {
                setServiceModalVisible(false);
            }} Brand={true} priceFilter={(min, max) => { setMinPrice(min); setMaxPrice(max); }} />

            <SortModel visible={serviceModalVisible2} dismiss={() => {
                setServiceModalVisible2(false);
            }} Sort={(id) => { setSort(id); }} SortLast={(id2) => { setShowLast(id2); }} />

        </View>
    );
}