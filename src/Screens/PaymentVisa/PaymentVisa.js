/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { API_ENDPOINT } from '../../configs';
import { Header}from '../../Components/Header'
import WebView from 'react-native-webview';
import axios from 'axios';
import { BackHandler, View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scaledWidth } from "../../Utils/responsiveUtils";
import colors from '../../Utils/colors';
import Navigation from '../../Utils/Navigation';
import { store } from '../../Redux/store';

export const PaymentVisa = (props) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    console.log('props.data ', props.res);
    // const [checkoutId, setCheckoutId] = useState(props.data.paymentTransaction.paymentToken);

    let onSubmit = (completed = false) => {
        // if (!completed) {
        //   console.log("🚀 ~ file: PaymentVisa.js ~ line 50 ~ onSubmit ~ completed", completed)
        //   Navigation.pop();
        //   return;
        // }
        // let data = { resourcePath: checkoutId };
        console.log("start checkkkkkkkkkkkkkkkkk")
        console.log(`${API_ENDPOINT}/payment/transaction-inquiry/${props.res.data.order.id}/${props.res.data.paymentTransaction.id}`)
        setLoading(true);
        axios
            .get(
                `${API_ENDPOINT}/payment/transaction-inquiry/${props.res.data.order.id}/${props.res.data.paymentTransaction.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${store.getState().auth.token}`,
                    },
                },
            )
            .then((res) => {
                console.log('res ', res);
                setLoading(false);
                if (res.data.order.paymentSuccess) {
                    props.onDone();
                    Navigation.pop()
                }
                else {
                    // props.onError();
                }
                // showSuccess(res.data.message);
                // if (res.data.result === 'paymentSuccess') {
                // }
            })
            .catch((error) => {
                console.log('errr ', error.response);
                if (!error.response) {
                    // props.onError();
                    //   showError(I18n.t('ui-networkConnectionError'));
                    return;
                } else {
                    // props.onError(error.response.data);
                    //   showError(error.response.data.message);
                }
            });
    };

    return (
        // stopWave
        <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <Header
                // title={t('FollowUpPayment')}
                // colorIcon={colors.textPrimary}
                back
                style={{ backgroundColor: colors.bgS }}
            />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {!loading ? (
                    <WebView
                        useWebKit={true}
                        style={{ width: scaledWidth(100) }}
                        source={{
                            uri: props.res.data.frameUrl
                        }} //`https://www.aliscafi.net/payment/${checkoutId}` }}
                        startInLoadingState={false}
                        enableApplePay={true}
                        onNavigationStateChange={(res) => {
                            console.log(
                                'onNavigationStateChange =======================',
                                res,
                            );
                            let uri = res.url;
                            if (uri.includes('success=true')) {
                                console.log(
                                    '🚀 ~ file: PaymentVisa.js ~ line 109 ~ uri',
                                    uri,
                                );
                                onSubmit(true);
                            }
                        }}
                    />
                ) : (
                    <ActivityIndicator color={colors.textPrimary} />
                )}
            </View>
        </View>
    );
}

const mapStateToProps = state => ({

    rtl: state.lang.rtl,
    lang: state.lang.lang,
    token: state.auth.token,
    // visitorToken: state.auth.visitorToken,

});

export default connect(mapStateToProps)(PaymentVisa);
