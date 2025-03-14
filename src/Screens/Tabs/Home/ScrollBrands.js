import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TabBar } from '../../../Components/TabBar';
import colors from '../../../Utils/colors';
import { Text } from '../../../Components/Text';
import { setLang, setLangStorage } from '../../../Redux/lang';
import RNRestart from 'react-native-restart';
import { scale, scaledWidth } from '../../../Utils/responsiveUtils';
import CategoryContainer from './CategoryContainer';
import Navigation from '../../../Utils/Navigation';
import BrandsContainer from './brandsContainer';

export default ScrollBrands = (props) => {
    const { t, i18n } = useTranslation();

    return (
        <View style={{ alignSelf: 'stretch' ,marginTop:scale(15)}}>
            <View  style={{ flexDirection: "row", alignItems: "center",alignContent:"center",justifyContent:"space-between",marginHorizontal:scale(10) }}>
                <Text color={colors.MainBlue} semiBold size={7} >{t('Brands')}</Text>
               <TouchableOpacity onPress={()=>{
                 Navigation.push({
                    name: 'Brands',
                    options: {
                        statusBar: {
                            backgroundColor: colors.grayBackgroung
                        }}
                })
               }}>
                    <Text color={colors.TextGray} size={6}>{t('See_all')}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <FlatList keyExtractor={(item) => item.id} data={props.brands} numColumns={Math.ceil(props.brands.length)} showsVerticalScrollIndicator={false}
                    style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                        return <BrandsContainer item={item} />
                    }} />
            </ScrollView>
        </View>
    );
}