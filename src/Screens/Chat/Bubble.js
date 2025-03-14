import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, StyleSheet } from 'react-native';
import Images from "../../Assets/Images";
import { Header } from "../../Components/Header";
import { Icon } from "../../Components/Icon";
import { Input } from "../../Components/Input";
import { Text } from "../../Components/Text";
import { Image } from "../../Components/Image";
import colors from "../../Utils/colors";
import defaultStyles from "../../Utils/defaultStyles";
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import { Button } from "../../Components/Button";
import moment from "moment";
import { useSelector } from "react-redux";
import { API_ENDPOINT } from "../../configs";
import ImageViewer from "react-native-image-zoom-viewer";
import { Modal } from "react-native";

export const Bubble = (props) => {

    const { item } = props;
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const { user, rtl } = useSelector(state => ({
        user: state.auth.user,
        rtl: state.lang.rtl,
    }));
    const images = [{ url: `${API_ENDPOINT}${item.message.image}` }];
    const styles = StyleSheet.create({
        itemStyle: {
            alignSelf: 'stretch',
            marginHorizontal: scale(10),
            marginTop: scale(15),
        },
        timeStyleRight: {
            alignSelf: !rtl ? 'flex-end' : 'flex-start',
            paddingHorizontal: scale(10),
        },
        timeStyleLeft: {
            alignSelf: !rtl ? 'flex-start' : 'flex-end',
            paddingHorizontal: scale(40),
        },
        bubbleStyleRight: {
            alignSelf: 'flex-end',
            maxWidth: '65%',
            paddingHorizontal: scale(10),
            paddingVertical: scale(5),
            borderRadius: 20,
            backgroundColor: '#E9E9EB',
        },
        bubbleStyleLeft: {
            alignSelf: 'flex-start',
            maxWidth: '65%',
            paddingHorizontal: scale(10),
            paddingVertical: scale(10),
            borderRadius: 20,
            backgroundColor: '#12107E',
        },
        textStyleLeft: {
            color: 'white',
            fontSize: responsiveFontSize(7),
            textAlign: 'right'
        },
        textStyleRight: {
            color: '#1E1E1E',
            fontSize: responsiveFontSize(7),
            textAlign: 'left'
        }
    })

    useEffect(() => {
        console.log("ITEM::: ", props.item);
    }, []);

    return (
        <View style={styles.itemStyle}>
            <View style={{ flexDirection: item.sender.id !== user.id ? rtl ? 'row-reverse' : 'row' : rtl ? 'row' : 'row-reverse', alignSelf: 'stretch' }}>
                {item.sender.id !== user.id ? <View style={{ alignSelf: 'stretch', justifyContent: 'flex-end' }}>
                    <Image source={Images.logo} equalSize={9} style={{ borderRadius: scaledWidth(9) / 2, borderWidth: 1, borderColor: '#ABABAB' }} />
                </View> : null}
                <View style={{ marginHorizontal: scale(3) }} />
                <View style={item.sender.id === user.id ? styles.bubbleStyleRight : styles.bubbleStyleLeft}>
                    {item.message.text ? <Text style={item.sender.id === user.id ? styles.textStyleRight : styles.textStyleLeft}>{item.message.text}</Text> : null}
                    {item.message.image ? <TouchableOpacity onPress={() => {
                        setServiceModalVisible(true)
                    }}>
                        <Image source={{ uri: `${API_ENDPOINT}${item.message.image}` }} width={40} height={30} />
                        <Modal visible={serviceModalVisible} transparent={true} onRequestClose={() => {
                            setServiceModalVisible(false)
                        }} animationType="fade">
                            <ImageViewer imageUrls={[{ url: `${API_ENDPOINT}${item.message.image}` }]} onCancel={() => {
                                setServiceModalVisible(false)
                            }} enableSwipeDown />
                        </Modal>
                    </TouchableOpacity> : null}
                    {/* {item.message.image ? <ImageViewer imageUrls={[{ url: `${API_ENDPOINT}${item.message.image}` }]} width={40} height={30} /> : null} */}
                </View>
            </View>
            <View style={item.sender.id === user.id ? styles.timeStyleRight : styles.timeStyleLeft}>
                <Text color="#697278" size={5.5}>{moment(item.createdAt).format('DD/MM/YYYY - hh:mmA')}</Text>
            </View>
        </View>
    );
}