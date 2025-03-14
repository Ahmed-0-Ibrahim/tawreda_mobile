import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, I18nManager, Dimensions, ScrollView, FlatList, Platform, RefreshControl } from 'react-native';
import { useDispatch, useSelector, connect } from 'react-redux';
import { TabBar } from '../../../Components/TabBar';
import colors from '../../../Utils/colors';
import { Text } from '../../../Components/Text';
import { setLang, setLangStorage } from '../../../Redux/lang';
import RNRestart from 'react-native-restart';
import { Header } from '../../../Components/Header';
import CategoryContainer from './CategoryContainer'
import ProductContainer from '../../../Components/ProductContainer';
import ScrollCategory from './ScrollCategories';
import ProductContainerHorizontal from '../../../Components/ProductContainerHorizontal';
import { scale, scaledHeight, scaledWidth } from '../../../Utils/responsiveUtils';
import Navigation from '../../../Utils/Navigation';
import defaultStyles from '../../../Utils/defaultStyles';
import { LottieLoading } from '../../../Components/LottieLoading';
import { getBrands, getCategory, getHomeSlider, getProducts, getTopProducts, getLastProducts } from '../../../Utils/api';
import { Button } from '../../../Components/Button';
import { Swiper } from '../../../Components/Swiper';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Images from '../../../Assets/Images';
import { Image } from '../../../Components/Image';
import { Icon } from '../../../Components/Icon';
import ScrollBrands from './ScrollBrands';
import ScrollLatestProducts from './ScrollLatestProducts';
import { CartButton } from '../../../Components/CartButton';
import { store } from '../../../Redux/store';
let _notificationId = "";

