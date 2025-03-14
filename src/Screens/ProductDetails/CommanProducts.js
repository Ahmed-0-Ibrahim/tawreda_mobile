import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TabBar } from '../../../Components/TabBar';
import colors from '../../Utils/colors';
import { Text } from '../../Components/Text';
import { setLang, setLangStorage } from '../../../Redux/lang';
import RNRestart from 'react-native-restart';
import { scale, scaledWidth } from '../../Utils/responsiveUtils';
import Navigation from '../../Utils/Navigation';
import ProductContainer from '../../Components/ProductContainer';
export default CommanProducts = (props) => {
    const { t, i18n } = useTranslation();

    return (
        <View style={{ alignSelf: 'stretch' ,marginTop:scale(15)}}>
            <View  style={{ flexDirection: "row", alignItems: "center",alignContent:"center",justifyContent:"space-between",marginHorizontal:scale(10) }}>
                <Text color={colors.MainBlue} semiBold size={7} >{t('relatedproducts')}</Text>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <FlatList key={props.categories.length} keyExtractor={(item) => item.id} data={props.categories} numColumns={Math.ceil(props.categories.length)} showsVerticalScrollIndicator={false}
                    style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                        return <ProductContainer true={true} item={item} />
                    }} />
            </ScrollView>
        </View>
    );
}