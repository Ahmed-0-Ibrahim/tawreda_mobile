import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Button } from "../../Components/Button";
import { HeaderDrawing } from "../Components/HeaderDrawing";
import { Icon } from "../Components/Icon";
import { Image } from "../../Components/Image";
import { Input } from "../Components/Input";
import { Text } from "../../Components/Text";
import colors from "../../Utils/colors";
import { scale, scaledWidth, scaledHeight } from "../../Utils/responsiveUtils";
import { Formik } from 'formik';
import * as yup from 'yup';
import Navigation from "../../Utils/Navigation";
import { loginApi } from "../Utils/api";
import { API_ENDPOINT } from "../configs";
import { setUserFn } from "../Redux/auth";
import { authProcedure } from "../App";
import defaultStyles from "../../Utils/defaultStyles";
import WarningModal from "../../Components/WarningModal";
import Images from "../../Assets/Images";
export const ConfirmOrder = (props) => {
    const { t, i18n } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);



    return (
        <View style={{ flex: 1, backgroundColor: colors.Whitebackground }} >

            <Image source={Images.backgrounfGif} resizeMode={"cover"} style={{ position: "absolute", width: scaledWidth(100), height: scaledHeight(50), left: 0, right: 0, top: -2 }} />
            <View style={{ height: scaledHeight(100), alignContent: "center", alignSelf: "center", alignItems: "center", justifyContent: 'center', }}>
                <Image source={Images.confirmLogo} noLoad equalSize={scale(40)} />
                <Text color={'#CA944B'} bold size={12} style={{ marginHorizontal: scale(10) }}>{t("confirmordertext")}</Text>
                <Text color={'#230A06'} bold size={9} style={{ marginHorizontal: scale(10) }}>{t("textconfirmorder")}{props.isInvestor ? t("MyShop") : t('My_Orders')}</Text>
                <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(60), marginBottom: scale(50) }}>
                    <Button title={props.isInvestor ? t("MyShop") : t('My_Orders')} bold size={8} elevation={3} backgroundColor={colors.MainBlue} color="white" loading={loading}
                        style={{
                            alignSelf: 'stretch',
                            paddingVertical: scale(10),
                        }} radius={28} onPress={() => {
                            let index = i18n.language === 'ar' ? 2 : 1;
                            // Navigation.pop()
                            Navigation.pop()
                            {
                                !props.isInvestor ? setTimeout(() => {
                                    Navigation.mergeOptions(Navigation.bottomTabsID, {
                                        bottomTabs: {
                                            currentTabIndex: index,
                                        }
                                    });
                                    Navigation.currentTabIndex = index;
                                }, 100) : Navigation.push(
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
                            // Navigation.push('Orders')
                        }} />
                </View>
            </View>

        </View>
    );
}