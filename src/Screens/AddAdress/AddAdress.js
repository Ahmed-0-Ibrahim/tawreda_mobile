import React, { useState, useRef, useEffect } from "react";
import { View, Keyboard, TouchableWithoutFeedback, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
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
import { CreatAdress, getRegion, getCities, getCountry } from "../../Utils/api";
import Navigation from "../../Utils/Navigation";
import { useSelector } from "react-redux";
import defaultStyles from "../../Utils/defaultStyles";
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export const AddAdress = (props) => {
    const { user } = useSelector(state => state.auth);
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);

    const [governorate, setGovernorate] = useState('');

    const [governorates, setGovernorates] = useState([]);

    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [regions, setRegions] = useState([]);
    const [Cities, setCities] = useState([]);
    const [regionID, SetRegionID] = useState();

    const [regionn, setRegionn] = useState({
        latitude: 30.033,
        longitude: 31.2088,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
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
            latitudeDelta: 0.035,
            longitudeDelta: 0.035,
        });
        setMarker({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        });
    };

    useEffect(() => {
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
    });

    let submit = (values) => {
        setLoading(true);
        console.log("values:::: ", values);
        if (regionID == null) {
            Navigation.showOverlay(t('ChooseRegion'));

        }
        else if (marker == null) {
            Navigation.showOverlay(t('ChooseLocation'));

        }
        else {
            let _values = { ...values, name: values.address, region: regionID, lat: `${marker.latitude.toFixed(5)}`, long: `${marker.longitude.toFixed(5)}` };
            console.log("COUNTRY:::: ", _values);
            CreatAdress(_values).then(res => {
                console.log("RES::: ", res);
                setLoading(false);
                Navigation.showOverlay(t('AddAdressDone'));
                setTimeout(() => {
                    Navigation.pop();
                }, 250);
            }).catch(error => {
                console.log("ERROR::: ", error);
                setLoading(false);
                Navigation.showOverlay(error, 'fail');
            })
        }

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
                        components: 'country:eg'
                    }}
                    onFail={error => console.error("ERRRRRror SEARCH MAP", error)}
                />
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback style={{ flex: 1 }} disabled={true}>
            <View style={{ flex: 1, backgroundColor: colors.grayBackgroung }}>
                <Header title={t('AddAdress')} back />
                <ScrollView style={{ alignSelf: 'stretch', flex: 1, backgroundColor: colors.grayBackgroung }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>

                    <MapView
                        style={{ alignSelf: 'stretch', height: scaledHeight(35), marginHorizontal: scale(20), marginBottom: scale(20), marginTop: scale(20), borderRadius: 330, borderWidth: 50, borderColor: "red" }}
                        initialRegion={regionn}
                        region={regionn}
                        onRegionChangeComplete={region => setRegionn(region)}
                        onPress={handleMapPress}
                    >
                        {marker && (
                            <Marker coordinate={marker} title="Selected Location" />
                        )}
                    </MapView>

                    {renderInput()}

                    <Formik initialValues={{ address: '', street: '', bulidingNumber: '', floor: '', specialMark: '' }}
                        validationSchema={validationSchema} onSubmit={(values) => {
                            submit(values);
                            console.log("VAAAAAAAAAAAAAAAAAaal", values);
                        }}>
                        {props => (
                            <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center' }}>

                                <Input {...props} name="address" placeholder={t('AdressName')}
                                    onBlur={props.handleBlur('address')} onChangeText={props.handleChange('address')} error={props.touched.address && props.errors.address}
                                    containerStyle={{ marginHorizontal: scale(20), marginBottom: scale(20), color: colors.Whitebackground }} style={{ paddingTop: 0, paddingBottom: 0, height: scaledHeight(6), }}
                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }} />

                                <View style={{ flexDirection: 'row', height: scaledHeight(7), width: scaledWidth(90), backgroundColor: colors.Whitebackground, marginBottom: scale(20), borderRadius: scale(10), alignContent: "space-around", justifyContent: "space-around", paddingTop: scale(10), alignItems: "center", paddingHorizontal: scale(15) }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center" }}
                                        onPress={() => {
                                            openGov();
                                        }}>
                                        <Text color={colors.textPrimary}>{governorate == '' ? t('Governorate') : governorate}</Text>
                                        <Icon size={10} type={"Feather"} name={"chevron-down"} color={colors.icon} style={{ marginHorizontal: scale(10) }} />
                                    </TouchableOpacity>

                                    <Picker
                                        ref={pickerGovRef}
                                        style={styles.picker}
                                        selectedValue={governorate}
                                        onValueChange={value => {
                                            setGovernorate(value.name)
                                            getCity(value.id);
                                        }}
                                        itemStyle={{ backgroundColor: colors.Whitebackground, color: colors.MainBlue, fontFamily: "Ebrima", fontSize: 17 }}
                                    //placeholderColor="#999"
                                    //  mode='dropdown'
                                    >
                                        <Picker.Item label={t('ChooseGovernorate')} value="" />
                                        {governorates.map((item) => {
                                            return (<Picker.Item backgroundColor={colors.Whitebackground} label={item.name} value={item} />);
                                        })}

                                    </Picker>

                                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center" }}
                                        onPress={() => {
                                            openRegion();

                                        }}>
                                        <Text color={colors.textPrimary}>{region == '' ? t('Region') : region}</Text>
                                        <Icon size={10} type={"Feather"} name={"chevron-down"} color={colors.icon} style={{ marginHorizontal: scale(10) }} />
                                    </TouchableOpacity>

                                    <Picker
                                        ref={pockerRegRef}
                                        style={styles.picker}
                                        selectedValue={region}
                                        onValueChange={value => {
                                            setRegion(value.name)
                                            getRegions(value.id);
                                        }}
                                    // mode='dropdown'
                                    >

                                        <Picker.Item label={t('ChooseCity')} value="" />
                                        {Cities.map((item) => {
                                            return (<Picker.Item label={item.name} value={item} />);
                                        })}

                                        {/* Add more governorates here */}
                                    </Picker>


                                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center" }}
                                        onPress={() => {
                                            openDistrict();

                                        }}>
                                        <Text color={colors.textPrimary}>{district == '' ? t('District') : district}</Text>
                                        <Icon size={10} type={"Feather"} name={"chevron-down"} color={colors.icon} style={{ marginHorizontal: scale(10) }} />

                                    </TouchableOpacity>
                                    <Picker
                                        //  mode='dropdown'
                                        ref={pickerdistrictRef}
                                        style={[styles.picker]}
                                        selectedValue={district}
                                        onValueChange={value => {
                                            setDistrict(value.name)
                                            SetRegionID(value.id);
                                        }}
                                        selectionColor={colors.MainBlue}
                                    >

                                        <Picker.Item label={t('ChooseRegion')} value="" />
                                        {regions.map((item) => {
                                            return (<Picker.Item label={item.name} value={item} />);
                                        })}

                                        {/* Add more governorates here */}
                                    </Picker>



                                </View>

                                <Input {...props} name="street" placeholder={t('StreetName')}
                                    onBlur={props.handleBlur('street')} onChangeText={props.handleChange('street')} error={props.touched.street && props.errors.street}
                                    containerStyle={{ marginHorizontal: scale(20), marginBottom: scale(20), color: colors.Whitebackground }} style={{ paddingTop: 0, paddingBottom: 0, height: scaledHeight(6), }}
                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }} />


                                <View style={{ flexDirection: 'row', }}>
                                    <Input {...props} name="bulidingNumber" containerStyle={{ marginHorizontal: scale(5), width: scaledWidth(43), marginBottom: scale(20), color: colors.Whitebackground }} placeholder={t("buildingNumber")}
                                        onBlur={props.handleBlur('bulidingNumber')} keyboardType="number-pad"
                                        style={{ paddingTop: 0, paddingBottom: 0, height: scaledHeight(6), }} inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                        onChangeText={props.handleChange('bulidingNumber')} error={props.touched.bulidingNumber && props.errors.bulidingNumber} />

                                    <Input {...props} name="floor" containerStyle={{ marginHorizontal: scale(5), width: scaledWidth(43), marginBottom: scale(20), color: colors.Whitebackground }} placeholder={t("roleNumber")}
                                        onBlur={props.handleBlur('floor')} keyboardType="number-pad"
                                        style={{ paddingTop: 0, paddingBottom: 0, height: scaledHeight(6), }} inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                        onChangeText={props.handleChange('floor')} error={props.touched.floor && props.errors.floor} />
                                </View>
                                <Input {...props} name="specialMark" containerStyle={{ marginHorizontal: scale(20), color: colors.Whitebackground, marginBottom: scale(20), }} placeholder={t("specialMarque")}
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
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
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
        //backgroundColor: 'white',
        backgroundColor: '#f2f2f2',
        tintColor: colors.Whitebackground,
        color: 'white',
        fontSize: 16,
        placeholderTextColor: '#fff',
        marginBottom: scale(1000)

    },

});
