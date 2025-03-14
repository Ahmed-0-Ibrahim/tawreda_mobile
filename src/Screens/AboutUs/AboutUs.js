import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, FlatList, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { TabBar } from '../../Components/TabBar';
import { Header } from '../../Components/Header';
import colors from '../../Utils/colors';
import Images from '../../Assets/Images';
import { Image } from '../../Components/Image';
import { Text } from '../../Components/Text';
import { Empty } from '../../Components/Empty';
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import { Button } from '../../Components/Button';
import { Icon } from '../../Components/Icon';
import Video from 'react-native-video';
import Communications from 'react-native-communications';
import { API_ENDPOINT } from '../../configs';

export const AboutUs = (props) => {
    const { t, i18n } = useTranslation();
    const { company, rtl } = useSelector((state) => ({
        company: state.auth.company,
        rtl: state.lang.rtl,
    }));

    const renderSocials = () => {
        if (company && company.socialLinks) {
            let socials = company.socialLinks.map((item, index) => {
                if (item.key === "FACEBOOK") {
                    return (
                        <TouchableOpacity style={{ marginHorizontal: scale(5) }} activeOpacity={0.8} onPress={() => {
                            Linking.openURL(item.value);
                        }}>
                            <Image equalSize={10} source={Images.facebookIcon} />
                        </TouchableOpacity>
                    );
                }
                if (item.key === "TWITTER") {
                    return (
                        <TouchableOpacity style={{ marginHorizontal: scale(5) }} activeOpacity={0.8} onPress={() => {
                            Linking.openURL(item.value);
                        }}>
                            <Image equalSize={10} source={Images.twitterIcon} />
                        </TouchableOpacity>
                    );
                }
                if (item.key === "INSTAGRAM") {
                    return (
                        <TouchableOpacity style={{ marginHorizontal: scale(5) }} activeOpacity={0.8} onPress={() => {
                            Linking.openURL(item.value);
                        }}>
                            <Image equalSize={10} source={Images.instagramIcon} />
                        </TouchableOpacity>
                    );
                }
                if (item.key === "YOUTUBE") {
                    return (
                        <TouchableOpacity style={{ marginHorizontal: scale(5) }} activeOpacity={0.8} onPress={() => {
                            Linking.openURL(item.value);
                        }}>
                            <Image equalSize={10} source={Images.youtubeIcon} />
                        </TouchableOpacity>
                    );
                }
                if (item.key === "WHATSAPP") {
                    return (
                        <TouchableOpacity style={{ marginHorizontal: scale(5) }} activeOpacity={0.8} onPress={() => {
                            let url = 'whatsapp://send?text=' + '' + '&phone=' + item.value;
                            Linking.openURL(url).then().catch(error => {
                                Communications.phonecall(item.value, true);
                            })
                        }}>
                            <Image equalSize={10} source={Images.whatsIcon} />
                        </TouchableOpacity>
                    );
                }
                if (item.key === "SNAPCHAT") {
                    return (
                        <TouchableOpacity key={item.key} style={{ marginHorizontal: scale(5), marginTop: scale(3.5) }} activeOpacity={0.8} onPress={() => {
                            Linking.openURL(item.value);
                        }}>
                            <Image equalSize={8} source={Images.snapIcon} />
                        </TouchableOpacity>
                    );
                }
            });
            return (
                <View style={{ alignSelf: 'stretch', marginBottom: scale(15), marginHorizontal: scale(15), justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {socials}
                </View>
            );
        }
        return;
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header back title={t('aboutUs')} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'white' }}>
                <Image source={Images.logo} width={40} height={18} style={{ alignSelf: 'center', marginTop: scale(6) }} />
                <View style={{ alignSelf: 'stretch', marginHorizontal: scale(15), marginBottom: scale(15) }}>
                    <Text size={6.5} color="#404B52">{
                    typeof company.aboutUs === 'object' ? company.aboutUs[i18n.language] : company.aboutUs}</Text>
                </View>
                {(rtl && company.aboutUSArabicVideo) || (!rtl && company.aboutUSEnglishVideo) ? <View style={{ marginHorizontal: scale(15), marginBottom: scale(15), alignSelf: 'stretch' }}>
                    <Video source={{ uri: `${API_ENDPOINT}${rtl ? company.aboutUSArabicVideo : company.aboutUSEnglishVideo}` }} resizeMode="stretch" controls={true}
                        style={{ width: '100%', alignSelf: 'stretch', borderRadius: scale(15), height: scaledHeight(20), backgroundColor: 'rgba(0,0,0,0.3)' }} />
                </View> : null}
                {renderSocials()}
            </ScrollView >
        </View >
    );
}

