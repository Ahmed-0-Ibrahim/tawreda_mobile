import React, { useEffect, useState } from 'react';
import { View, Dimensions, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { TabBar } from '../../Components//TabBar';
import { Header } from '../../Components/Header';
import { Text } from '../../Components/Text';
import { Empty } from '../../Components/Empty';
import { Icon } from '../../Components/Icon';
import { useTranslation } from "react-i18next";
import { Input } from '../../Components/Input';
import { scale, scaledWidth, scaledHeight, responsiveFontSize } from "../../Utils/responsiveUtils";
import { Button } from '../../Components/Button';
import colors from '../../Utils/colors';
import { Image } from '../../Components/Image';
import Images, { images } from "../../Assets/Images"
import Navigation from "../../Utils/Navigation"
import WarningModal from '../../Components/WarningModal';
import moment from 'moment';
import IconLogo from './IconLogo';
import defaultStyles from '../../Utils/defaultStyles';
import { API_ENDPOINT } from '../../configs';
import Clipboard from '@react-native-clipboard/clipboard';
export default Notice = (props) => {
    const { t, i18n } = useTranslation();
    const { item } = props;
    const NOT = true;
    return (
        <TouchableOpacity style={{
            backgroundColor: colors.Whitebackground, borderRadius: scale(10), marginHorizontal: scale(10),
            paddingHorizontal: scale(8), paddingTop: scale(8), paddingBottom: scale(4), elevation: 1, marginBottom: scale(20),
            ...defaultStyles.elevationGame(0.5)
        }} disabled={item.subjectType === 'PROMOCODE'} onPress={() => {
            if (item.subjectType === "CHANGE_ORDER_STATUS" && item.order) {
                if (item.order.type === "NORMAL") {
                    Navigation.push({
                        name: 'OrderDetails', passProps: { id: item.order.id }, options: {
                            statusBar: {
                                backgroundColor: colors.grayBackgroung
                            }
                        }
                    });
                }
                else {
                    Navigation.push({
                        name: 'StoreOrder', passProps: { id: item.order.id }, options: {
                            statusBar: {
                                backgroundColor: colors.grayBackgroung
                            }
                        }
                    });
                }
            }
            else if (item.subjectType === "ADDED_TO_WALLET") {
                Navigation.push({
                    name: 'Wallet', options: {
                        statusBar: {
                            backgroundColor: colors.grayBackgroung
                        }
                    }
                });
            }
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', }}>
                {item.subjectType === 'ADMIN' ?
                    <IconLogo /> :

                    <View style={{
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        marginEnd: scale(10),
                    }}>
                        {props.noti ? <Image equalSize={9} style={{
                        }} source={Images.profileNotif} />
                            : <Image equalSize={10} style={{
                            }} source={Images.notBox} />
                        }
                    </View>

                }

                <View>
                    <Text color={'#697278'} semiBold style={{ paddingHorizontal: scale(5) }} size={6}>{moment(item.createdAt).format('DD/MM/YYYY - hh:mmA')}</Text>
                    {item.subjectType != 'PROMOCODE' && item.order?.orderNumber ?
                        <Text semiBold style={{ marginHorizontal: scale(4) }}
                            color={item.subjectType === 'ORDER' || item.subjectType === 'ORDER_CHANGE_STATUS' ? '#000' : '#000'} size={7}>
                            {item.subjectType === 'ADMIN' ? t('Tawrida') : t("ordernumber") + " : " + `${item.order?.orderNumber}`}</Text> : null
                    }

                    {
                        <Text color={colors.MainBlue} semiBold style={{ paddingHorizontal: scale(5), width: scale(300) }} size={7}>{item.description}</Text>
                    }
                    {
                        item.subjectType === 'PROMOCODE' ?
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: scale(2), width: Dimensions.get('window').width * 0.75 }}>
                                <Text color={colors.promoColor} size={7} semiBold >{item.promoCode.code}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        Clipboard.setString(item.promoCode.code + '');
                                        Navigation.showOverlay(t('copied'));
                                    }}
                                >
                                    <Image width={5} height={5} source={Images.copy} />
                                </TouchableOpacity>
                            </View>
                            : null
                    }

                    {
                        item.subjectType == 'PriceUpdate' ?
                            <View style={{ alignItems: "center", flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: scale(2) }}>
                                <TouchableOpacity
                                    onPress={() => { }}
                                >
                                    <Image resizeMode={"cover"} style={{ borderRadius: scale(10), borderWidth: scale(1), borderColor: colors.Gray2, width: scaledWidth(10), height: scaledWidth(10), marginEnd: scale(5) }} source={NOT ? Images.test : { uri: `${API_ENDPOINT}${item.image}` }} />
                                </TouchableOpacity>
                                <Text size={6} color={'#000'} style={{ width: scaledWidth(50) }}>جهينة اورينتال 1 لتر خروب / كركديه / قمر الدين</Text>
                            </View>
                            : null
                    }
                </View>
            </View>
            {
                item.image ? <Image style={{ borderRadius: scale(20), height: scaledHeight(25), width: scaledWidth(90), alignSelf: "center", margin: scale(10) }} resizeMode={"cover"} source={{ uri: `${API_ENDPOINT}${item.image}` }} /> : null
            }
        </TouchableOpacity>
    )
}