import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View } from 'react-native';
import { Button } from "../../../Components/Button";
import { Text } from "../../../Components/Text";
import { scale } from "../../../Utils/responsiveUtils";

export default LogoutModal = (props) => {
    const { t, i18n }  = useTranslation();
    return (
        <Modal visible={props.visible} animationType="none" transparent={true}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{
                    alignSelf: 'stretch', justifyContent: 'center', marginHorizontal: scale(20), borderRadius: scale(15),
                    paddingHorizontal: scale(15), paddingVertical: scale(10), backgroundColor: 'white',
                }}>
                    <Text size={8} semiBold>{props.title ? props.title : t('sureLogout')}</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-end', marginTop: scale(30) }}>
                        <Button size={7} title={t('CANCEL')} style={{ paddingHorizontal: 0, paddingVertical: 0 }} onPress={() => {
                            props.dismiss(false);
                        }} />
                        <View style={{ marginHorizontal: scale(10) }} />
                        <Button size={7} title={t('CONFIRM')} style={{ paddingHorizontal: 0, paddingVertical: 0 }} onPress={() => {
                            props.dismiss(true);
                        }} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}