import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useInfiniteQuery, useQuery } from 'react-query';
import { Empty } from './Empty';
import { Header } from './Header';
import { Icon } from './Icon';
import { Image } from './Image';
import { Input } from './Input';
import { LottieLoading } from './LottieLoading';
import ProductContainer from './ProductContainer';
import ProductContainerHorizontal from './ProductContainerHorizontal';
import { Text } from './Text';
import { API_ENDPOINT } from '../configs';
import { Api } from '../Utils/api';
import colors from '../Utils/colors';
import { scale, scaledWidth } from '../Utils/responsiveUtils';
import { LatestSearchContainer } from './LatestSearchContainer';
import Images from '../Assets/Images';

export const Controls = (props) => {

    const { t, i18n } = useTranslation();
    const [List, setList] = useState(props.list);

    return (

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ backgroundColor: colors.serchColor, flexDirection: "row", width: scaledWidth(33), alignSelf: "stretch", alignItems: "center", justifyContent: "center", paddingVertical: scale(5) }}>
                <TouchableOpacity style={{}} onPress={() => { setList(false) }} ><Icon size={11} type={"Ionicons"} name={"md-grid-sharp"} color={List === false ? colors.highlight : colors.MainGray} />
                </TouchableOpacity>

                <TouchableOpacity style={{}} onPress={() => { setList(true) }} >
                    <Icon size={15} type={"MaterialCommunityIcons"} name={"view-list"} color={List === true ? colors.highlight : colors.MainGray} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ backgroundColor: colors.serchColor, flexDirection: "row", width: scaledWidth(33), alignSelf: "stretch", alignItems: "center", justifyContent: "center", paddingVertical: scale(5) }}>
                <Image source={Images.sort} equalSize={5} noLoad />
                <Text bold>  {t('sort')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: colors.serchColor, flexDirection: "row", width: scaledWidth(33), alignSelf: "stretch", alignItems: "center", justifyContent: "center", paddingVertical: scale(5) }}>
                <Image source={Images.filter} equalSize={5} noLoad/>
                <Text bold>  {t('filter')}</Text>
            </TouchableOpacity>
        </View>
    );
}