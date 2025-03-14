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
import { Api } from '../../Utils/api';
import colors from '../../Utils/colors';
import { scale, scaledWidth, scaledHeight } from '../../Utils/responsiveUtils';
import { LatestSearchContainer } from './LatestSearchContainer';
import Images from '../../Assets/Images';
import { Controls } from '../../Components/Controls';
import { getSectionApi, getSubCategories } from '../../Utils/api';
import { CartButton } from '../../Components/CartButton';
import FilterModel from './FilterModel';
import SortModel from './SortModel';

export const Section = (props) => {
    const [choose, setChoose] = useState(false);
    const { t, i18n } = useTranslation();
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const id = props.id;
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

    const [List, setList] = useState(false);

    const renderContainer = (item) => {
        return (
            <TouchableOpacity onPress={() => setSelectedCategory(item.id)} style={{ backgroundColor: item.id === selectedCategory ? colors.highlight : colors.grayBackgroung, borderRadius: scale(10), paddingHorizontal: scale(10), paddingVertical: scale(5), margin: scale(4) }} >
                <Text color={colors.MainBlue}>{item.name}</Text>
            </TouchableOpacity>
        );
    }
    const [selectedCategory, setSelectedCategory] = useState();
    const [sortId, setSort] = useState(null);
    const [ShowLast, setShowLast] = useState(null);
    const [brandID, setBrandID] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    useEffect(() => {
        GetData();
        // GetData(selectedCategory,sortId,ShowLast,brandID,minPrice,maxPrice);
        GetData2();
    }, []);
    useEffect(() => {
        GetData();
        // GetData(selectedCategory,sortId,ShowLast,brandID,minPrice,maxPrice);
    }, [selectedCategory,sortId,brandID,ShowLast,minPrice,maxPrice]);
    const [products, setProducts] = useState([]);
    const [cate, setcate] = useState([]);


    const GetData = async (/*selectedCat,sort,Last,brand,min,max*/) => {
        setProducts([]);

        getSectionApi(id, selectedCategory, sortId, ShowLast, brandID, minPrice, maxPrice).then(res => {
            console.log("RESPONSE 11::::: ", res);
            setProducts(res.data.data);
        }).catch(error => {
            console.log("ERROR 11 :::: ", error);
        });
    }

    const GetData2 = async () => {
        setcate([]);
        getSubCategories(props.id).then(res => {
            console.log("SUBBBB RESPONSE 22::::: ", res);
            setcate(res.data.data);
            console.log("caaaaaaaaaaaaaaaaaa",cate)
        }).catch(error => {
            console.log("ERROR 22:::: ", error);
        });
    }



    return (
        <View style={{ flex: 1, backgroundColor: colors.bgS, alignItems: "flex-start", justifyContent: "flex-start", alignContent: "flex-start", alignSelf: "flex-start" }}>
            <Header style={{ backgroundColor: colors.grayBackgroung }} title={t('section') + " " + props.name} back />

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


            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', width: cate.length > 3 ? null : scaledWidth(100), marginTop: scale(10) }}>
            
                <TouchableOpacity onPress={() => { setSelectedCategory(null); }} style={{ backgroundColor: selectedCategory == null ? colors.highlight : colors.grayBackgroung, borderRadius: scale(10), paddingHorizontal: scale(10), paddingVertical: scale(5), margin: scale(4), height: scaledHeight(5) }} >
                        <Text color={colors.MainBlue}>{t("all")}</Text>
                    </TouchableOpacity>

                {cate.map((item) => {
                    return (<TouchableOpacity onPress={() => { setSelectedCategory(item.id); }} style={{ backgroundColor: item.id === selectedCategory ? colors.highlight : colors.grayBackgroung, borderRadius: scale(10), paddingHorizontal: scale(10), paddingVertical: scale(5), margin: scale(4), height: scaledHeight(5) }} >
                        <Text color={colors.MainBlue}>{item.name}</Text>
                    </TouchableOpacity>)
                })}

            </ScrollView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", height: products.length > 0 ? scaledHeight(75) : null, width: products.length > 0 ? null : scaledWidth(100) }}>

                {products && products.length > 0 && !List ?

                    <FlatList key={(item) => item.id} data={products} numColumns={Math.ceil(2)} showsVerticalScrollIndicator={false}
                        style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3), alignItems: "flex-start" }} renderItem={({ item }) => {
                            return <ProductContainer item={item} />
                        }} /> : products && products.length > 0 && List ? <FlatList keyExtractor={(item) => item.id} data={products} numColumns={Math.ceil(1)} showsVerticalScrollIndicator={false}
                            style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                                return <ProductContainerHorizontal item={item} />
                            }} /> : <Text style={{ justifyContent: "center", alignSelf: "center", justifyContent: "center" }} color={colors.MainBlue} semiBold size={12}>{t('noProducts')}</Text>}
            </ScrollView>

            <CartButton Bottom={scale(20)} />
            <FilterModel visible={serviceModalVisible} dismiss={() => {
                setServiceModalVisible(false);
            }} dismiss2={() => {
                setServiceModalVisible(false);
            }} chooiseBrand={(id) => { setBrandID(id); }} priceFilter={(min, max) => { setMinPrice(min); setMaxPrice(max);  }} />

            <SortModel visible={serviceModalVisible2} dismiss={() => {
                setServiceModalVisible2(false);
            }} Sort={(id) => {  setSort(id); console.log('loooooooooooool', id, sortId); }} SortLast={(id2) => { setShowLast(id2); }} />
        </View>
    );
}