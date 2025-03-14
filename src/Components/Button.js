import React, { useEffect } from "react";
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform} from 'react-native';
import defaultStyles from "../Utils/defaultStyles";
import { responsiveFontSize, scale, scaledWidth } from "../Utils/responsiveUtils";
import colors from "../Utils/colors";

export const Button = (props) => {
    let {
        linear,
        children,
        onPress,
        title,
        backgroundColor,
        color,
        colorsLinear,
        start,
        end,
        circle,
        radius,
        style,
        bold,
        size,
        elevation,
        loading,
        ...rest
    } = props;

    let linearProps = linear ? {
        start: start ? start : { x: 0, y: 0 },
        end: end ? end : { x: 1, y: 0.5 },
        colors: colorsLinear ? colorsLinear : ['#1B3862', '#1F4F94']
    } : {};

    let radiusProps = {};

    circle && (
        radiusProps = {
            width: scaledWidth(circle),
            height: scaledWidth(circle),
            borderRadius: scaledWidth(circle) / 2,
        }
    );

    let elevationProps = {};
    elevation && (
        elevationProps = {
            elevation: elevation,
            shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.6,
            shadowColor: colors.MainBlue,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 }
        }
    );

    return (
        <TouchableOpacity {...rest}
            style={[defaultStyles.button, backgroundColor && { backgroundColor: backgroundColor }, radius && { borderRadius: scale(radius) },
                elevationProps, radiusProps, style]}
            onPress={loading ? undefined : onPress} activeOpacity={0.9}>
            {linear && <LinearGradient {...linearProps} style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }, radius && { borderRadius: scale(radius) }, radiusProps]} />}
            {loading ? <ActivityIndicator color={defaultStyles.buttonLoading} size={responsiveFontSize(7)} /> :
                <>
                    {title && <Text style={[bold ? defaultStyles.textBold : defaultStyles.text, color && { color: color }, size && { fontSize: responsiveFontSize(size) }]}>{title}</Text>}
                    {children}
                </>}
        </TouchableOpacity>
    );
}