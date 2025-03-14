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
import { scale, scaledWidth } from '../../Utils/responsiveUtils';
import { LatestSearchContainer } from './LatestSearchContainer';

export const Search = (props) => {
    const [searchText, setSearchText] = useState('');
    const [hasOffer, setHasOffer] = useState(props.hasOffer ? props.hasOffer : false);
    const [pageCount, setPageCount] = useState(1);
    const [TextSearch, setTextSearch] = useState('');
    const { t, i18n } = useTranslation();
    const [List, setList] = useState(false);
    const [search, setSearch] = useState(false);
    const [searchholder, setTextHolder] = useState("");


    const [LastSearched, setLastSearched] = useState([
        { Name: "جهينة" }, { Name: "زبادي لايت" }, { Name: "عصير" }]);

    const searchData = useInfiniteQuery(['getProducts', searchText, hasOffer], ({ pageParam = 1 }) => getProductsFn(searchText, pageParam), {
        getNextPageParam: (lastPage, allPages) => {
            return allPages.length + 1 > pageCount ? undefined : allPages.length + 1;
        }
    });

    async function getProductsFn(text, page) {
        let params = { name: text };
        try {
            let response = await Api.get(`${API_ENDPOINT}/product?hasQuantity=true&page=${page}`, params);
            // console.log("RESPONSE:::: ", response);
            if (response.ok) {
                setPageCount(response.data.pageCount);
                return response.data.data;
            }
            throw response.data;

        }
        catch (error) {
            throw new Error(error);
        }
    }

    const renderInput = () => {
        return (
            <View>
                <View style={{ flexDirection: "row", alignSelf: 'stretch', paddingVertical: scale(15), alignItems: "center", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.grayBackgroung, marginHorizontal: scale(10) }}>

                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignContent: "center", alignItems: "center", backgroundColor: colors.Whitebackground, borderRadius: scale(10), height: scale(50), padding: scale(7) }}>
                        <Icon size={10} type={"Feather"} name={"search"} color={colors.TextGray} />
                        <Input containerStyle={{ alignContent: "center", borderRadius: scale(10), marginHorizontal: scale(5), width: scaledWidth(67), height: scale(50), justifyContent: "center", alignSelf: "center", alignItems: "center" }}
                            placeholder={searchholder === "" ? t("SearchHere") : searchholder}
                            style={{ alignContent: "center", justifyContent: "center", alignSelf: "center", alignItems: "center" }}
                            onChangeText={(text) => {
                                // setTextHolder("");
                                setTextSearch(text);
                                setSearch(true);
                                setSearchText(text);
                            }}
                            onPress={() => {
                                setTextHolder("");
                                setSearchText(TextSearch);
                            }}
                            inputStyle={{ borderRadius: scale(10), paddingHorizontal: scale(4), backgroundColor: colors.Whitebackground, height: scale(50), justifyContent: "center" }} />
                    </View>


                    <TouchableOpacity style={{ backgroundColor: colors.highlight, borderRadius: scale(10), width: scale(50), height: scale(50), justifyContent: "center", alignContent: "center", alignItems: "center", }}
                        onPress={() => {
                            setSearchText(TextSearch);
                            TextSearch == "" ? setSearch(false) : setSearch(true);
                        }}
                    >
                        <Icon size={13} type={"Feather"} name={"search"} color={colors.Whitebackground} />
                    </TouchableOpacity>
                </View>

                {search ? <View style={{ backgroundColor: colors.serchColor, padding: scale(4), paddingHorizontal: scale(15), flexDirection: "row", justifyContent: "space-between" }}>
                    <Text color={colors.MainBlue} semiBold size={scale(7.5)}>{t('SearchRes')}</Text>
                    <View style={{ flexDirection: "row", marginHorizontal: scale(5) }}>

                        <TouchableOpacity style={{ marginVertical: scale(5) }} onPress={() => { setList(false) }} ><Icon size={12} type={"Ionicons"} name={"md-grid-sharp"} color={List === false ? colors.highlight : colors.MainGray} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginLeft: scale(2) }} onPress={() => { setList(true) }} >
                            <Icon size={17} type={"MaterialCommunityIcons"} name={"view-list"} color={List === true ? colors.highlight : colors.MainGray} />
                        </TouchableOpacity>
                    </View>

                </View> : null}
            </View>
        );
    }

    const parseData = () => {
        if (searchData.data) {
            if (searchData.data.pages) {
                let _data = [];
                searchData.data.pages.map(page => {
                    _data.push(...page);
                })
                return _data;
            }
            return [];
        }
        return [];
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bgS }}>
            <Header style={{ backgroundColor: colors.grayBackgroung }} back />
            {renderInput()}
            {search && !List ? <FlatList showsVerticalScrollIndicator={false} style={{ flex: 1 }}
                numColumns={!List?2:undefined}
                key={!List?'gridView':'ListView'} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: scale(10) }}
                data={parseData()} renderItem={({ item }) => <ProductContainer fromSearch={true} item={item} />}
                onEndReachedThreshold={0.2}
                onEndReached={(d) => searchData.fetchNextPage()}
                ListEmptyComponent={searchData.isLoading ? <LottieLoading style={{ flex: 1 }} loading={searchData.isLoading} /> : searchData.error ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                </View> :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Empty Title={t('noProducts')} discreption={"  "} />
                    </View>} /> :
                search && List ? <FlatList showsVerticalScrollIndicator={false} style={{ flex: 1 }}
                  
                    key={List?'ListView':'gridView'} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: scale(10) }}
                    data={parseData()} renderItem={({ item }) => <ProductContainerHorizontal fromSearch={true} item={item} />}
                    onEndReachedThreshold={0.2}
                    onEndReached={(d) => searchData.fetchNextPage()}
                    ListEmptyComponent={searchData.isLoading ? <LottieLoading style={{ flex: 1 }} loading={searchData.isLoading} /> : searchData.error ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                    </View> :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Empty Title={t('noProducts')} discreption={"  "} />
                        </View>} />
                    :
                    <View style={{ paddingHorizontal: scale(12) }}>
                        {/* <Text size={9} semiBold color={colors.MainBlue} style={{ marginVertical: scale(8) }}>{t('lastSearch')}</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <FlatList keyExtractor={(item) => item.id} data={LastSearched} numColumns={3} showsVerticalScrollIndicator={false}
                                style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }}
                                renderItem={({ item }) => { return (<TouchableOpacity onPress={() => { setSearchText(item.Name); setTextHolder(item.Name); setSearch(true); }}><LatestSearchContainer name={item.Name} /></TouchableOpacity>) }} />
                        </ScrollView> */}

                    </View>}
        </View>
    );
}