import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, RefreshControl, ScrollView } from 'react-native';
import { useSelector, useDispatch, connect } from 'react-redux';
import Images from "../../Assets/Images";
import { Header } from "../../Components/Header";
import { Icon } from "../../Components/Icon";
import { Input } from "../../Components/Input";
import { Text } from "../../Components/Text";
import { Image } from "../../Components/Image";
import colors from "../../Utils/colors";
import defaultStyles from "../../Utils/defaultStyles";
import { scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import { Button } from "../../Components/Button";
import ImagePicker from "../../Components/ImagePicker";
import { Bubble } from "./Bubble";
import { createMessageOnComplaintApi, getChatForComplaintApi } from "../../Utils/api";
import Navigation from "../../Utils/Navigation";
import { refresh } from "../../Redux/list";
import { LottieLoading } from "../../Components/LottieLoading";

const Chat = (props) => {
    const { t, i18n } = useTranslation();
    const [keyboardShown, setKeyboardShown] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [image, setImage] = useState();
    const [text, setText] = useState();
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const inpRef = useRef();

    const dispatch = useDispatch();

    useEffect(() => {
        let keyboardShowListener = Keyboard.addListener('keyboardWillShow', () => {
            setKeyboardShown(true);
        });
        let keyboardHideListener = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardShown(false);
        })
        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        }
    }, []);

    useEffect(() => {
        getMessages(page);
    }, [page]);

    useEffect(() => {
        setPage(1);
        getMessages(1);
    }, [props.chatItem]);

    const getMessages = (page) => {
        if (page > pageCount && pageCount !== 0) {
            return;
        }
        console.log("FETCHING MESSAGES:::::");
        setLoading(true);
        getChatForComplaintApi(props.complaint, page).then(res => {
            setPageCount(res.pageCount)
            if (page === 1) {
                setMessages(res.data);
            }
            else {
                setMessages([...messages, ...res.data]);
            }
            setLoading(false);
            setError(false);
            dispatch(refresh('chatList'));
        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }

    const onSendMessage = () => {
        if (image || text) {
            let body = { complaint: props.complaint };
            console.log("complainttttttttttttt",props.complaint)
            text ? body.text = text : null;
            image ? body.file = image : null;
            console.log("bodyyyyy",body)
            setLoadingSubmit(true);
            createMessageOnComplaintApi(body).then(res => {
                dispatch(refresh('chatItem'));
                setLoadingSubmit(false);
                setImage(null);
                setText(null);
                if (inpRef && inpRef.current) {
                    inpRef.current.clear();
                }
            }).catch(error => {
                setLoadingSubmit(false);
                console.log("errorrrrrr",error)
                Navigation.showOverlay(error, 'fail');
            })
        }
    }


    const renderHeader = () => {
        return (
            <View style={{ alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', backgroundColor: '#C02430', paddingVertical: scale(3) }}>
                <Text color="white" numberOfLines={1}>{typeof props.title === 'object' ? props.title[i18n.language] : props.title}</Text>
            </View>
        );
    }

    const renderInput = () => {
        return (
            <View style={{
                alignSelf: 'stretch', backgroundColor: 'white', elevation: 20, ...defaultStyles.elevationGame(0.5), paddingHorizontal: scale(8), paddingVertical: scale(10),
                flexDirection: 'row', alignItems: 'center',
            }}>
                <ScrollView style={{ alignSelf: 'stretch', backgroundColor: '#F6F6F6', borderRadius: 20, flex: 1 }}>
                    <Input containerStyle={{ flex: 1 }} customRef={r => inpRef.current = r}
                        inputStyle={{ borderBottomWidth: 0, paddingHorizontal: scale(10), paddingVertical: scale(6), alignSelf: 'stretch' }}
                        icon={<TouchableOpacity onPress={() => {
                            setImageModalVisible(true);
                        }}><Image source={Images.cameraIcon} equalSize={6} /></TouchableOpacity>} placeholder={t('sendMessage')}
                        onChangeText={(text) => {
                            setText(text);
                        }} />
                    {image ?
                        <View style={{ alignSelf: 'center' }}>
                            <View style={{ marginVertical: scale(5) }}>
                                <Image source={{ uri: image.uri }} width={60} height={15} resizeMode="stretch" style={{ borderRadius: 10 }} />
                            </View>
                            <TouchableOpacity style={{
                                position: 'absolute', left: 5, top: 10, alignItems: 'center', justifyContent: 'center', zIndex: 301,
                                backgroundColor: '#C02430', width: scaledWidth(6), height: scaledWidth(6), borderRadius: scaledWidth(6) / 2
                            }} onPress={() => { setImage(null) }}>
                                <Icon name="close" type="FontAwesome" color="white" size={7} />
                            </TouchableOpacity>
                        </View> : null}
                </ScrollView>
                <View style={{ marginHorizontal: scale(4) }} />
                <Button linear circle={12} elevation={2} loading={loadingSubmit} onPress={() => {
                    onSendMessage();
                }}>
                    <Icon color={'#FFFFFF'} name={'ios-send'} type={'Ionicons'} size={11}
                        style={{ textAlign: 'center', alignSelf: 'center', justifyContent: 'center', transform: [i18n.language === 'ar' ? { scaleX: -1 } : { scaleX: 1 }] }} />
                </Button>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bgS }}>
            <Header style={{ backgroundColor: '#F5F6FA', }} title={t('support')} back />
            {/*renderHeader()*/}
            <View style={{ backgroundColor: '#F5F6FA', width: scaledWidth(100), paddingHorizontal: scale(15) }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between', backgroundColor: "#FFFFFF",
                    borderRadius: scale(10), paddingHorizontal: scale(10), paddingVertical: scale(4), marginBottom: scale(10)
                }}>
                    <Text color={'#CA944B'} style={{ alignSelf: "center" }} bold size={7.8}>{props.title/*typeof props.item.message.complaint.title === 'object' ? props.item.message.complaint.title[i18n.language] : props.item.message.complaint.title*/}</Text>
                    <View style={{ marginVertical: scale(5), width: scaledWidth(30), backgroundColor: "#FFFFFF", alignItems: "center", borderRadius: 5, borderColor: "#EAEAEA", borderWidth: .5 }}>
                        <Text style={{ alignSelf: "center" }} color={props.status === 'RESPONDING' ? "#CA944B" :props.status === 'WAITING' ?"rgba(27, 56, 98, 1)": "#8F959E"} size={7}>{props.status==="RESPONDING" ? t("workingOn") :props.status==="ANSWERED" ? t("FinshedComplement"):t("pending")}</Text>
                    </View>
                </View>
            </View>
            <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="padding" style={{ alignSelf: 'stretch', flex: 1 }}>
                <FlatList showsVerticalScrollIndicator={false} style={{ flex: 1 }} data={messages} contentContainerStyle={{ flexGrow: 1, marginTop: keyboardShown ? scale(45) : 0 }}
                    inverted={true}
                    ListEmptyComponent={<View style={{ flex: 1 }}></View>}
                    renderItem={({ item }) => <Bubble item={item} />}
                    onEndReachedThreshold={0.2}
                    onEndReached={(d) => setPage(prev => prev + 1)}
                    refreshControl={<RefreshControl refreshing={loading && messages.length > 0} onRefresh={() => {
                        setPage(1);
                        getMessages(1);
                    }} />}
                    ListFooterComponent={loading && messages.length > 0 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieLoading lottieStyle={{
                            width: scaledWidth(100),
                            height: scaledHeight(12)
                        }} loading={true} />
                    </View> : null} />
                {props.closed ? null : renderInput()}
            </KeyboardAvoidingView>
            <ImagePicker visible={imageModalVisible} dismiss={() => {
                setImageModalVisible(false);
            }} onDone={(res) => {
                console.log("RES::::: ", res);
                setImage(res);
                setImageModalVisible(false);
            }} />
        </View>
    );
}

const mapStateToProps = state => ({
    chatItem: state.list.chatItem,
    user: state.auth.user,
});

export default connect(mapStateToProps)(Chat);