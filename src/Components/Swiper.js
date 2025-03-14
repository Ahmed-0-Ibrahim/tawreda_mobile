import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { API_ENDPOINT } from "../configs";
import { scale, scaledHeight, scaledWidth } from "../Utils/responsiveUtils";
import { Image } from "./Image";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import colors from "../Utils/colors";


export const Swiper = (props) => {

    const { data } = props;
    const [currentIndex, setCurrentIndex] = useState(0);

    const renderItem = (item, index) => {
        // console.log("ITEM::: ", item);
        return (
            <TouchableOpacity style={{ width: scaledWidth(100), alignSelf: 'center' }} key={index} onPress={() => props.onItemPressed ? props.onItemPressed(item) : null}>
                <Image
                    source={{
                        uri: typeof item === 'object' ? item.image.includes('http') ? `${item.image}` : `${API_ENDPOINT}/${item.image}`
                            : item.includes('http') ? `${item}` : `${API_ENDPOINT}/${item}`
                    }}
                    height={props.height} style={[props.itemStyle, { flex: 1 }]} resizeMode="cover" />
            </TouchableOpacity>
        );
    }

    if (data && data.length > 0) {
        return (
            <>
                <Carousel sliderWidth={scaledWidth(100)} sliderHeight={scaledHeight(props.height)}
                    itemWidth={scaledWidth(100)} itemHeight={scaledHeight(props.height)}
                    data={data} renderItem={({ item }, index) => renderItem(item, index)}
                    autoplayDelay={1000} autoplayInterval={3000} loop={true} autoplay={true}
                    onSnapToItem={(index) => {
                        setCurrentIndex(index);
                        props.setIndex ? props.setIndex(index) : null;
                    }} />
                <Pagination activeDotIndex={currentIndex} dotsLength={data.length}
                    containerStyle={props.product ? {
                        position: 'absolute', bottom: scale(15),
                        paddingTop: 0, paddingBottom: 0, alignSelf: 'center'
                    } :
                        {
                            marginTop: scale(8),
                            paddingTop: 0, paddingBottom: 0,
                        }}
                    dotElement={<View style={{
                        borderRadius: scaledWidth(2), width: scaledWidth(4.2), height: scaledWidth(2),
                        marginHorizontal: scale(2.5), backgroundColor: colors.highlight
                    }} />}
                    inactiveDotElement={<View style={{
                        borderRadius: scaledWidth(1), width: scaledWidth(2), height: scaledWidth(2),
                        marginHorizontal: scale(2.5), backgroundColor: '#BDBDBD'
                    }} />} />
            </>
        );
    }
}