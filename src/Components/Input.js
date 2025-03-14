import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import colors from "../Utils/colors";
import { Icon } from "./Icon";
import defaultStyles from "../Utils/defaultStyles";
import { responsiveFontSize, scale, scaledWidth } from "../Utils/responsiveUtils";
import { Image } from "./Image";
import Images from "../Assets/Images";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useSelector } from "react-redux";

export const Input = (props) => {
    const rtl = useSelector(state => state.lang.rtl);
    const [showSecure, setShowSecure] = useState(props.keyboardType === 'password' ? true : false);
    const [countryModalVisible, setCountryModalVisible] = useState(false);

    let { ...rest } = props;

    /*
    keyboard types:
        default
        number-pad
        numeric
        email-address
        url
    */

    let renderIcon = () => {
        if (props.keyboardType === 'password') {
            return (
                <TouchableOpacity style={{ justifyContent: 'flex-start', alignSelf: 'center', padding: scale(8),margin:scale(4),backgroundColor:colors.goldbackground,borderRadius:scale(8) }} activeOpacity={1} onPress={() => {
                    setShowSecure(!showSecure);
                }}>
                    <IonIcons name={showSecure ? "eye-off" : "eye"} size={responsiveFontSize(9)} color={colors.highlight} />
                </TouchableOpacity>
            );
        }
        return (
            <View style={{ justifyContent: 'center', padding: scale(8),margin:scale(4),backgroundColor: props.active?colors.grayBackgroung:colors.goldbackground,borderRadius:scale(8), }}>
                {props.icon}
            </View>
        );
    }

    let renderCountryPicker = () => {
        // return (
        //     <TouchableOpacity style={{ flexDirection: rtl ? 'row-reverse' : 'row', paddingEnd: scale(3), alignItems: 'center' }} onPress={() => setCountryModalVisible(true)}>
        //         <Flag countryCode={props.country.countryCode} flagSize={responsiveFontSize(9)} flagStyle={{ width: scaledWidth(7), marginEnd: 0, marginStart: 0 }} />
        //         <Text style={[defaultStyles.text, { color: colors.highlight, textAlignVertical: 'center', paddingBottom: scale(2.5), fontSize: responsiveFontSize(8.5) }]}>{`+`}</Text>
        //         <Text style={[defaultStyles.text, { color: colors.highlight, textAlignVertical: 'center', fontSize: responsiveFontSize(6.5) }]}>{`${props.country.cca2}`}</Text>
        //     </TouchableOpacity>
        // );
        return (
            <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', paddingEnd: scale(3), alignItems: 'center' }}>
                <Text style={[defaultStyles.text, { color: colors.highlight, textAlignVertical: 'center', paddingBottom: scale(2.5), fontSize: responsiveFontSize(8.5) }]}>{`+`}</Text>
                <Text style={[defaultStyles.text, { color: colors.highlight, textAlignVertical: 'center', fontSize: responsiveFontSize(6.5) }]}>{`${218}`}</Text>
            </View>
        );
    }

    const onChangeText = (text) => {
        if (props.setTouched && props.name) {
            props.setTouched({ ...props.touched, [props.name]: true });
        }
        if (props.onChangeText) {
            props.onChangeText(text);
        }
    }

    return (
        <View style={[{ alignSelf: 'stretch',backgroundColor:colors.Whitebackground,borderRadius:scale(15) }, props.containerStyle]}>
            <View style={[{ alignSelf: 'stretch' }, defaultStyles.inputContainer, props.inputStyle]}>
                {props.title && <Text style={[defaultStyles.inputTitleText, props.titleStyle, { textAlign: 'left' }]}>{props.title}</Text>}
                <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
                    {props.country ? renderCountryPicker() : null}
                    <TextInput {...rest} ref={r => {
                        if (props.customRef) {
                            props.customRef(r);
                        }
                    }}
                        style={[defaultStyles.input, { textAlign: rtl ? 'right' : 'left', textAlignVertical: 'center' }, props.style]} secureTextEntry={showSecure} cursorColor={colors.textPrimary}
                        defaultValue={props.defaultValue} placeholder={props.placeholder} editable={!props.NoEdit} placeholderTextColor={defaultStyles.inputPlaceholderColor} keyboardType={props.keyboardType === 'password' || !props.keyboardType ? 'default' : props.keyboardType}
                        onChange={props.onChange} onChangeText={onChangeText} maxLength={props.maxLength} multiline={props.multiline} returnKeyType={props.returnKeyType ? props.returnKeyType : 'done'} />
                    {props.icon || props.keyboardType === 'password' ? renderIcon() : null}
                </View>
            </View>
            {props.error && <Text style={[defaultStyles.inputError, { textAlign: 'left' }]}>{props.error}</Text>}
            {countryModalVisible && <CountryPicker visible={countryModalVisible} withFilter={true} countryCode={props.country.countryCode} onClose={() => { setCountryModalVisible(false) }}
                onSelect={(data) => {
                    if (props.setCountry) {
                        props.setCountry(data);
                    }
                }} excludeCountries={['AQ', 'IL']} />}
        </View>
    );
}