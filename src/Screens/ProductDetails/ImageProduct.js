import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { Image } from '../../Components/Image';
import { scale } from '../../Utils/responsiveUtils';
import Images from '../../Assets/Images';
import { API_ENDPOINT } from '../../configs';
import { Modal } from "react-native";
import ImageViewer from 'react-native-image-zoom-viewer';
export default IamgeProduct = (props) => {
    const { t, i18n } = useTranslation();
    const [serviceModalVisible, setServiceModalVisible] = useState(false);

    return (
        <View style={{
            borderRadius: scale(15),
            borderColor: '#B7B7B7',
            borderWidth: 1,

            marginLeft: scale(8)
        }}>
            <TouchableOpacity onPress={() => {
                setServiceModalVisible(true)
            }} >
                <Image source={{ uri: `${API_ENDPOINT}/${props.product}` }} equalSize={17} resizeMode={'contain'} style={{ alignContent: "center", alignItems: "center", justifyContent: "center", alignSelf: "center", }} />
                <Modal visible={serviceModalVisible} transparent={true} onRequestClose={() => {
                    setServiceModalVisible(false)
                }} animationType="fade">
                    <ImageViewer backgroundColor={"#00000088"} imageUrls={[{ url: `${API_ENDPOINT}${props.product}` }]} onCancel={() => {
                        setServiceModalVisible(false)
                    }} enableSwipeDown />
                </Modal>
            </TouchableOpacity>

        </View>
    );
}