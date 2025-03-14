import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from "../../Components/Button"
import { Text } from "../../Components/Text";
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import { Image } from "../../Components/Image";
import ImageViewer from "react-native-image-zoom-viewer";
import { API_ENDPOINT } from "../../configs";
import colors from "../../Utils/colors";
import { Icon } from "../../Components/Icon";

export default ShowImageModal = (props) => {
    const { t, i18n } = useTranslation();
    return (
        <Modal visible={props.visible} animationType="none" transparent={true}>
            <View style={{
                ...StyleSheet.absoluteFill,
                backgroundColor: "rgba(0,0,0,0.5)"
            }}>
                <View style={{ backgroundColor: 'white', borderRadius: 18, flex: 1, marginHorizontal: scale(10), marginTop: scale(100), marginBottom: scale(80) }}>
                    <ImageViewer backgroundColor="transparent" imageUrls={props.image ? [{ url: `${API_ENDPOINT}/${props.image}` }] : []}
                        renderIndicator={(currentIndex) => null}
                        enableImageZoom={true}
                        loadingRender={() => <ActivityIndicator size={responsiveFontSize(12)} color={colors.textPrimary} />}
                        renderImage={(props) =>
                            <Image source={props.source} style={props.style} resizeMode="cover" />
                        }
                    />
                </View>
                <TouchableOpacity style={{
                    position: 'absolute', zIndex: 501, top: 0, right: 0, marginTop: scale(40), marginHorizontal: scale(20), borderRadius: scaledWidth(4),
                    width: scaledWidth(8), height: scaledWidth(8), backgroundColor: 'rgba(255,255,255,0.12)',
                    alignItems: 'center', justifyContent: 'center'
                }} onPress={() => {
                    props.dismiss();
                }}>
                    <Icon name="close" type="Ionicons" color="white" size={9} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}