import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Button } from "../../Components/Button";
import { Text } from "../../Components/Text";
import { scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import Images from "../../Assets/Images";
import colors from "../../Utils/colors";
import { Icon } from "../../Components/Icon";
import { Image } from "../../Components/Image";
import { PayType } from "../Wallet/payType";
import { Input } from "../../Components/Input";
import { AddBalanceApi } from "../../Utils/api";
import { Formik } from "formik";
import * as yup from 'yup';
import NotWorkModal from "./notWorkModal";
import Navigation from "../../Utils/Navigation"
import { ModalToast } from "../../Components/ModalToast";

export default WalletModal = (props) => {
    const { t, i18n } = useTranslation();
    const [toast, setToast] = useState({
        message: '',
        type: '',
        activate: false,
    });
    // let validationSchema = yup.object({
    //     phone: yup.string().matches(/^[0-9]+$/, `${t('phone')} ${t('invalid')}`).required(`${t('phone')} ${t('required')}`),
    // });
    const [amount, setamount] = useState();
    const [loading, setLoading] = useState(false);
    const [phone, setphone] = useState();
    const regex = /^[0-9\b]+$/;
    const regexphone = /^\d{11}$/;
    const [chooseEnabled, setIsEnabled] = useState(true);

    const paymethodByVisa = () => {
        setLoading(true);
        let order = {};
        order.paymentMethod = chooseEnabled ? 'VISA_MASTERCARD' : "ELECTRONIC_WALLET";
        order.amount = amount
        if (!chooseEnabled) {
            order.paymentPhoneNumber = phone
        }
        console.log("ordeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer", order)
        AddBalanceApi(order).then(res => {
            console.log("cresitttttttttttttAddBalanceApitttttttt", res)
            setLoading(false);

            Navigation.push({
                name: 'CharageWallet', options: {
                    statusBar: {
                        backgroundColor: '##F5F6FA'
                    }
                }, passProps: { res: res,/* onDone: () => { onDone() }*/ }
            });

            // Navigation.push({
            //     name: 'PaymentVisa', options: {
            //         statusBar: {
            //             backgroundColor: colors.animationColor,
            //             style: 'light'
            //         },
            //         passProps: { res: res }
            //     }
            // });
            // dispatch(refresh('orderList'));
            // dispatch(clearCart());
            // removeCartFromStorage();
            // Navigation.popToRoot('Home');
            // let index = i18n.language === 'ar' ? 1 : 2;
            // setTimeout(() => {
            //     // Navigation.mergeOptions(Navigation.bottomTabsID, {
            //     //     bottomTabs: {
            //     //         currentTabIndex: index,
            //     //     }
            //     // });
            //     // Navigation.currentTabIndex = index;
            //     Navigation.push({
            //         name: 'ConfirmOrder', options: {
            //             statusBar: {
            //                 backgroundColor: colors.animationColor
            //                 ,
            //             }
            //         },
            //     });
            // }, 100);
            // Navigation.showOverlay(t('orderSuccessfull'));
            // Navigation.push({
            //     name: 'ConfirmOrder', options: {
            //         statusBar: {
            //             backgroundColor: colors.animationColor
            //             ,
            //         }
            //     }, passProps: { totalPrice: totalPrice, totalDiscount: totalDiscount, total: parseFloat(totalPrice - totalDiscount).toFixed(2), promoCode: promoCode }
            // });
        }).catch(error => {
            console.log("ERRORR:::::: ", error);
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }


    let submit = (values) => {
        setLoading(true);
        console.log("COUNTRY:::: ", country);
        let _values = { ...values, countryKey: country.countryCode, countryCode: `+${country.cca2}` };
        console.log("COUNTRY:::: ", _values);
        contactUsApi(_values).then(res => {
            console.log("RES::: ", res);
            setLoading(false);
            Navigation.showOverlay(t('sentOpinionSuccessfully'));
            setTimeout(() => {
                Navigation.pop();
            }, 250);
        }).catch(error => {
            console.log("ERROR::: ", error);
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }
    const [NotWorkVisible, setNotWorkVisible] = useState(false);

    return (
        <Modal visible={props.visible} animationType="none" transparent={true}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => {
                props.dismiss();
            }}>
                <TouchableWithoutFeedback>
                    <View style={{
                        alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20),
                        paddingHorizontal: scale(10), paddingVertical: scale(15), backgroundColor: colors.grayBackgroung,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", width: scaledWidth(90), alignContent: 'center', alignItems: "center" }}>
                            <TouchableOpacity style={{
                                alignItems: 'center', justifyContent: 'center',
                                width: scaledWidth(8), height: scaledWidth(8), borderRadius: scaledWidth(8) / 2, backgroundColor: 'rgba(118, 118, 128, 0.12)'
                            }} onPress={() => {
                                props.dismiss();
                            }}>
                                <Icon name="close" type="IonIcons" size={9.5} color={colors.MainBlue} />
                            </TouchableOpacity>

                            <Text semiBold size={scale(8)} color={colors.MainBlue} >{t("addBalance")}</Text>
                            <Icon name="close" type="IonIcons" size={0} />
                        </View>
                        <Text semiBold size={scale(8)} color={colors.MainBlue} style={{ alignSelf: "flex-start", paddingHorizontal: scale(23), marginVertical: scale(5), }} >{t("addbalance")}</Text>

                        <Input {...props} name="amount"
                            containerStyle={{ borderRadius: scale(10), height: scaledHeight(6.5), borderColor: colors.Gray2, borderWidth: scale(1), marginHorizontal: scale(20), color: colors.Whitebackground }}
                            placeholder={t("theamount")}
                            keyboardType="number-pad"
                            inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                            onChangeText={newText => setamount(newText)} />
                        <Text semiBold size={scale(8)} color={colors.MainBlue} style={{ alignSelf: "flex-start", paddingHorizontal: scale(23), marginVertical: scale(5), }} >{t("chossepmethod")}</Text>
                        <TouchableOpacity activeOpacity={0.8} style={{
                            alignSelf: 'stretch', alignItems: 'center', flexDirection: 'row', marginHorizontal: scale(15), backgroundColor: props.MyShop ? colors.MainBlue : colors.Whitebackground,
                            paddingVertical: scale(10), paddingHorizontal: scale(8), borderRadius: scale(15), marginVertical: scaledHeight(0.6)
                        }} disabled={props.lang} onPress={props.onPress}>
                            <Image source={Images.pay1} equalSize={scale(7)} noLoad />
                            <Text size={7.5} color={props.color ? props.color : colors.MainBlue} style={{ marginStart: scaledWidth(3) }}>{t('Credit')}</Text>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            </View>
                            <TouchableOpacity style={{
                                borderRadius: scaledWidth(4) / 2, width: scaledWidth(4), height: scaledWidth(4),
                                justifyContent: 'center', alignItems: 'center', backgroundColor: chooseEnabled == false ? colors.Gray2 : colors.highlight
                            }} activeOpacity={0.8} onPress={() => {
                                setIsEnabled(true);
                            }}>
                                <View style={{ borderRadius: scaledWidth(2) / 2, width: scaledWidth(2), height: scaledWidth(2), backgroundColor: 'white' }} />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} style={{
                            alignSelf: 'stretch', alignItems: 'center', flexDirection: 'row', marginHorizontal: scale(15), backgroundColor: props.MyShop ? colors.MainBlue : colors.Whitebackground,
                            paddingVertical: scale(10), paddingHorizontal: scale(8), borderRadius: scale(15), marginVertical: scaledHeight(0.6)
                        }} disabled={props.lang} onPress={props.onPress}>
                            <Image source={Images.pay2} equalSize={scale(7)} noLoad />
                            <Text size={7.5} color={props.color ? props.color : colors.MainBlue} style={{ marginStart: scaledWidth(3) }}>{t('wallets')}</Text>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            </View>
                            <TouchableOpacity style={{
                                borderRadius: scaledWidth(4) / 2, width: scaledWidth(4), height: scaledWidth(4),
                                justifyContent: 'center', alignItems: 'center', backgroundColor: chooseEnabled == true ? colors.Gray2 : colors.highlight
                            }} activeOpacity={0.8} onPress={() => {
                                setIsEnabled(false);
                            }}>
                                <View style={{ borderRadius: scaledWidth(2) / 2, width: scaledWidth(2), height: scaledWidth(2), backgroundColor: 'white' }} />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        {/* <View style={{ height: scaledHeight(15), width: scaledWidth(95), marginVertical: scale(2) }}>
                            <Formik initialValues={{ phone: t('userphone') }}
                                validationSchema={validationSchema} onSubmit={(values) => {
                                    submit(values);
                                }}>
                                {props => (
                                    <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', marginBottom: scale(18) }}>
                                        <Input {...props} name="phone"
                                            containerStyle={{ borderRadius: scale(10), height: scaledHeight(6.5), borderColor: colors.Gray2, borderWidth: scale(1), marginHorizontal: scale(20), color: colors.Whitebackground }}
                                            placeholder={t("userphone")}
                                            keyboardType="number-pad" onBlur={props.handleBlur('phone')}
                                            inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                            onChangeText={props.handleChange('phone')} error={props.touched.phone && props.errors.phone} />

                                        <View style={{ justifyContent: 'center', alignItems: 'center', borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(5), borderRadius: scale(50), marginTop: scale(18) }}>
                                            <Button radius={25} backgroundColor={colors.MainBlue} elevation={2} style={{ paddingHorizontal: scale(60), }} onPress={() => {
                                                // props.handleSubmit
                                                //    setNotWorkVisible(true);
                                            }}>
                                                <Text style={{ marginHorizontal: scale(7) }} bold size={8.5} color="white">{t('submit')}</Text>
                                            </Button>
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </View> */}
                        {
                            !chooseEnabled ? <Input {...props} name="phone"
                                containerStyle={{ borderRadius: scale(10), height: scaledHeight(6.5), borderColor: colors.Gray2, borderWidth: scale(1), marginHorizontal: scale(20), color: colors.Whitebackground }}
                                placeholder={t("userphone")}
                                keyboardType="number-pad"
                                inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                onChangeText={newText => setphone(newText)} /> : null
                        }
                        <View style={{ justifyContent: 'center', alignItems: 'center', borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(5), borderRadius: scale(50), marginTop: scale(18) }}>
                            <Button radius={25} backgroundColor={colors.MainBlue} elevation={2} style={{ paddingHorizontal: scale(60), }} loading={loading} onPress={() => {
                                // props.handleSubmit
                                //    setNotWorkVisible(true);
                                if (regex.test(amount)) {
                                    if (chooseEnabled) {
                                        paymethodByVisa()
                                    } else {
                                        if (regexphone.test(phone) && phone.length === 11) {
                                            paymethodByVisa()
                                        } else {
                                            setToast({ message: t('phonewallet'), type: 'fail', activate: true });
                                            // Navigation.showOverlay(t("phonewallet"))
                                        }
                                    }
                                } else {
                                    // Navigation.showOverlay(t('addbalance'))
                                    // Navigation.showOverlay(t("addbalance"))
                                    setToast({ message: t('addbalance'), type: 'fail', activate: true });
                                }
                            }}>
                                <Text style={{ marginHorizontal: scale(7) }} bold size={8.5} color="white">{t('submit')}</Text>
                            </Button>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
            <ModalToast activate={toast.activate} message={toast.message} type={toast.type} hide={() => {
                setToast({ ...toast, activate: false });
            }} />
            <NotWorkModal visible={NotWorkVisible} dismiss={(flag) => {
                setNotWorkVisible(false);
            }}
                text={t("NotAvalible")} />
        </Modal>
    );
}