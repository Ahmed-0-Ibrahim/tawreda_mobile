import React, { useEffect, useState } from "react";
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Navigation from "../Utils/Navigation";
import { ModalToast } from "./ModalToast";

export default ImagePicker = (props) => {
    const { t, i18n } = useTranslation();

    const [toast, setToast] = useState({ message: '', type: '', activate: false });

    const options = {
        mediaType: 'photo',
        quality: 0.7,
        presentationStyle: 'overCurrentContext'
    }

    const cameraFn = () => {
        launchCamera(options, (response) => {
            console.log("RESPONSE:::: ", response);
            if (response.didCancel) {
                props.dismiss();
            }
            else if (response.errorCode === 'permission') {
                setToast({ message: t('cameraPermissionNeeded'), type: 'info', activate: true });
            }
            else if (response.assets && response.assets.length > 0) {
                props.onDone({
                    uri: response.assets[0].uri,
                    type: response.assets[0].type ? response.assets[0].type : 'image/png',
                    name: response.assets[0].fileName ? response.assets[0].fileName : 'fileName',
                });
            }
        });
    }

    const galleryFn = () => {
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                // props.dismiss();
            }
            else if (response.errorCode === 'permission') {
                setToast({ message: t('cameraPermissionNeeded'), type: 'info', activate: true });
            }
            else if (response.assets && response.assets.length > 0) {
                props.onDone({
                    uri: response.assets[0].uri,
                    type: response.assets[0].type ? response.assets[0].type : 'image/png',
                    name: response.assets[0].fileName ? response.assets[0].fileName : 'fileName',
                });
            }
        });
    }


    return (
        <Modal visible={props.visible} animationType="none" transparent={true}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{
                    alignSelf: 'stretch', justifyContent: 'center', marginHorizontal: scale(20), borderRadius: scale(15),
                    paddingHorizontal: scale(15), paddingVertical: scale(10), backgroundColor: 'white',
                }}>
                    <Text size={8} semiBold>{t('chooseImageFrom')}</Text>
                    <View style={{ alignSelf: 'stretch', marginTop: scale(10) }}>
                        <Button size={7} title={t('camera')} style={{ paddingHorizontal: 0, paddingVertical: 0, marginBottom: scale(5) }} onPress={() => {
                            cameraFn();
                        }} />
                        <View style={{ marginHorizontal: scale(10), borderBottomColor: '#F2F2F2', borderBottomWidth: 1.5 }} />
                        <Button size={7} title={t('gallery')} style={{ paddingHorizontal: 0, paddingVertical: 0, marginTop: scale(5) }} onPress={() => {
                            galleryFn();
                        }} />
                        <View style={{ alignSelf: 'flex-end' }}>
                            <Button size={7} title={t('CANCEL')} style={{ paddingHorizontal: 0, paddingVertical: 0 }} onPress={() => {
                                props.dismiss();
                            }} />
                        </View>
                    </View>
                </View>
            </View>
            <ModalToast activate={toast.activate} message={toast.message} type={toast.type} hide={() => {
                setToast({ ...toast, activate: false });
            }} />
        </Modal>
    );
}