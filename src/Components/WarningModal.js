import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Button } from "../Components/Button";
import { Text } from "../Components/Text";
import { scale } from "../Utils/responsiveUtils";
import Images from "../Assets/Images";
import colors from "../Utils/colors";
import { scaledWidth } from "../Utils/responsiveUtils";
import { Icon } from "./Icon";
import { Image } from "./Image";

export default WarningModal = (props) => {
    const { t, i18n } = useTranslation();
    return (
        <Modal visible={props.visible} animationType="none" transparent={true}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => {
                props.dismiss();
            }}>
                <TouchableWithoutFeedback>
                    <View style={{
                        alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20),
                        paddingHorizontal: scale(10), paddingVertical: scale(15), backgroundColor: 'white',
                    }}>
                        <TouchableOpacity style={{
                            position: 'absolute', right: scale(10),
                            top: scale(15), alignItems: 'center', justifyContent: 'center',
                            width: scaledWidth(8), height: scaledWidth(8), borderRadius: scaledWidth(8) / 2, backgroundColor: 'rgba(118, 118, 128, 0.12)'
                        }} onPress={() => {
                            props.dismiss();
                        }}>
                            <Icon name="close" type="IonIcons" size={9.5} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <Image source={Images.warningIcon} equalSize={30} noLoad style={{ marginTop: scale(5) }} />
                        <Text size={9} style={{ marginTop: scale(10), marginBottom: scale(20), marginHorizontal: scale(40), textAlign: 'center' }}>{t('serviceUnavailable')}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}