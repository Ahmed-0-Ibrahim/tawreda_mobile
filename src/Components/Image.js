import React, { useEffect, useState } from "react";
import { Image as NImage, StyleSheet, View, ActivityIndicator } from 'react-native';
import Images from "../Assets/Images";
import colors from "../Utils/colors";
import defaultStyles from "../Utils/defaultStyles";
import { scaledHeight, scaledWidth } from "../Utils/responsiveUtils";


export const Image = (props) => {
    const [loading, setLoading] = useState(false);

    let {
        source,
        resizeMode,
        equalSize,
        style,
        width,
        height,
    } = props;

    const renderLoading = () => {
        return (
            <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={12} color={colors.textPrimary} />
            </View>
        );
    }

    return (
        <View style={[width && { width: scaledWidth(width) }, height && { height: scaledHeight(height) },
        equalSize && { width: scaledWidth(equalSize), height: scaledWidth(equalSize) }, { overflow: 'hidden' }, style]}>
            <NImage style={{ width: '100%', height: '100%' }} resizeMode={resizeMode ? resizeMode : 'contain'} source={source} defaultSource={props.noLoad ? undefined : defaultStyles.imageDefaultIcon} onLoadStart={() => {
                setLoading(true);
            }} onLoadEnd={() => {
                setLoading(false);
            }} />
            {loading && !props.noLoad && renderLoading()}
        </View>
    );
}