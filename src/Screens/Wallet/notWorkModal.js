import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Button } from "../../Components/Button";
import { Text } from "../../Components/Text";
import { scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import Images from "../../Assets/Images";
import colors from "../../Utils/colors";
import { Icon } from "../../Components/Icon";
import { Image } from "../../Components/Image";

export default NotWorkModal = (props) => {


    const { t, i18n } = useTranslation();



    return (
        <Modal visible={props.visible} animationType="none" transparent={true}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => {
                props.dismiss();
            }}>
                <TouchableWithoutFeedback>
                    <View style={{
                        alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20),
                        paddingHorizontal: scale(10), paddingVertical: scale(60), backgroundColor: colors.grayBackgroung,
                    }}>
                        <View style={{ height: scaledHeight(15), width: scaledWidth(95), marginVertical: scale(2), alignItems: 'center' }}>
                            <Button linear circle={25} style={{ marginTop: -25, }} activeOpacity={1}  >
                                <Icon name="close-sharp" type="IonIcons" size={25} />
                            </Button>
                            <Text color={'#CA944B'} bold size={8} style={{marginVertical:scale(10)}}>{props.text}</Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center', borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(5), borderRadius: scale(50), marginTop: scale(18) }}>
                                <Button radius={25} backgroundColor={colors.MainBlue} elevation={2} style={{ paddingHorizontal: scale(60), }} onPress={() => {props.dismiss(true); }

                                }>
                                    <Text style={{ marginHorizontal: scale(7) }} bold size={8.5} color="white">{t('Close')}</Text>
                                </Button>
                            </View>
                        </View>
                        <View style={{ height: scaledHeight(8), }} />
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}