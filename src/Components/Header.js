import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Platform, Linking, ActivityIndicator } from 'react-native';
import colors from "../Utils/colors";
import defaultStyles from "../Utils/defaultStyles";
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../Utils/responsiveUtils";
import { Text } from "./Text";
import { Image } from './Image';
import Images from "../Assets/Images";
import { Icon } from './Icon';
import { useSelector } from "react-redux";
import Navigation from "../Utils/Navigation";
import Communications from 'react-native-communications';
import { store } from "../Redux/store";
import { MadelLogin } from "./ModelLogin";
export const Header = (props) => {
    const [serviceModalVisible, setServiceModalVisible] = useState(false);

    const { rtl, company, notifCount } = useSelector((state) => ({
        rtl: state.lang.rtl,
        company: state.auth.company,
        notifCount: state.auth.notifCount,
    }));

    let renderRight = () => {
        return (
            <React.Fragment>
                {props.notif ? <TouchableOpacity activeOpacity={0.8} style={{ padding: scale(10),marginHorizontal:scale(10),backgroundColor:colors.grayBack ,borderRadius:scale(25)}}
                    onPress={
                        () => {
                            if (!store.getState().auth.token) {
                                setServiceModalVisible(true);
                            } else {
                                Navigation.push(
                                    {
                                        name: "Notifications", options: {
                                            statusBar: {
                                                backgroundColor: colors.grayBackgroung
                                            }
                                        }
                                    })
                            }
                        }}
                >
                    <Image source={notifCount && notifCount > 0 ? Images.notifIcon : Images.notifEIcon} equalSize={6.2} noLoad />
                </TouchableOpacity> : null}
                {props.back ? <TouchableOpacity activeOpacity={0.8} style={{
                    paddingHorizontal: scale(6), color: "white", elevation: 2, backgroundColor: colors.Whitebackground, marginHorizontal: scale(15),
                    borderRadius: scale(25), shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.5,
                    width: scaledWidth(10),
                    height: scaledWidth(10),
                    shadowRadius: scale(25),
                    alignContent: "center",
                    justifyContent: "center",
                    shadowOffset: { width: 0, height: 4 }
                }} onPress={() => {
                    Navigation.pop();
                }}>
                    <Icon name="arrow-forward" type="MaterialIcons" size={12} color={colors.MainBlue} reverse />
                </TouchableOpacity> : null}
                {props.backToHome ? <TouchableOpacity activeOpacity={0.8} style={{
                    paddingHorizontal: scale(6), color: "white", elevation: 2, backgroundColor: colors.Whitebackground, marginHorizontal: scale(15),
                    borderRadius: scale(25), shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.5,
                    width: scaledWidth(10),
                    height: scaledWidth(10),
                    shadowRadius: scale(25),
                    alignContent: "center",
                    justifyContent: "center",
                    shadowOffset: { width: 0, height: 4 }
                }} onPress={() => {
                    Navigation.pop();

                }}>
                    <Icon name="arrow-forward" type="MaterialIcons" size={12} color={colors.MainBlue} reverse />
                </TouchableOpacity> : null}

            </React.Fragment>
        );
    }

    let renderLeft = () => {
        return (
            <React.Fragment>
                {props.support ? <TouchableOpacity activeOpacity={0.8} style={{
                    justifyContent: 'center', alignItems: 'center',
                    marginHorizontal: scale(8),
                }}
                    onPress={() => {
                        if (!store.getState().auth.token) {
                            setServiceModalVisible(true);
                        } else {
                            Navigation.push(
                                {
                                    name: "Support", options: {
                                        statusBar: {
                                            backgroundColor: colors.grayBackgroung
                                        }
                                    }
                                })
                        }
                    }}
                >
                    <Image source={props.chatcolor ? Images.chatGifColor : Images.chatGif} equalSize={scale(12)} noLoad />
                </TouchableOpacity> : null}
                {props.share ? props.shareLoading ? <ActivityIndicator color={colors.highlight} size={responsiveFontSize(10)} style={{ paddingHorizontal: scale(6) }} /> :
                    <TouchableOpacity activeOpacity={0.8} style={{ paddingHorizontal: scale(6) }} onPress={() => {
                        props.onSharePress();
                    }}>
                        <Icon name="share" type="Entypo" size={12} color={colors.highlight} />
                    </TouchableOpacity> : null}
            </React.Fragment>
        );
    }

    return (
        <View style={[defaultStyles.headerContainer, props.style]}>
            <View style={{ flex: 0.22, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', paddingStart: scale(5) }}>
                {renderRight()}
            </View>
            <View style={{ flex: 0.56, alignItems: 'center', justifyContent: 'center' }}>
                {props.logo ? <Image source={Images.logoTabActive} noLoad equalSize={scale(27)} /> : <Text color={colors.MainBlue} size={scale(8)} numberOfLines={1} semiBold>{props.title}</Text>}
            </View>
            <View style={{ flex: 0.22, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', paddingEnd: scale(5) }}>
                {renderLeft()}
            </View>
            <MadelLogin visible={serviceModalVisible} dismiss={() => {
                setServiceModalVisible(false);
            }} method={() => {
                Navigation.push({
                    name: 'Login', options: {
                        statusBar: {
                            backgroundColor: colors.animationColor,
                            // style: 'light'
                        }
                    }
                });
            }}>

            </MadelLogin>
        </View>
    );
}