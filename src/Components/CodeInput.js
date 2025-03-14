import React, { useEffect, useRef, useState } from "react";
import { View, TextInput } from 'react-native';
import { useSelector } from "react-redux";
import colors from "../Utils/colors";
import defaultStyles from "../Utils/defaultStyles";
import { scale, scaledHeight, scaledWidth } from "../Utils/responsiveUtils";

export const CodeInput = (props) => {
    const rtl = useSelector(state => state.lang.rtl);
    const [code, setCode] = useState(new Array(props.size || 4).fill());
    const inputRefs = useRef(new Array(props.size || 4).fill({}));
    const inpRef = useRef();

    const handleInput = (text, index) => {
        let _code = code.slice();
        if (text) {
            _code[index] = text;
            setCode([..._code]);
            if (props.onChange) {
                _code = _code.toString();
                _code = _code.replace(/,/g, '');
                props.onChange(_code);
            }
            if (index + 1 >= (props.size || 4)) {
                inputRefs.current[inputRefs.current.length - 1].blur();
                if (props.onDone && _code.length === (props.size || 4)) {
                    props.onDone(_code);
                }
                return;
            }
            inputRefs.current[index + 1].focus();
        }
        else {
            _code[index] = text;
            setCode([..._code]);
            if (props.onChange) {
                _code = _code.toString();
                _code = _code.replace(/,/g, '');
                props.onChange(_code);
            }
        }
    }

    const renderInput = () => {
        let inputs = new Array(props.size || 4).fill({});
        let render = inputs.map((item, index) => {
            return (
                <TextInput key={`id_${index}`} placeholder="-" placeholderTextColor={defaultStyles.inputPlaceholderColor} cursorColor={colors.MainBlue}
                    ref={r => inputRefs.current[index] = r} onChangeText={(text) => handleInput(text, index)}
                    style={[defaultStyles.input, defaultStyles.inputContainer, props.codeStyle, { textAlign: 'center',backgroundColor:colors.Whitebackground,borderRadius:scale(15),height:scaledWidth(15),width:scaledWidth(25),borderColor:colors.Gray2,borderWidth:scale(0.35)}]} maxLength={1} keyboardType="number-pad" autoFocus={index === 0} />
            );
        })

        return render;
    }

    return (
        <View style={[{ justifyContent: 'space-between', alignSelf: 'stretch', alignItems: 'center', flexDirection: rtl ? 'row-reverse' : 'row'}, props.style]}>
            {renderInput()}
        </View>
    );

}