const Home = (props) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // console.log("USER:::::::::: ", user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDynamicLink = (link) => {
    // Handle dynamic link inside your own application
    if (link && link.url) {
      console.log('LINK in::: ', link.url);
      const url = link.url;
      const parsed = url.replace(/.*?:\/\//g, '');
      let params = (parsed.split('?'))[1].split('&');
      console.log("PARAMS LINK::::: ", params);
      let id = params[0].split('=')[1];
      console.log("ID PARAMS LINK:::: ", id);
      Navigation.push({
        name: 'ProductDetails', passProps: { id: id }, statusBar: {
          backgroundColor: "#F5F6FA"
          ,
        }
      });
    }
  };

  useEffect(() => {
    getHomeData();
    configurePushNotification();

    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

    dynamicLinks()
      .getInitialLink()
      .then(link => {
        handleDynamicLink(link);
      });

    return () => unsubscribe();
  }, []);

  const configurePushNotification = async () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN NOTIF:', token);
      },

      onRegistrationError: (error) => {
        console.log("REGISTRATION ERROR:::: ", error);
      },

      onNotification: function (notification) {
        console.log('onNotification::::::: ', notification);
        if (
          notification.userInteraction === true &&
          notification.data.subjectType === 'ADMIN'
        ) {
          Navigation.push('Notifications');
        } else if (
          notification.userInteraction === true &&
          notification.data.subjectType === 'PROMOCODE'
        ) {
          Navigation.push('Notifications');
        } else if (
          notification.userInteraction === true &&
          notification.data.subjectType === 'ADDED_TO_WALLET'
        ) {
          Navigation.push('Notifications');
        }
        else if (
          notification.userInteraction === true &&
          notification.data.subjectType === 'MESSAGE'
        ) {
          Navigation.push('Chat');
        }
        else if (
          notification.userInteraction === true &&
          notification.data.subjectType === 'ORDER'
        ) {
          Navigation.push({
            name: 'OrderDetails',
            passProps: {
              data: { id: notification.data.subjectId },
              onCancel: () => { },
            },
          });
        } else if (
          notification.userInteraction === true &&
          notification.data.subjectType === 'CHANGE_ORDER_STATUS'
        ) {
          Navigation.push({
            name: 'OrderDetails',
            passProps: {
              data: { id: notification.data.subjectId },
              onCancel: () => { },
            },
          });
        } else if (
          !notification.userInteraction &&
          !notification.foreground &&
          notification.subjectType === 'ADMIN'
        ) {
          Navigation.push('Notifications');
        } else if (
          !notification.userInteraction &&
          !notification.foreground &&
          notification.subjectType === 'PROMOCODE'
        ) {
          Navigation.push('Notifications');
        } else if (
          !notification.userInteraction &&
          !notification.foreground &&
          notification.subjectType === 'ADDED_TO_WALLET'
        ) {
          Navigation.push('Notifications');
        } else if (
          !notification.userInteraction &&
          !notification.foreground &&
          notification.subjectType === 'MESSAGE'
        ) {
          Navigation.push('Chat');
        }
        else if (
          !notification.userInteraction &&
          !notification.foreground &&
          notification.subjectType === 'ORDER'
        ) {
          Navigation.push({
            name: 'OrderDetails',
            passProps: {
              data: { id: notification.subjectId },
              onCancel: () => { },
            },
          });
        } else if (
          !notification.userInteraction &&
          !notification.foreground &&
          notification.subjectType === 'CHANGE_ORDER_STATUS'
        ) {
          Navigation.push({
            name: 'OrderDetails',
            passProps: {
              data: { id: notification.subjectId },
              onCancel: () => { },
            },
          });
        } else if (!notification.userInteraction && !notification.foreground) {
          Navigation.push('Notifications');
        } else if (notification.userInteraction === true) {
          Navigation.push('Notifications');
        }
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // ios only
      permissions: {
        alert: true,
        badge: false,
        sound: true,
      },
      // ANDROID: GCM or FCM Sender ID
      senderID: '554652321049',
      popInitialNotification: true,
      requestPermissions: true,
    });
    if (Platform.OS === 'ios') {
      const enabled = await messaging().hasPermission();
      const fcmToken = await messaging().getToken();
      if (enabled) {
        // user has permissions
        await messaging().requestPermission();
        messaging().onMessage(async remoteMessage => {
          const { title, body, data, messageId } = remoteMessage.notification;
          let _notificationId1 = _notificationId;
          _notificationId = messageId;
          if (_notificationId1 !== messageId) {
            PushNotification.localNotification({
              ...remoteMessage.notification,
              title: title,
              message: body,
              data: data,
              userInfo: data,
            });
          }
        });
      } else {
        try {
          await messaging().requestPermission();
        } catch (error) { }
      }
    }
  };

  // let getHomeData = async () => {
  //   setLoading(true);
  //   setError(false);
  //   const [sliderRes, categoryRes, prodOfferRes, prodRes] = await Promise.all([getHomeSlider(), getCategory(), getProducts({ hasOffer: true, limit: 10 }), getProducts({ limit: 10 })]);
  //   if (sliderRes && sliderRes.ok && sliderRes.data && categoryRes
  //     && categoryRes.ok && categoryRes.data && prodOfferRes && prodOfferRes.ok
  //     && prodOfferRes.data && prodRes && prodRes.ok && prodRes.data) {
  //     setSliderData(sliderRes.data.data);
  //     setCategories(categoryRes.data.data);
  //     setProductsOffer(prodOfferRes.data.data);
  //     setProducts(prodRes.data.data);
  //     setLoading(false);
  //   }
  //   else {
  //     setError(true);
  //     setLoading(false);
  //   }
  // }

  let getHomeData = async () => {
    setLoading(true);
    setError(false);
    const [sliderRes, categoryRes, brands, TopprodRes, LatestProRes] = await Promise.all([getHomeSlider(), getCategory(), getBrands(), getTopProducts(user.id, { limit: 10 }, store.getState().auth.token), getLastProducts(user.id, { limit: 10 }, store.getState().auth.token)]);
    if (sliderRes && sliderRes.ok && sliderRes.data && categoryRes && categoryRes.ok && categoryRes.data && TopprodRes && TopprodRes.ok && TopprodRes.data && brands && brands.ok && brands.data && LatestProRes && LatestProRes.ok && LatestProRes.data) {
      setCategories(categoryRes.data.data);
      setSliderData(sliderRes.data.data);
      setBrands(brands.data.data);
      setTopProducts(TopprodRes.data.data);
      setLatestProducts(LatestProRes.data.data);
      console.log("CATEGORY::", categoryRes.data.data);
      console.log("PPRODCUTS::", TopprodRes.data.data);
      console.log("BRANDS::", brands.data.data);
      console.log("latest:", LatestProRes.data.data);
      setLoading(false);
    }
    else {
      setError(true);
      setLoading(false);
    }
  }

  const [sliderData, setSliderData] = useState();
  const [categories, setCategories] = useState();
  const [brands, setBrands] = useState();

  const [LatestProducr, setLatestProducts] = useState();
  const [topProducts, setTopProducts] = useState();


  return (
    <View style={{ flex: 1, backgroundColor: colors.bgS }}>
      <Header title="Home Screen" style={{ backgroundColor: colors.bgS }} logo support search notif notifFunction />

      {!loading && !error ? <ScrollView style={{ alignSelf: "stretch", }} contentContainerStyle={{ paddingBottom: scaledHeight(14) }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={getHomeData} refreshing={loading} tintColor={colors.textPrimary} colors={[colors.textPrimary]} />}>
        <View style={{ marginHorizontal: scale(10) }}>
          <TouchableOpacity onPress={
            () => {
            // Navigation.push(
            //   {
            //     name: "AddAdress", options: {
            //       statusBar: {
            //         backgroundColor: colors.grayBackgroung
            //       }
            //     }
            //   })

          }}>
          <Text color={colors.MainBlue} bold size={9.5}>{t("welcome")} {store.getState().auth.token?`${user.name}`:null} 👋</Text>
         </TouchableOpacity>
          {/* <Text color={colors.MainBlue} bold size={9.5}>{t("welcome")} {store.getState().auth.token ? `${user.name}` : null} 👋</Text> */}

          <Text color={colors.highlight} style={{ marginTop: -scale(5) }} size={7}></Text>
        </View>
        <Text style={{ marginHorizontal: scale(10), marginTop: scale(-20), marginBottom: scale(10) }} color={colors.highlight} size={6.5}>{t("searchTitle")}</Text>
        <TouchableOpacity style={{ flexDirection: "row", alignContent: "space-between", width: scaledWidth(100), marginHorizontal: scale(10) }}
          onPress={() => {
            Navigation.push(
              {
                name: "Search", options: {
                  statusBar: {
                    backgroundColor: colors.grayBackgroung
                  }
                }
              })

          }}>
          <View style={{ flexDirection: "row", justifyContent: "flex-start", alignContent: "center", alignItems: "center", backgroundColor: colors.grayBackgroung, borderRadius: scale(10), width: scale(295), height: scale(50), marginRight: scaledWidth(2) }}>
            <Icon size={10} type={"Feather"} name={"search"} color={colors.TextGray} style={{ marginHorizontal: scale(10) }} />
            <Text color={colors.TextGray}>{t('SearchHere')}</Text>
          </View>
          <View style={{ backgroundColor: colors.highlight, borderRadius: scale(10), width: scale(50), height: scale(50), justifyContent: "center", alignContent: "center", alignItems: "center", }}>
            <Icon size={13} type={"Feather"} name={"search"} color={colors.Whitebackground} />
          </View>
        </TouchableOpacity>

        {categories && categories.length > 0 ? <ScrollCategory categories={categories} /> : null}
        {brands && brands.length > 0 ? <ScrollBrands brands={brands} /> : null}
        <ScrollLatestProducts categories={LatestProducr}></ScrollLatestProducts>

        <Swiper height={20} data={sliderData ? sliderData : []} itemStyle={{ borderRadius: 20, marginHorizontal: scale(10), marginTop: scaledHeight(2) }} />
        <ScrollLatestProducts most categories={topProducts}></ScrollLatestProducts>

      </ScrollView> : null}



      {!loading && !error ? <CartButton /> : null}
      <LottieLoading style={{ flex: 1 }} loading={loading} />
      {error ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <Image source={Images.ErrorLogo} noLoad equalSize={40} />
        <Text color={colors.TextGray} style={{ margin: scale(15), }}>{t('ConnectionError')}</Text>
        <View style={{ alignSelf: 'stretch', alignItems: 'center', borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(90), marginBottom: scale(5) }}>

          <Button backgroundColor={colors.MainBlue} title={t('tryAgain')} color="white" bold radius={20} style={{ alignSelf: 'stretch', paddingVertical: scale(5), paddingHorizontal: scale(25) }}
            onPress={() => {
              getHomeData();
            }} />
        </View>
      </View> : null}
      <TabBar name="Home" />
    </View>
  );
}

export default connect()(Home);