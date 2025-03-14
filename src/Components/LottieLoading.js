import React, { useEffect } from "react";
import { View } from 'react-native';
import Lottie from 'lottie-react-native';
import Images from "../Assets/Images";


export const LottieLoading = (props) => {
    if (props.loading) {
        return (
            <View style={[props.style, { alignItems: 'center', justifyContent: 'center' }]}>
                <Lottie style={props.lottieStyle} source={Images.lottieImg} autoPlay loop />
            </View>
        );
    }
    return null;
}