import React, { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { TabBar } from '../../../Components/TabBar';
import { Header } from '../../../Components/Header';
import { Text } from '../../../Components/Text';
import { Empty } from '../../../Components/Empty';
import { Icon } from '../../../Components/Icon';
import { useTranslation } from "react-i18next";
import { Input } from '../../../Components/Input';
import { Image } from '../../../Components/Image';
import { scale, scaledWidth, scaledHeight, responsiveFontSize } from "../../../Utils/responsiveUtils";
import { Button } from '../../../Components/Button';
import colors from '../../../Utils/colors';
import Images, { images } from "../../../Assets/Images"
import Navigation from "../../../Utils/Navigation"
import WarningModal from '../../../Components/WarningModal';
import { getFavProducts, deleteFavorite } from '../../../Utils/api';
import { LottieLoading } from '../../../Components/LottieLoading';
import ProductContainer from '../../../Components/ProductContainer';
import ProductContainerHorizontal from '../../../Components/ProductContainerHorizontal';
import { CartButton } from '../../../Components/CartButton';
import { refresh } from '../../../Redux/list';
const Favourit = (props) => {
    const { t, i18n } = useTranslation();
    const [List, setList] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.auth.user);
    useEffect(() => {
        getFavData();
    }, [props.productList]);

    const [products, setProducts] = useState([]);

    const getFavData = async () => {
        setLoading(true)
        setProducts([]);
        getFavProducts(user.id).then(res => {
            console.log("RESPONSEeeeeeeeeee::::: ", /*Object.assign({}, ...res.data.data)*/res.data.data);
            // dispatch(refresh('productList'));
            setProducts(/*Object.assign({}, ...res.data.data)*/res.data.data);
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            console.log("ERROR:::: ", error);
        });
    }

    const removeFavData = async (data) => {
        let _values = { product:data};
        console.log("_valuessssssssssssssssss",_values);
        deleteFavorite(_values).then(res => {
            console.log("RESPONSEeeeeeeeeee::::: ",res.data.data);
            // getFavData()
        }).catch(error => {
            console.log("ERROR:::: ", error);
        });
    }
    return (

        <View style={{ flex: 1, backgroundColor: colors.Whitebackground, }}>
            <Header style={{ backgroundColor: colors.bgS }} logo support search notif notifFunction />
            <View style={{ backgroundColor: colors.serchColor, padding: scale(4), paddingHorizontal: scale(15), flexDirection: "row", justifyContent: "space-between" }}>
                <Text color={colors.MainBlue} semiBold size={scale(7.5)}>{t('Favourit')}</Text>
                <View style={{ flexDirection: "row", marginHorizontal: scale(5) }}>

                    <TouchableOpacity style={{ marginVertical: scale(5) }} onPress={() => { setList(false) }} ><Icon size={12} type={"Ionicons"} name={"md-grid-sharp"} color={List === false ? colors.highlight : colors.MainGray} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginLeft: scale(2) }} onPress={() => { setList(true) }} >
                        <Icon size={17} type={"MaterialCommunityIcons"} name={"view-list"} color={List === true ? colors.highlight : colors.MainGray} />
                    </TouchableOpacity>
                </View>

            </View>
            {products && products.length > 0 && !List ? <ScrollView showsVerticalScrollIndicator={false} style={{ alignSelf:products.length == 1?"flex-start": "center", alignContent: "center", marginBottom: scaledHeight(15), width:products.length > 0?null:scaledWidth(100) }}>
                <FlatList refreshControl={<RefreshControl refreshing={loading && products.length > 0} onRefresh={() => {
                    getFavData();
                }} />} keyExtractor={(item) => item.id} data={products} numColumns={Math.ceil(2)} showsVerticalScrollIndicator={false}
                    style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                        return <ProductContainer loved item={item.product} />
                    }} />
            </ScrollView> : null}
            {products && products.length > 0 && List ? <ScrollView style={{ alignSelf: "center", alignContent: "center", paddingHorizontal: scaledWidth(0), marginBottom: scaledHeight(15) }} showsVerticalScrollIndicator={false}>
                <FlatList refreshControl={<RefreshControl refreshing={loading && products.length > 0} onRefresh={() => {
                    getFavData();
                }} />} keyExtractor={(item) => item.id} data={products} numColumns={Math.ceil(1)} showsVerticalScrollIndicator={false}
                    style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                        return <ProductContainerHorizontal loved item={item.product} />
                    }} />
            </ScrollView> : <View style={{marginTop:scaledHeight(25)}}>
            <Text style={{justifyContent:"center",alignSelf:"center"}} color={colors.MainBlue} semiBold size={12}>{t('noProducts')}</Text>
                </View>}
            <CartButton />
            <TabBar name="Favorurit" />
        </View>
    )
}
const mapStateToProps = state => ({
    productList: state.list.productList,
    user: state.auth.user,
});
export default connect(mapStateToProps)(Favourit);