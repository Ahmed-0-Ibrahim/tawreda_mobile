import React, { Component } from 'react';
import { Text as NText } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../Utils/colors';
import defaultStyles from '../Utils/defaultStyles';
import { responsiveFontSize, scale } from '../Utils/responsiveUtils';

export const Text = (props) => {
    const rtl = useSelector(state => state.lang.rtl);
    let {
        size,
        color,
        style,
        semiBold,
        bold,
        ...rest
    } = props;
    return (
        <NText {...rest} style={[{ ...defaultStyles.text }, 
            { textAlign: 'left' },
            bold ? { fontFamily: 'Vazirmatn-Bold' } : semiBold ? { fontFamily: 'Vazirmatn-Medium' } : { fontFamily: 'Vazirmatn-Regular' },
            color ? { color: color } : null,
            size ? { fontSize: responsiveFontSize(size) } : {}, style]}>
            {props.children}
        </NText>
    );
}