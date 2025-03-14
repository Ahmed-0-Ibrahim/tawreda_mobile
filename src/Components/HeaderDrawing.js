import React from "react";
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import Images from "../Assets/Images";
import { scale, scaledHeight, scaledWidth } from "../Utils/responsiveUtils";
import { Icon } from "./Icon";
import { Image } from './Image';
import colors from "../Utils/colors";

export const HeaderDrawing = (props) => {
    let { lock, logo, back, onPress } = props;
    return (
        <LinearGradient colors={[colors.goldbackground, colors.highlight]} start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 0 }}
            style={[{ width: '100%', height: scaledHeight(40), justifyContent: 'center', alignItems: 'center' }, props.style]}>

            {back && <TouchableOpacity style={{ position: 'absolute', left: 0, top: 0, justifyContent: 'center', alignSelf: 'center', height: scaledHeight(7), paddingHorizontal: scale(4) }} onPress={onPress}>
                <Icon name="keyboard-arrow-right" type="MaterialIcons" size={16} reverse />
            </TouchableOpacity>}

            <View style={{ position: 'absolute', bottom: 0, justifyContent: 'flex-end', alignSelf: 'stretch' }}>
                <Svg width={scaledWidth(101)} height={scaledHeight(20)}>
                    <Path fill={"white"} fillOpacity={1}
                        d={`M0,0 S${scaledWidth(10)},${scaledHeight(16)},${scaledWidth(45)},${scaledHeight(10)} S${scaledWidth(80)},${scaledHeight(20)},${scaledWidth(100)},${scaledHeight(20)} H0 Z`} />
                    <Path strokeWidth={2} stroke={colors.highlight} 
                    d={`M0,${scaledHeight(5)} S${scaledWidth(12)},${scaledHeight(17)},${scaledWidth(45)},${scaledHeight(9.5)} S${scaledWidth(81)},${scaledHeight(20)},${scaledWidth(101)},${scaledHeight(20)}`} />
                </Svg>
            </View>
            {lock ? <Image source={Images.lock} width={30} height={30} style={{ paddingBottom: scale(80) }} resizeMode="contain" /> : 
            logo ? <Image source={Images.logoGray} width={45} height={30} style={{ paddingBottom: scale(80) }} resizeMode="contain" /> : null}
        </LinearGradient>
    );
}