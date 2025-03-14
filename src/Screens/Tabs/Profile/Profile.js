import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, Linking, Dimensions } from 'react-native';
import { useSelector, connect } from 'react-redux';
import Images from '../../../Assets/Images';
import { Header } from '../../../Components/Header';
import { Image } from '../../../Components/Image';
import { TabBar } from '../../../Components/TabBar';
import { scale, scaledHeight, scaledWidth } from '../../../Utils/responsiveUtils';
import { Text } from '../../../Components/Text';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../Components/Button';
import { Icon } from '../../../Components/Icon';
import defaultStyles from '../../../Utils/defaultStyles';
import { Item } from './Item';
import LogoutModal from './LogoutModal';
import { logoutFn } from '../../../Redux/auth';
import Navigation from '../../../Utils/Navigation';
import colors from '../../../Utils/colors';
import Communications from 'react-native-communications';
import Share from 'react-native-share';
import { INVITE_LINK } from '../../../configs';
import { MadelLogin } from '../../../Components/ModelLogin'
import { deleteAccountApi, incrementShareCountApi } from '../../../Utils/api';
import { store } from '../../../Redux/store';
const Profile = (props) => {
    const { user, company } = useSelector(state => state.auth);
    console.log("ussssssssssssssssssssssssssssser", user ? "im here" : "no login ");
    const [logoutVisible, setLogoutVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const [serviceModalVisible, setServiceModalVisible] = useState(false);


    const shareOptions = {
        title: '',
        message: t('shareMessage') + '\n' + "https://open.spotify.com/episode/13m7YKIdH0WmLPgVUnqU7M?si=6eab42ca259242aa",//+ INVITE_LINK,
        url: '',
        subject: 'Share Link', //  for email
    }

    const deleteAccount = () => {
        setLoading(true);
        deleteAccountApi().then(res => {
            setLoading(false);
            Navigation.showOverlay(t('accountDeleted'));
            logoutFn();
        }).catch(error => {
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.Whitebackground }}>
            <Image source={Images.backgrounfGif} resizeMode={"cover"} style={{ position: "absolute", width: scaledWidth(100), height: scaledHeight(50), left: 0, right: 0, top: 0 }} />
            <View style={{ flex: 1, color: colors.Whitebackground }}>
                <Header logo support notif chatcolor />
                <ScrollView style={{ flex: 1, marginBottom: defaultStyles.marginTab, }} showsVerticalScrollIndicator={false}>

                    <View style={{
                        alignItems: 'center', marginBottom: scaledHeight(3)
                    }}>
                        <Image source={Images.profileLogo} equalSize={scale(25)} />
                        <TouchableOpacity onPress={() => {

                        }}><Text color="black" bold size={7.5}>{store.getState().auth.token ? user.name : null}</Text></TouchableOpacity>

                        <Text color={"#697278"} size={6.5}>{`${store.getState().auth.token ? user.countryCode : ""} ${store.getState().auth.token ? user.phone : ""}`}</Text>
                    </View>
                    {store.getState().auth.token ? null : <Item title={t('ProfileLogin')} imgName={Images.profileUser} color={colors.Whitebackground} MyShop iconSize={12} onPress={() => {
                        Navigation.push({
                            name: 'Login',
                            options: {
                                statusBar: {
                                    backgroundColor: colors.animationColor
                                    ,
                                }
                                
                            }, passProps: { home: true }
                        })
                    }} />}
                    {store.getState().auth.token?<Item title={t('MyShop')} imgName={Images.profileBox} color={colors.Whitebackground} MyShop onPress={() => {
                        if (!store.getState().auth.token) {
                            setServiceModalVisible(true);
                        } else {
                            Navigation.push(
                                {
                                    name: "MyShop",
                                    options: {
                                        statusBar: {
                                            backgroundColor: colors.grayBackgroung
                                            ,
                                        }
                                    }
                                })
                        }
                    }} />:null}
                    {store.getState().auth.token?<Item title={t('wallet')} wallet imgName={Images.profileWallet} onPress={() => {
                        if (!store.getState().auth.token) {
                            setServiceModalVisible(true);
                        }
                        else {
                            Navigation.push({
                                name: 'Wallet', options: {
                                    statusBar: {
                                        backgroundColor: colors.grayBackgroung
                                        ,
                                    }
                                }
                            })
                        }
                    }} />:null}
                    {store.getState().auth.token?<Item title={t('ProfileUser')} imgName={Images.profileUser} iconSize={12} onPress={() => {
                        if (!store.getState().auth.token) {
                            setServiceModalVisible(true);
                        } else {
                            Navigation.push({
                                name: 'EditeProfile',
                            })
                        }
                    }} />:null}
                    {store.getState().auth.token?<Item title={t('contactUs')} imgName={Images.profileChat} onPress={() => {
                        if (!store.getState().auth.token) {
                            setServiceModalVisible(true);
                        }
                        else {
                            Navigation.push({
                                name: 'ContactUs', options: {
                                    statusBar: {
                                        backgroundColor: colors.grayBackgroung
                                        ,

                                    }
                                }
                            })
                        }
                    }} />:null}
                    <Item title={t('terms')} imgName={Images.profilePaper} onPress={() => {
                        Navigation.push(
                            {
                                name: "Terms", options: {
                                    statusBar: {
                                        backgroundColor: colors.grayBackgroung
                                        ,
                                    }
                                }
                            })
                    }} />
                    {store.getState().auth.token?<Item workNotif={user.notification} title={t('Notifications')} notifcation imgName={Images.profileNotif} onPress={() => {
                        if (!store.getState().auth.token) {
                            setServiceModalVisible(true);
                        }
                        else {
                            Navigation.push(
                                {
                                    name: "Notifications",
                                })
                        }
                    }} />:null}
                    <Item title={t('language')} lang imgName={Images.profileEarth} />
                    <Item title={t('shareApp')} imgName={Images.profileShare} iconSize={9} onPress={() => {
                        Share.open(shareOptions).then(res => {
                            incrementShareCountApi();
                        }).catch(error => {

                        })
                    }} />
                    {store.getState().auth.token ? <Item title={t('logout')} color={colors.highlight} imgName={Images.profileLogout} onPress={() => { setLogoutVisible(true) }} />
                        : null}
                    {store.getState().auth.token ? <TouchableOpacity activeOpacity={0.8} style={{
                        alignItems: 'center', marginHorizontal: scale(15), backgroundColor: colors.red2,
                        paddingVertical: scale(7), paddingHorizontal: scale(8), borderRadius: scale(20), marginVertical: scaledHeight(0.6)
                    }} onPress={() => {
                        setDeleteVisible(true)
                    }}>
                        <Text color={colors.red1} >{t("deleteAccount")}</Text>
                    </TouchableOpacity> : null
                    }
                </ScrollView>

                <LogoutModal visible={logoutVisible} dismiss={(flag) => {
                    setLogoutVisible(false);
                    if (flag) {
                        logoutFn();
                        Navigation.showOverlay(t('doneLogout'));
                    }
                }} />

                <LogoutModal visible={deleteVisible} title={t('sureDeleteAccount')} dismiss={(flag) => {
                    setDeleteVisible(false);
                    if (flag) {
                        deleteAccount();
                    }
                }} />

                <TabBar name="Profile" />
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

export default connect()(Profile);