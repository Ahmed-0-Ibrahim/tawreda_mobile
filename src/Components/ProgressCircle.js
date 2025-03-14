import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Image,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { scale } from '../Utils/responsiveUtils';

const ProgressCircle = props => {
    const rtl = useSelector(state => state.lang.rtl);
    const [animPercentage] = useState(new Animated.Value(0));
    const [statePercentage, setStatePercentage] = useState(0);
    const {
        backgroundColor,
        strokeColor,
        strokeWidth,
        strokeEmptyColor,
        circleSize,
        percentage,
    } = props;

    useEffect(() => {
        animPercentage.addListener((val) => {
            setStatePercentage(val.value);
        });

        Animated.timing(animPercentage, {
            toValue: percentage,
            duration: 1000
        }).start();

        return () => {
            animPercentage.removeAllListeners();
        }
    }, [percentage]);

    let calcPath = (percentage, size) => {
        let radius = size / 2;
        if (percentage === 100) {
            percentage = 99.999;
        }
        let a = percentage * 2 * Math.PI / 100;
        var x = radius + radius * Math.sin(a);
        var y = radius - radius * Math.cos(a);

        return `A${radius},${radius} 0 ${percentage > 50 ? 1 : 0} 1 ${x},${y} Z`
    }

    let circleSizeIn = circleSize - 1;

    return (
        <View style={[styles.container, !rtl && { transform: [{ scaleX: -1 }]}]}>
            <Svg width={circleSize} height={circleSize}>
                <Circle cx={circleSizeIn / 2} cy={circleSizeIn / 2} r={circleSizeIn / 2} fill={strokeEmptyColor} />
                <Path d={`M${circleSizeIn / 2},0 ${calcPath(statePercentage, circleSizeIn)}`} fill={strokeColor} />
                <Circle cx={circleSizeIn / 2} cy={circleSizeIn / 2} r={circleSizeIn / 2 - strokeWidth} fill={backgroundColor} />
            </Svg>
            <View style={[styles.childrenStyle, !rtl && { transform: [{ scaleX: -1 }]}]}>
                {props.children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    childrenStyle: {
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ProgressCircle;
