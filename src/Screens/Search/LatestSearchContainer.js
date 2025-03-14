import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
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

export const LatestSearchContainer = (props) => {

    return (

        <View style={{ flexDirection: "row", padding: scale(2), paddingHorizontal: scale(5),marginHorizontal: scale(4), borderRadius: scale(14.5), borderWidth: scale(1), borderColor: "rgba(225, 225, 225, 1)", alignItems: "center" }}
            >
            <Icon size={7}
                type={"Feather"}
                name={'search'}
                color={colors.TextGray}
            />
            <Text color={colors.TextGray}> {props.name} </Text>
        </View>
    );
}