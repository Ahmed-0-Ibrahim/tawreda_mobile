import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, I18nManager, FlatList, Dimensions, ScrollView, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TabBar } from '../../Components/TabBar';
import colors from '../../Utils/colors';
import { Text } from '../../Components/Text';
import { setLang, setLangStorage } from '../../Redux/lang';
import RNRestart from 'react-native-restart';
import { Header } from '../../Components/Header';
import { Icon } from '../../Components/Icon';
import { CircleButton } from '../../Components/CircleButton'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Button } from '../../Components/Button';
import { scale, scaledHeight, scaledWidth, responsiveFontSize } from '../../Utils/responsiveUtils';
import { Image } from '../../Components/Image';
import Navigation from "../../Utils/Navigation";
import { RaitingCart } from "./RatingCart";
import { Input } from '../../Components/Input';
import ShowRateModal from '../ProductDetails/ShowRateModal';
import Images from '../../Assets/Images';
import { Swiper } from '../../Components/Swiper';
import ShowImageModal from '../ProductDetails/ShowImageModal';
import { getProductApi } from '../../Utils/api';
import { store } from '../../Redux/store';
import { getRelatedProducts } from '../../Utils/api';
import { LottieLoading } from '../../Components/LottieLoading';
import defaultStyles from '../../Utils/defaultStyles';
import { CartButton } from '../../Components/CartButton';
import { addToCartFn } from '../../Redux/cart';
import Share from 'react-native-share';
import ReactNativeBlobUtil from 'react-native-blob-util'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { API_ENDPOINT } from '../../configs';
import ImageProduct from '../ProductDetails/ImageProduct';
import CommanProducts from '../ProductDetails/CommanProducts';
import { MadelLogin } from '../../Components/ModelLogin';
export default ProductDetails = (props) => {
    const { user, products, rtl } = useSelector((state) => ({
        user: state.auth.user,
        products: state.cart.products,
        rtl: state.lang.rtl,
    }));
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [realtedProducts, setRealtedProducts] = useState([]);
    const [error, setError] = useState(false);
    const [ModalVisible, setModalVisible] = useState(false);
    const [imageVisible, setImageVisible] = useState(false);
    const [img, setImg] = useState();
    const [imgActive, setImgActive] = useState(0);
    const [count, incrmentCount] = useState(0);
    const [isInCart, setIsInCart] = useState(false);
    const [shareOptions, setShareOptions] = useState(null);
    const [loadingShare, setLoadingShare] = useState(false);
    const [loved, setLoved] = useState(props.loved);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [max, setmax] = useState()
    const product = true;

    useEffect(() => {
        setCount();
        getProduct();
        getRelatedProduct();
    }, []);

    const getRelatedProduct = () => {
        setLoading(true);
        setError(false);
        getRelatedProducts(props.id).then(res => {
            console.log("RES:::: Realted ahhhhhmeeeeeddddddddddddddddddddddddddddddddddd \n", res.data);
            setRealtedProducts(res.data)
            setLoading(false);
            setError(false);
        }).catch(error => {
            console.log("ERROR::: ", error);
            setError(true);
            setLoading(false);
        })
    }
    const getProduct = () => {
        setLoading(true);
        setError(false);
        console.log("ID AHAME:::: ", props.id);
        getProductApi(props.id, user.id, store.getState().auth.token).then(res => {
            console.log("RES:::: ", res);
            setData(res);
            handleShare(res);
            setLoading(false);
            setError(false);
            setmax(res.maxQuantity < res.quantity ? res.maxQuantity : res.quantity)
        }).catch(error => {
            console.log("ERROR::: ", error);
            setError(true);
            setLoading(false);
        })
    }

    const handleShare = async (data) => {
        let link1 = `https://tawreda/share?id=${props.id}`;
        const link = await dynamicLinks().buildShortLink(
            {
                link: link1,
                // domainUriPrefix is created in your Firebase console
                domainUriPrefix: 'https://tawreda.page.link',
                android: {
                    packageName: 'com.tawreda_mobile',
                },
                ios: {
                    bundleId: 'org.t4l.tawreda-mobile',
                    appStoreId: '6466742206',
                },
            },
            'SHORT',
        );
        setShareOptions({
            title: '',
            message: `${t('name')}: ${data.name}` + '\n' +
                `${t('piecePrice')}: ${data.price ? parseFloat(data.price).toFixed(2) : parseFloat(data.price).toFixed(2)}` +
                '\n' + link,
            url: '',
            subject: 'Share Link',
        });
    }

    const share = () => {
        setLoadingShare(true);
        let filePath = null;
        const configOptions = { fileCache: true };
        ReactNativeBlobUtil.config(configOptions)
            .fetch('GET', `${API_ENDPOINT}${data.slider[0]}`)
            .then(resp => {
                setLoadingShare(false);
                filePath = resp.path();
                ReactNativeBlobUtil.fs
                    .readFile(filePath, 'base64')
                    .then(async newData => {
                        let base64Data = `data:image/png;base64,` + newData;
                        await Share.open({
                            ...shareOptions,
                            url: base64Data,
                        }).catch(error => {
                            // user didn't share
                        });
                    })
                    .catch(error => {
                        setLoadingShare(false);
                    });
            })
            .catch(error => {
                setLoadingShare(false);
            });
    }

    const setCount = () => {
        let item = products.find(x => x.id === props.id);
        incrmentCount(item ? item.quantity : 0);
        setIsInCart(item ? true : false);
    }

    const addToCart = () => {
        if (count) {
            setLoading(true)
            let found = addToCartFn(props.id, data, true, count);
            setLoading(false)
            Navigation.showOverlay(t('productAddedSuccessfullyToCart'));
            setIsInCart(true);
            Navigation.pop();
        } else {
            Navigation.showOverlay(t('quantity'));
        }
    }
    const renderImage = () => {
        if (data.image) {
            return item.image;
        }
        else if (data.slider && data.slider.length > 0) {
            return data.slider[0];
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: colors.bgS }}>
            <Header style={{ backgroundColor: '#F5F6FA', paddingHorizontal: scale(13) }} back share shareLoading={loadingShare} onSharePress={() => {
                share();
            }} />
            <LottieLoading style={{ flex: 1 }} loading={loading} />
            {error ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>{t('errorHappened')}</Text>
                <Button linear title={t('tryAgain')} color="white" bold radius={20} style={{ width: scaledWidth(40), alignSelf: 'center', paddingVertical: scale(5), marginTop: scale(6) }}
                    onPress={() => {
                        getProduct();
                    }} />
            </View> : null}
            {!loading && !error && data ? <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: '#F5F6FA', width: scaledWidth(100), height: scaledHeight(40), paddingHorizontal: scale(10), paddingBottom: scale(10), alignItems: 'center' }}>
                    <View style={{ flex: 1, borderRadius: scale(15), backgroundColor: colors.Whitebackground, padding: scale(10), width: scaledWidth(90), }}>
                        <TouchableOpacity onPress={() => {
                            if (!store.getState().auth.token) {
                                setServiceModalVisible(true);
                            } else {
                                loved ? setLoved(false) : setLoved(true)
                            }
                        }} >
                            <Image source={loved ? Images.Loved : Images.Heart} style={{ alignContent: "flex-start", }} noLoad equalSize={7} />
                        </TouchableOpacity>
                        <Image source={{ uri: `${API_ENDPOINT}/${renderImage()}` }} equalSize={50} resizeMode={'contain'} style={{ alignContent: "center", alignItems: "center", justifyContent: "center", alignSelf: "center", margin: scale(5) }} />
                    </View>
                </View>
                {data.slider.length >= 2 ? <View style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    top: scaledHeight(35),
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    // left: 30
                }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <FlatList keyExtractor={(item) => item.id} data={data.slider.slice(1)} numColumns={Math.ceil(data.slider.length - 1)} showsVerticalScrollIndicator={false}
                            style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                                return <ImageProduct product={item} />
                            }} />
                    </ScrollView>
                </View> : null}
                {/* <View style={{ alignSelf: 'stretch' }}>
                    <Swiper height={40} product data={data.slider && data.slider.length > 0 ? data.slider : data.image ? [data.image] : []}
                        setIndex={(index) => setImgActive(index)} onItemPressed={(item) => {
                            setImg(item);
                            setImageVisible(true);
                        }} />
                    <View style={{
                        backgroundColor: colors.counter, width: scaledWidth(15), borderRadius: scale(10), marginHorizontal: scale(10), flexDirection: "row", alignItems: "center", justifyContent: "center",
                        position: 'absolute', bottom: scale(8), right: 0
                    }}>
                        <Image source={Images.vector} equalSize={4} />
                        <Text color={"white"} size={6}> {imgActive + 1}/{data.slider && data.slider.length ? data.slider.length : 1} </Text>
                    </View>
                </View> */}
                <View style={{ marginHorizontal: scale(10), marginVertical: scale(6), marginTop: scale(30), paddingHorizontal: scale(5) }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View>
                            <Text color={'#1D1E20'} bold size={9.5}>{data.name}</Text>
                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <Text semiBold color={'#CA944B'} size={8.5} style={{}}>{data.offer === 0 ? data.price + " " + t('pound'): data.price * (100 - data.offer) / 100 /*data.price*/ + " " + t('pound')}</Text>
                                {
                                    data.offer !== 0 ? <Text
                                        size={8.5} style={{ textDecorationLine: 'line-through', marginLeft: scale(5), }} semiBold color={'#8F959E'}>{data.price}{t('pound')} </Text> : null
                                }
                                <Text semiBold color={'#8F959E'} size={7.5} style={{ marginHorizontal: scale(5) }}>{data.productType.name}</Text>
                            </View>
                            {/* <Text semiBold color={colors.textTriary} size={6} style={{ marginTop: -scale(5) }}>{data.unit}</Text> */}
                        </View>
                        {/* <Image equalSize={12} style={{ margin: scale(5) }} source={{ uri: brandImage }} /> */}
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between', }}>
                        <View>
                            <Text color={"#8F959E"} size={7} semiBold >{t('Brand') + ' : ' + data.brand.name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: `${API_ENDPOINT}${data.brand.image}` }} style={{}} noLoad equalSize={15} resizeMode={'contain'} />
                                {data.quantity == 0 ? <View style={{ marginHorizontal: scale(8), backgroundColor: '#EB4335', borderRadius: scale(10), height: scaledHeight(3.5) }}>
                                    <Text style={{ paddingHorizontal: scale(30), textAlign: 'center' }} color={"#FFFFFF"} size={7}  >{t('available')}</Text>
                                </View> : null}
                            </View>
                        </View>

                        <View style={{
                            justifyContent: 'center', alignItems: "flex-end"
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                                <TouchableOpacity
                                    style={{
                                        // linear,
                                        alignContent: "center",
                                        justifyContent: 'center',
                                        backgroundColor: "#00000000",
                                        // padding: 2,
                                        height: scaledWidth(7),
                                        width: scaledWidth(7),
                                        borderRadius: scaledWidth(7) / 2,
                                    }} onPress={() => {
                                        // if (count < item.quantity) {
                                        //     incrmentCount(prevCount => {
                                        //         addToCart(prevCount + 1);
                                        //         return prevCount + 1;
                                        //     });
                                        // }
                                        if (count < max) {
                                            incrmentCount(prevCount => prevCount + 1)
                                        }
                                    }}>
                                    <Icon color={'#1B3862'} name={'plus'} type={'Entypo'} size={9} style={{ textAlign: 'center', alignSelf: 'center', justifyContent: 'center' }}></Icon>
                                </TouchableOpacity>
                                <View activeOpacity={0.8} style={{
                                    marginHorizontal: scale(10),
                                    borderWidth: 1, borderColor: '#E2E2E2',
                                    paddingHorizontal: scale(6), color: "white", backgroundColor: colors.Whitebackground,
                                    borderRadius: scale(25), shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.5,
                                    width: scaledWidth(10),
                                    height: scaledWidth(10),
                                    shadowRadius: scale(25),
                                    alignContent: "center",
                                    justifyContent: "center",
                                    shadowOffset: { width: 0, height: 4 }
                                }} >
                                    <Text bold size={9} color={"#404B52"} style={{ textAlign: 'center', alignSelf: 'center', }}>{count}</Text>
                                </View>

                                <TouchableOpacity
                                    style={{
                                        alignContent: "center",
                                        justifyContent: 'center',
                                        backgroundColor: "#00000000",
                                        // padding: 2,
                                        height: scaledWidth(7),
                                        width: scaledWidth(7),
                                        borderRadius: scaledWidth(7) / 2,
                                    }} onPress={() => {
                                        // if (count > 1) {
                                        //     incrmentCount(prevCount => {
                                        //         addToCart(prevCount - 1);
                                        //         return prevCount - 1;
                                        //     });
                                        // }
                                        if (count > 1) {
                                            incrmentCount(prevCount => prevCount - 1)
                                        }
                                    }}>
                                    <Icon size={9} color={'#8F959E'} type={'Entypo'} name={'minus'} style={{ textAlign: 'center', alignSelf: 'center', justifyContent: 'center' }}></Icon>
                                </TouchableOpacity>

                            </View>
                            <Text color={"#8F959E"} size={7} semiBold >{t('maxumam')}{data.maxQuantity < data.quantity ? data.maxQuantity : data.quantity} {data.productType.name}</Text>
                        </View>
                    </View>

                    {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", alignContent: "center" }}>

                        <View style={{}}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(-4) }}>
                                <Icon name={"star"} color={colors.Rate} style={{ alignSelf: "center" }} size={6} />
                                <Text semiBold color={colors.Rate} style={{ paddingHorizontal: scale(2), alignSelf: "center", paddingTop: scale(3) }} size={6}>{data.totalRate}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", borderRadius: scale(20), backgroundColor: colors.StockColor }}>
                                <Text bold color={colors.info} style={{ paddingHorizontal: scale(4) }} size={6}>{t("Avalible")}</Text>
                                <View style={{ alignItems: "center", borderRadius: scale(20), backgroundColor: "#C02430", paddingHorizontal: scale(6) }}>
                                    <Text color={colors.Whitebackground} size={6}>{data.quantity}</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            {isInCart ? <Button linear elevation={1} radius={15} disabled={true} style={{
                                paddingVertical: scale(1), paddingHorizontal: scale(10), marginBottom: scale(6),
                                alignSelf: 'center', alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
                            }}>
                                <Icon name="cart-check" type="MaterialCommunityIcons" color="white" size={7} />
                                <Text color="white" size={6} style={{ paddingStart: scale(2) }}>{t('addedToCart')}</Text>
                            </Button> : null}
                            <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{ flexDirection: "row", alignItems: "center", borderRadius: scale(20), borderColor: colors.Rate, borderWidth: 2, paddingHorizontal: scale(6) }}>
                                <Image source={Images.starGif} equalSize={6.5} />
                                <Text semiBold color={colors.Rate} style={{ paddingStart: rtl ? scale(3) : 0, paddingEnd: rtl ? 0 : scale(3) }} size={6.5}>{t("Rating")}</Text>
                                <Text semiBold color={colors.textTriary} size={6.5}>({data.rateCount})</Text>
                            </TouchableOpacity>
                        </View>

                    </View> */}
                    <View style={{ backgroundColor: '#E1E1E1', width: scaledWidth(90), height: 1, alignSelf: 'center', marginVertical: scale(5) }} />

                    <Text color={'#1B3862'} bold size={7} style={{ marginTop: scale(8) }}>{t('ProductDescription')}</Text>
                    <Text color={colors.textTriary} size={6.5} style={{ marginTop: scale(8) }}>{data.description}</Text>

                    <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: !data.quantity == 0 ? colors.MainBlue : '#8F959E', borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(70), elevation: 3, ...defaultStyles.elevationGame(0.5) }}>
                        <Button title={t('Add_To_cart')} bold size={8} elevation={3} backgroundColor={!data.quantity == 0 ? colors.MainBlue : '#8F959E'} color="white" loading={loading}
                            disabled={data.quantity == 0}
                            style={{
                                height: scaledHeight(6),
                                alignSelf: 'stretch',
                                // size:scale(20),
                                elevation: 5, ...defaultStyles.elevationGame(0.5)
                            }} radius={28} onPress={() => {
                                addToCart();

                            }} />
                    </View>
                    <View style={{ backgroundColor: '#E1E1E1', width: scaledWidth(90), height: 1, alignSelf: 'center', marginVertical: scale(5) }} />
                    <CommanProducts categories={realtedProducts} />
                </View>
            </ScrollView> : null}
            {/* <CartButton Bottom={scale(100)} /> */}
            {!loading && !error ? <CartButton Bottom={scale(70)} /> : null}
            <MadelLogin visible={serviceModalVisible} dismiss={() => {
                setServiceModalVisible(false);
            }} method={() => {
                Navigation.push({
                    name: 'Login', options: {
                        statusBar: {
                            backgroundColor: colors.animationColor,
                            //style: 'light'
                        }
                    }
                });
            }}>

            </MadelLogin>
        </View>
    );
}

ProductDetails.options = {
    statusBar: {
        visible: true,
        backgroundColor: 'rgba(118, 118, 128, 0.12)'
    }
};