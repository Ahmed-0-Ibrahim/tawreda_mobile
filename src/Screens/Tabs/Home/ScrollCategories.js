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

export default ScrollCategory = (props) => {
    const { t, i18n } = useTranslation();

    return (
        <View style={{ alignSelf: 'stretch' ,marginTop:scale(15)}}>
            <View  style={{ flexDirection: "row", alignItems: "center",alignContent:"center",justifyContent:"space-between",marginHorizontal:scale(10) }}>
                <Text color={colors.MainBlue} semiBold size={7} >{t('categories')}</Text>
               <TouchableOpacity 
               onPress={()=>{
                 Navigation.push({
                    name: 'Categories',
                    options: {
                        statusBar: {
                            backgroundColor: colors.grayBackgroung
                        }}
                })
               }}>
                    <Text color={colors.TextGray} size={6}>{t('See_all')}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                <FlatList keyExtractor={(item) => item.id} data={props.categories} numColumns={Math.ceil(props.categories.length)} showsVerticalScrollIndicator={false}
                    style={{ marginStart: scale(10),alignContent:"flex-start"}} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                        return <CategoryContainer item={item} />
                    }} />
            </ScrollView>
        </View>
    );
}