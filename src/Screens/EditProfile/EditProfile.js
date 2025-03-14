import React, { useState, useEffect, useRef } from "react";
import { View, Keyboard, TouchableWithoutFeedback, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Input } from "../../Components/Input";
import { Header } from "../../Components/Header";
import { Icon } from "../../Components/Icon";
import { Text } from "../../Components/Text";
import { Image } from "../../Components/Image";
import Images from "../../Assets/Images";
import { useTranslation } from "react-i18next";
import { Formik } from 'formik';
import * as yup from 'yup';
import { responsiveFontSize, scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import colors from "../../Utils/colors";
import { Button } from "../../Components/Button";
import { contactUsApi, changePasswordApi, changeProfile, sendCodeFrpmProfile, getAddress, getCountry, getCities, getRegion, updateAdress } from "../../Utils/api";
import Navigation from "../../Utils/Navigation";
import { useSelector } from "react-redux";
import ElementChosse from './ElementChosse';
import MapView, { Marker } from 'react-native-maps';
import { updateUserFn } from "../../Redux/auth";
import defaultStyles from "../../Utils/defaultStyles";
import { store } from "../../Redux/store";
import { Picker } from '@react-native-picker/picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';

export const EditeProfile = (props) => {
    const { user } = useSelector(state => state.auth);
    const { user1, } = useSelector((state) => ({
        user1: state.auth.user,
    }));
    const { t, i18n } = useTranslation();
    const [country, setCountry] = useState({ countryCode: user.countryKey, cca2: user.countryCode.split('+')[1] });
    const [information, setinformation] = useState(props.address ? false : true);
    const [address, setaddress] = useState(props.address ? props.address : false);
    const [text, settext] = useState(user.phone);
    const [addresslocatio, setAddresslocatio] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [password, setpassword] = useState(false);
    const [phoneActive, setPhoneActive] = useState(false);
    const [governorate, setGovernorate] = useState(''/*addresslocatio[0].region.city.country.name*/);

    const [governorates, setGovernorates] = useState([]);

    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [regions, setRegions] = useState([]);
    const [Cities, setCities] = useState([]);
    const [regionID, SetRegionID] = useState();

    const [regionn, setRegionn] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
    });
    const [marker, setMarker] = useState(null);

    const handleMapPress = (e) => {
        const coordinate = e.nativeEvent.coordinate;
        setMarker({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
        });
    };

    const handleSelectResult = (data, details) => {
        console.log("DATAAAAAAAAAAAAAAAAaa", data, details);
        setRegionn({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    };

    useEffect(() => {
        getAddressFromAPI(user1.id)
        Geolocation.getCurrentPosition(
            position => {
                setRegionn({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
        getCountries();
    }, []);

    const getCountries = () => {
        setLoading(true);
        getCountry().then(res => {
            console.log("RES::::Adrrrrrrrrrrrrr ", res.data);
            setGovernorates(res.data);
            setLoading(false);
        }).catch(error => {
            console.log("ERROR::: ", error);
            setLoading(false);
        })
    }


    const getCity = (id) => {
        setLoading(true);
        console.log("ID ::::Adrrrrrrrrrr ", id);
        getCities(id).then(res => {
            console.log("RES::::Adrrrrrrrrrrrrr ", res.data);
            setCities(res.data);
            setLoading(false);
        }).catch(error => {
            console.log("ERROR::: ", error);
            setLoading(false);
        })
    }

    const getRegions = (id) => {
        setLoading(true);
        console.log("ID ::::Adrrrrrrrrrr ", id);
        getRegion(id).then(res => {
            console.log("RES::::Adrrrrrrrrrrrrr ", res.data);
            setRegions(res.data);
            setLoading(false);
        }).catch(error => {
            console.log("ERROR::: ", error);
            setLoading(false);
        })
    }
    let validationSchema = yup.object({
        address: yup.string().required(`${t('AdressName')} ${t('required')}`),
        street: yup.string().required(`${t('StreetName')} ${t('required')}`),
        bulidingNumber: yup.string().required(`${t('buildingNumber')} ${t('required')}`),
        floor: yup.string().required(`${t('roleNumber')} ${t('required')}`),
        specialMark: yup.string().required(t('required')),

    });

    let submitAddress = (values) => {
        setLoadingAddress(true);
        console.log("values:::: ", values);
        // if (regionID == null) {
        //     Navigation.showOverlay(t('ChooseRegion'));
        //     setLoading(false);

        // }
        // else if (marker == null) {
        //     Navigation.showOverlay(t('ChooseLocation'));
        //     setLoading(false);

        // }
        // else {
        let _values = { ...values, name: values.address, region: regionID, lat: `${marker.latitude.toFixed(5) ? marker.latitude.toFixed(5) : addresslocatio[0].lat}`, long: `${marker.longitude.toFixed(5) ? marker.longitude.toFixed(5) : addresslocatio[0].long}` };
        console.log("COUNTRY:::: ", _values);
        updateAdress(_values, addresslocatio[0].id).then(res => {
            console.log("RES::: ", res);
            setLoadingAddress(false);
            Navigation.showOverlay(t('AddAdressDone'));
            setTimeout(() => {
                Navigation.pop();
            }, 250);
            props.updateAddress ? props.updateAddress() : null;
        }).catch(error => {
            console.log("ERROR::: ", error);
            setLoadingAddress(false);
            Navigation.showOverlay(error, 'fail');
        })
        // }
    }

    const pickerGovRef = useRef();
    const pickerdistrictRef = useRef();
    const pockerRegRef = useRef();

    function openGov() {
        pickerGovRef.current.focus();
    }
    function openDistrict() {
        pickerdistrictRef.current.focus();
    }
    function openRegion() {
        pockerRegRef.current.focus();
    }

    function closeDistrict() {
        pickerdistrictRef.current.blur();
    }
    function closeRegion() {
        pockerRegRef.current.blur();
    }
    function closeGov() {
        pickerGovRef.current.blur();
    }

    const [search, setSearch] = useState(false);
    const [searchholder, setTextHolder] = useState("");
    const [TextSearch, setTextSearch] = useState('');
    const [searchText, setSearchText] = useState('');




    let validationSchema1 = yup.object({
        name: yup.string().required(`${t('name')} ${t('required')}`),
        phone: yup.string().matches(/^[0-9]+$/, `${t('phone')} ${t('invalid')}`).required(`${t('phone')} ${t('required')}`),
        email: yup.string().email(`${t('email')} ${t('invalid')}`).required(`${t('email')} ${t('required')}`),
    });

    let validationSchema2 = yup.object({
        currentPassword: yup.string().required(`${t('currentPassword')} ${t('required1')}`),
        newPassword: yup
            .string()
            .required(`${t('newPassword')} ${t('required1')}`)
            .min(6, `${t('newPassword')} ${t('password_length')} 6 ${t('chars_and_numbers')}`),
        conPass: yup
            .string()
            .oneOf([yup.ref('newPassword')], `${t('must_match')}`)
            .required(`${t('confirmPassword')} ${t('required1')}`),
    });

    let submit = (values) => {
        setLoading(true);
        console.log("COUNTRY:::: ", country);
        // let _values = { ...values, countryKey: country.countryCode, countryCode: `+${country.cca2}` };
        console.log("COUNTRY:::: ", values);
        changeProfile(values).then(res => {
            console.log("RES::: ", res);
            setLoading(false);
            updateUserFn(res)
            Navigation.showOverlay(t('udatedate'));
            setTimeout(() => {
                Navigation.pop();
            }, 250);
        }).catch(error => {
            console.log("ERROR::: ", error);
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    let SendCodeToPhone = async (phone) => {
        setLoading(true);
        sendCodeFrpmProfile({ phone: phone, countryCode: "20", }).then(res => {
            console.log("RES::: ", res);
            setLoading(false);
        }).catch(error => {
            console.log("ERROR::: ", error);
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    let submitChange = (values) => {
        setLoading(true);
        changePasswordApi(values).then(res => {
            console.log("RES::: ", res);
            setLoading(false);
            Navigation.showOverlay(t('confirmChangePass'));
            setTimeout(() => {
                Navigation.pop();
            }, 250);
        }).catch(error => {
            console.log("ERROR::: ", error);
            setLoading(false);
            Navigation.showOverlay(error, 'fail');
        })
    }

    const getAddressFromAPI = (id) => {
        setLoading(true);
        // setError(false);
        console.log("ID AHAME::::Adrrrrrrrrrr ", id);
        getAddress(id).then(res => {
            console.log("RES::::Adrrrrrrrrrrrrr ", res);
            setAddresslocatio(res);
            setGovernorate(res[0].region.city.country.name)
            setRegion(res[0].region.city.name)
            setDistrict(res[0].region.name)
            SetRegionID(res[0].region.id)
            const newRegionn = {
                latitude: res[0].lat,
                longitude: res[0].long,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };

            setRegionn(newRegionn);
            setLoading(false);
            // setError(false);
        }).catch(error => {
            console.log("ERROR::: ", error);
            // setError(true);
            setLoading(false);
        })
    }

    const renderInput = () => {
        return (
            <View style={{ position: "absolute", top: scale(30), right: scale(30), width: scaledWidth(85), zIndex: 401 }}>
                <GooglePlacesAutocomplete
                    placeholder={t("SearchHere")}
                    textInputProps={{
                        placeholderTextColor: colors.textTriary,
                        style: {
                            backgroundColor: 'white',
                            flex: 1,
                            fontFamily: 'Vazirmatn-Regular',
                            borderRadius: scale(10),
                            color: colors.MainGray,
                            fontSize: responsiveFontSize(6.5),
                            textAlign: i18n.language === 'ar' ? 'right' : 'left'
                        }
                    }}
                    styles={{
                        textInput: {
                            height: scale(45),
                            width: scaledWidth(85),
                            borderRadius: scale(10),
                        },
                        description: {
                            color: colors.MainGray,
                            fontSize: responsiveFontSize(7),
                        },
                        row: {
                            flexDirection: 'row'
                        }
                    }}
                    fetchDetails={true}
                    onPress={handleSelectResult}
                    query={{
                        key: "AIzaSyBa8wnfaglL_jNGhcMUsIAYBk5Ig4mEQmg",
                        language: i18n.language,
                    }}
                    onFail={error => console.error("ERRRRRror SEARCH MAP", error)}
                />
            </View>
        );
    }

    return (
        // <TouchableWithoutFeedback style={{ flex: 1 }}disabled={true} onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: colors.grayBackgroung }}>
                <Header title={t('editprofile')} back />
                <ScrollView style={{ alignSelf: 'stretch', flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
                    <Image source={Images.logo} width={40} height={18} style={{ alignSelf: 'center', marginTop: scale(6), }} />
                    <Image source={Images.logoTabActive} width={40} height={10} style={{ alignSelf: 'center', justifyContent: "flex-start", alignItems: "flex-start", }} />
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: '#F5F6FA',
                        // marginHorizontal: scale(10),
                        marginBottom: scale(20)
                    }}>

                        <ElementChosse name={t('information')} half={true} settrue={setinformation} setfalse={setaddress} setfalse1={setpassword} checked={information} />
                        <View style={{ borderRightColor: '#D1D1D1', borderRightWidth: 1, marginVertical: scale(8) }} />
                        <ElementChosse name={t('password')} settrue={setpassword} setfalse={setinformation} setfalse1={setaddress} checked={password} />
                        <View style={{ borderRightColor: '#D1D1D1', borderRightWidth: 1, marginVertical: scale(8) }} />
                        <ElementChosse name={t('address')} settrue={setaddress} setfalse={setpassword} setfalse1={setinformation} checked={address} />
                    </View>
                    {information ?
                        <Formik initialValues={{ name: user.name, email: user.email, phone: user.phone }}
                            validationSchema={validationSchema1} onSubmit={(values) => {
                                console.log("vaaaaaaaaaaaaaaa", values)
                                submit(values);
                            }}>
                            {props => (
                                <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center' }}>

                                    <Input {...props} name="name" defaultValue={user.name} icon={<Image source={Images.userIcon} equalSize={5.5} />}
                                        onBlur={props.handleBlur('name')} onChangeText={props.handleChange('name')} error={props.touched.name && props.errors.name}
                                        containerStyle={{ marginHorizontal: scale(20), marginBottom: scale(20), color: colors.Whitebackground }} style={{ paddingTop: 0, paddingBottom: 0 }}
                                        inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }} />

                                    <Input {...props} name="email" keyboardType="email-address" defaultValue={user.email} icon={<Image source={Images.messageIcon} equalSize={5} />}
                                        onBlur={props.handleBlur('email')} onChangeText={props.handleChange('email')} error={props.touched.email && props.errors.email}
                                        containerStyle={{ marginHorizontal: scale(20), marginBottom: scale(20), color: colors.Whitebackground }} style={{ paddingTop: 0, paddingBottom: 0 }}
                                        inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }} />

                                    <Input active defaultValue={user.phone}    {...props} name="phone" containerStyle={{ marginHorizontal: scale(20), color: colors.Whitebackground, marginBottom: scale(20) }}
                                        style={{ paddingBottom: scale(2) }} /*placeholder={user.phone} */ inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.Whitebackground }}
                                        icon={<Button disabled={user.phone == text} title={user.phone == text ? t('Activated') : t('Active')} size={5} color={user.phone == text ? colors.highlight : colors.Whitebackground} style={{ backgroundColor: user.phone == text ? colors.goldbackground : colors.highlight, paddingHorizontal: scaledWidth(4) }} onPress={() => {

                                            SendCodeToPhone(props.values.phone).then(() => {
                                                Navigation.push({
                                                    name: 'ActivePhone', options: {
                                                        statusBar: {
                                                            backgroundColor: colors.animationColor
                                                        }
                                                    }, passProps: {
                                                        mobile: props.values.phone, onValidate: () => {
                                                            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa update done", props.values)
                                                            submit(props.values)
                                                        }
                                                    }
                                                });
                                            }).catch(error => {
                                                Navigation.showOverlay(error, 'fail');
                                            })
                                            // Navigation.push({
                                            //     name: 'ActivePhone', options: {
                                            //         statusBar: {
                                            //             backgroundColor: colors.animationColor
                                            //         },
                                            //     }
                                            // });
                                        }} />} keyboardType="number-pad" onBlur={props.handleBlur('phone')}
                                        onChangeText={(text) => {
                                            settext(text)
                                            props.handleChange('phone')(text)
                                        }} error={props.touched.phone && props.errors.phone} />

                                    <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(60), marginBottom: scale(50) }}>
                                        <Button title={t('savesave')} bold size={8} elevation={3} backgroundColor={colors.MainBlue} color="white" loading={loading}
                                            style={{
                                                alignSelf: 'stretch',
                                                paddingVertical: scale(10),
                                            }} radius={28} onPress={() => {
                                                user.phone == text ?
                                                    props.handleSubmit() : Navigation.showOverlay(t('activeedphone'));
                                            }} />
                                    </View>
                                </View>
                            )}
                        </Formik>
                        : null}
                    {
                        password ? <Formik initialValues={{ currentPassword: '', newPassword: '', conPass: '' }} validationSchema={validationSchema2} onSubmit={(values) => {
                            console.log("valllllllllllllllllllllllllllllll", values);
                            submitChange(values);
                        }}>
                            {props => (
                                <>

                                    <Input {...props} name="currentPassword" containerStyle={{ marginHorizontal: scale(20), color: colors.Whitebackground, marginBottom: scale(20) }} placeholder={t("currentPassword")} onBlur={props.handleBlur('currentPassword')}
                                        style={{ paddingBottom: scale(2) }} keyboardType="password" onChangeText={props.handleChange('currentPassword')} error={props.touched.currentPassword && props.errors.currentPassword}
                                        inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.Whitebackground }} />

                                    <Input {...props} name="newPassword" containerStyle={{ marginHorizontal: scale(20), color: colors.Whitebackground, marginBottom: scale(20) }} placeholder={t("newPassword")} onBlur={props.handleBlur('newPassword')}
                                        style={{ paddingBottom: scale(2) }} keyboardType="password" onChangeText={props.handleChange('newPassword')} error={props.touched.newPassword && props.errors.newPassword}
                                        inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.Whitebackground }} />

                                    <Input {...props} name="conPass" containerStyle={{ marginHorizontal: scale(20), color: colors.Whitebackground }} placeholder={t("confirmNewPass")} onBlur={props.handleBlur('conPass')}
                                        style={{ paddingBottom: scale(2) }} keyboardType="password" onChangeText={props.handleChange('conPass')} error={props.touched.conPass && props.errors.conPass}
                                        inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4), backgroundColor: colors.Whitebackground }} />

                                    <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(60), marginBottom: scale(50) }}>
                                        <Button title={t('savesave')} bold size={8} elevation={3} backgroundColor={colors.MainBlue} color="white" loading={loading}
                                            style={{
                                                alignSelf: 'stretch',
                                                paddingVertical: scale(10),
                                            }} radius={28} onPress={props.handleSubmit} />
                                    </View>

                                </>
                            )}
                        </Formik> : null
                    }
                    {
                        address && (!loadingAddress && addresslocatio) ?
                            addresslocatio.length == 0 ? <Text style={{ alignSelf: "center" }}>{t("noAddress")}</Text> :
                                //  (!loadingAddress && addresslocatio) ?

                                <View>
                                    <MapView
                                        style={{ alignSelf: 'stretch', height: scaledHeight(35), marginHorizontal: scale(20), marginBottom: scale(20), marginTop: scale(20), borderRadius: 330, borderWidth: 50, borderColor: "red" }}
                                        initialRegion={{
                                            latitude: addresslocatio[0].lat,
                                            longitude: addresslocatio[0].long,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                        region={regionn}
                                        onPress={handleMapPress}
                                    >
                                        {marker && (
                                            <Marker coordinate={marker} title="Selected Location" />
                                        )}
                                    </MapView>
                                    {/* 
                            {marker && (
                                <View style={styles.bottomView}>
                                    <Text style={styles.bottomText}>
                                        Latitude: {marker.latitude.toFixed(5)}, Longitude:{' '}
                                        {marker.longitude.toFixed(5)}
                                    </Text>
                                </View>
                            )} */}

                                    {renderInput()}

                                    <Formik initialValues={{ address: addresslocatio[0].address, street: addresslocatio[0].street, bulidingNumber: addresslocatio[0].bulidingNumber, floor: addresslocatio[0].floor, specialMark: addresslocatio[0].specialMark }}
                                        validationSchema={validationSchema} onSubmit={(values) => {
                                            console.log("piker", values)
                                            if (regionID == null) {
                                                Navigation.showOverlay(t('ChooseRegion'));


                                            }
                                            else if (marker == null) {
                                                Navigation.showOverlay(t('ChooseLocation'));


                                            }
                                            else {
                                                submitAddress(values);
                                            }
                                        }}>
                                        {props => (
                                            <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center' }}>

                                                <Input {...props} name="address" placeholder={t('AdressName')}
                                                    defaultValue={addresslocatio[0].address}
                                                    onBlur={props.handleBlur('address')} onChangeText={props.handleChange('address')} error={props.touched.address && props.errors.address}
                                                    containerStyle={{ marginHorizontal: scale(20), marginBottom: scale(20), color: colors.Whitebackground }} style={{ paddingTop: 0, paddingBottom: 0, height: scaledHeight(6), }}
                                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }} />

                                                <View style={{ flexDirection: 'row', height: scaledHeight(7), width: scaledWidth(90), backgroundColor: colors.Whitebackground, marginBottom: scale(20), borderRadius: scale(10), alignContent: "space-around", justifyContent: "space-around", paddingTop: scale(10), alignItems: "center", paddingHorizontal: scale(15) }}>
                                                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center" }}
                                                        onPress={() => {
                                                            openGov();
                                                        }}>
                                                        <Text color={colors.textPrimary}>{governorate}</Text>
                                                        <Icon size={10} type={"Feather"} name={"chevron-down"} color={colors.icon} style={{ marginHorizontal: scale(10) }} />
                                                    </TouchableOpacity>

                                                    <Picker
                                                        ref={pickerGovRef}
                                                        style={styles.picker}
                                                        selectedValue={governorate}
                                                        onValueChange={value => {
                                                            setGovernorate(value.name)
                                                            getCity(value.id);
                                                            setRegion('')
                                                            setDistrict('')
                                                        }}
                                                        itemStyle={{ backgroundColor: colors.Whitebackground, color: colors.MainBlue, fontFamily: "Ebrima", fontSize: 17 }}
                                                    //  mode='dropdown'
                                                    >
                                                        <Picker.Item label="Select Governorate" value="" />
                                                        {governorates.map((item) => {
                                                            return (<Picker.Item backgroundColor={colors.Whitebackground} label={item.name} value={item} />);
                                                        })}
                                                        {/* <Picker.Item label="Cairo" value="Cairo" />
                                        <Picker.Item label="Alexandria" value="Alexandria" />
                                        <Picker.Item label="Giza" value="Giza" />
                                        <Picker.Item label="Qalubia" value="Qalubia" /> */}
                                                        {/* Add more governorates here */}
                                                    </Picker>

                                                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center" }}
                                                        onPress={() => {
                                                            openRegion();

                                                        }}>
                                                        <Text color={colors.textPrimary}>{region}</Text>
                                                        <Icon size={10} type={"Feather"} name={"chevron-down"} color={colors.icon} style={{ marginHorizontal: scale(10) }} />
                                                    </TouchableOpacity>

                                                    <Picker
                                                        ref={pockerRegRef}
                                                        style={styles.picker}
                                                        selectedValue={governorate}
                                                        onValueChange={value => {
                                                            setRegion(value.name)
                                                            getRegions(value.id);
                                                        }}
                                                    // mode='dropdown'
                                                    >

                                                        <Picker.Item label="Select Region" value="" />
                                                        {Cities.map((item) => {
                                                            return (<Picker.Item label={item.name} value={item} />);
                                                        })}
                                                        {/* Add more governorates here */}
                                                    </Picker>


                                                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center" }}
                                                        onPress={() => {
                                                            openDistrict();

                                                        }}>
                                                        <Text color={colors.textPrimary}>{district}</Text>
                                                        <Icon size={10} type={"Feather"} name={"chevron-down"} color={colors.icon} style={{ marginHorizontal: scale(10) }} />

                                                    </TouchableOpacity>
                                                    <Picker
                                                        //  mode='dropdown'
                                                        ref={pickerdistrictRef}
                                                        style={styles.picker}
                                                        selectedValue={district}
                                                        onValueChange={value => {
                                                            setDistrict(value.name)
                                                            SetRegionID(value.id);
                                                        }}
                                                    >

                                                        <Picker.Item label="Select District" value="" />
                                                        {regions.map((item) => {
                                                            return (<Picker.Item label={item.name} value={item} />);
                                                        })}
                                                        {/* Add more governorates here */}
                                                    </Picker>



                                                </View>

                                                <Input {...props} name="street" placeholder={t('StreetName')}
                                                    defaultValue={addresslocatio[0].street}
                                                    onBlur={props.handleBlur('street')} onChangeText={props.handleChange('street')} error={props.touched.street && props.errors.street}
                                                    containerStyle={{ marginHorizontal: scale(20), marginBottom: scale(20), color: colors.Whitebackground }} style={{ paddingTop: 0, paddingBottom: 0, height: scaledHeight(6), }}
                                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }} />


                                                <View style={{ flexDirection: 'row', }}>
                                                    <Input {...props} name="bulidingNumber" containerStyle={{ marginHorizontal: scale(5), width: scaledWidth(43), marginBottom: scale(20), color: colors.Whitebackground }} placeholder={t("buildingNumber")}
                                                        defaultValue={addresslocatio[0].bulidingNumber}
                                                        onBlur={props.handleBlur('bulidingNumber')} keyboardType="number-pad"
                                                        style={{ paddingTop: 0, paddingBottom: 0, height: scaledHeight(6), }} inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                                        onChangeText={props.handleChange('bulidingNumber')} error={props.touched.bulidingNumber && props.errors.bulidingNumber} />

                                                    <Input {...props} name="floor" containerStyle={{ marginHorizontal: scale(5), width: scaledWidth(43), marginBottom: scale(20), color: colors.Whitebackground }} placeholder={t("roleNumber")}
                                                        defaultValue={addresslocatio[0].floor}
                                                        onBlur={props.handleBlur('floor')} keyboardType="number-pad"
                                                        style={{ paddingTop: 0, paddingBottom: 0, height: scaledHeight(6), }} inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                                        onChangeText={props.handleChange('floor')} error={props.touched.floor && props.errors.floor} />
                                                </View>
                                                <Input {...props} name="specialMark" containerStyle={{ marginHorizontal: scale(20), color: colors.Whitebackground, marginBottom: scale(20), }} placeholder={t("specialMarque")}
                                                    defaultValue={addresslocatio[0].specialMark}
                                                    onBlur={props.handleBlur('specialMark')}
                                                    style={{ paddingTop: 0, paddingBottom: 0, height: scaledHeight(6), }} inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                                    onChangeText={props.handleChange('specialMark')} />

                                                <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), marginHorizontal: scale(60), marginBottom: scale(50) }}>
                                                    <Button title={t('Add')} bold size={8} elevation={3} backgroundColor={colors.MainBlue} color="white" loading={loading}
                                                        style={{
                                                            alignSelf: 'stretch',
                                                            paddingVertical: scale(10),
                                                        }} radius={28} onPress={props.handleSubmit} />
                                                </View>
                                            </View>
                                        )}
                                    </Formik>
                                </View>
                            : null
                    }
                </ScrollView>
            </View>
        /* </TouchableWithoutFeedback> */
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#007aff',
    },
    picker: {
        marginBottom: 20,
    },

});
