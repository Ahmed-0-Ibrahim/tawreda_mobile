import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, FlatList } from 'react-native';
import { Button } from "../../Components/Button";
import { Text } from "../../Components/Text";
import { scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import Images from "../../Assets/Images";
import colors from "../../Utils/colors";
import { Icon } from "../../Components/Icon";
import { Image } from "../../Components/Image";
import { PayType } from "../Wallet/payType";
import { Input } from "../../Components/Input";
import { Formik } from "formik";
import { getBrands } from "../../Utils/api";
import * as yup from 'yup';
import Navigation from "../../Utils/Navigation";
import BrandsContainer from "../Tabs/Home/brandsContainer";
import { API_ENDPOINT } from "../../configs";

export default FilterModel = (props) => {
    const { t, i18n } = useTranslation();




    useEffect(() => {
        getCatData();
    }, []);

    const [categories, setCategories] = useState([]);
    const [choose, setChoose] = useState()
    const [min, setmin] = useState()
    const [max, setmax] = useState()

    const getCatData = async () => {
        setCategories([]);
        getBrands().then(res => {
            console.log("RESPONSE::::: ", res);
            setCategories(res.data.data);
        }).catch(error => {
            console.log("ERROR:::: ", error);
        });
    }
    const [choice, setChoise] = useState();

    function close() {
        props.dismiss();
    }

    function chooseBrand(ch) {
        props.Brand ? null :
            props.chooiseBrand(ch);
    }


    function choosePrice(min, max) {
        props.priceFilter(min, max);
    }

    return (
        <Modal visible={props.visible} animationType="none" transparent={true}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => {
                props.dismiss();
            }}>
                <TouchableWithoutFeedback>
                    <View style={{
                        alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20),
                        paddingHorizontal: scale(10), paddingVertical: scale(15), backgroundColor: colors.Whitebackground,
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

                            <Text semiBold size={scale(7)} color={colors.MainBlue} >{t("filter")}</Text>
                            <Icon name="close" type="IonIcons" size={0} />
                        </View>
                        {props.Brand ? null :
                            <View style={{ alignSelf: 'stretch', marginTop: scale(15), paddingHorizontal: scale(10), }}>
                                <Text color={colors.MainBlue} semiBold size={7} >{t('Brand')}</Text>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <FlatList keyExtractor={(item) => item.id} data={categories} numColumns={Math.ceil(categories.length)} showsVerticalScrollIndicator={false}
                                        style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3) }} renderItem={({ item }) => {
                                            return <TouchableOpacity style={{ alignContent: "center", justifyContent: "center", height: scale(50), width: scale(87), backgroundColor: colors.grayBackgroung, borderRadius: scale(10), margin: scale(3), borderColor: choice == item.id ? colors.highlight : colors.grayBackgroung, borderWidth: scale(2), padding: scale(5) }}
                                                onPress={() => {
                                                    setChoise(item.id)
                                                }}>
                                                <View style={{ alignItems: "center", alignContent: "center", justifyContent: "center", backgroundColor: colors.Whitebackground, borderRadius: scale(10), width: scale(75), height: scale(40) }}>
                                                    <Image source={{ uri: `${API_ENDPOINT}${item.image}` }} equalSize={14.5} />
                                                </View>
                                            </TouchableOpacity>
                                            // return <BrandsContainer Choose={true} item={item} />
                                        }} />
                                </ScrollView>
                            </View>
                        }
                        <View style={{ height: scaledHeight(25), width: scaledWidth(95), marginVertical: scale(2), paddingHorizontal: scale(10), }}>
                            {/* <Formik initialValues={{ phone: t('userphone') }}
                                onSubmit={(values) => {
                                    chooseBrand(values.min, values.max);
                                    console.log(values);
                                }}>
                                {props => (
                                    <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', marginBottom: scale(18) }}>
                                        <Text color={colors.MainBlue} semiBold size={7} style={{ alignSelf: "flex-start" }} >{t("Price")}</Text>

                                        <View style={{ flexDirection: "row", }}>
                                            <View>
                                                <Text color={colors.MainBlue} semiBold size={7} style={{ paddingHorizontal: scale(10), }}>{t("from")}</Text>

                                                <Input {...props} name="min"
                                                    containerStyle={{ borderRadius: scale(10), height: scaledHeight(6.5), borderColor: colors.Gray2, borderWidth: scale(1), alignSelf: 'stretch', color: colors.Whitebackground, width: scaledWidth(45), marginHorizontal: scaledWidth(1.25) }}
                                                    placeholder={"500"}
                                                    keyboardType="number-pad" onBlur={props.handleBlur('phone')}
                                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                                    onChangeText={props.handleChange('phone')} error={props.touched.phone && props.errors.phone} />
                                            </View>

                                            <View>
                                                <Text color={colors.MainBlue} semiBold size={7} style={{ paddingHorizontal: scale(10), }} >{t("to")}</Text>

                                                <Input {...props} name="max"
                                                    containerStyle={{ borderRadius: scale(10), height: scaledHeight(6.5), borderColor: colors.Gray2, borderWidth: scale(1), color: colors.Whitebackground, width: scaledWidth(45), marginHorizontal: scaledWidth(1.25) }}
                                                    placeholder={"1200"}
                                                    keyboardType="number-pad" onBlur={props.handleBlur('phone')}
                                                    inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                                    onChangeText={props.handleChange('phone')} error={props.touched.phone && props.errors.phone} />
                                            </View>
                                        </View>

                                        <View style={{ justifyContent: 'center', alignItems: 'center', borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(5), borderRadius: scale(50), marginTop: scale(18) }}>
                                            <Button radius={25} backgroundColor={colors.MainBlue} elevation={2} style={{ paddingHorizontal: scale(60), }} onPress={() => {
                                                // props.chooiseBrand(choice);
                                                chooseBrand(choice)
                                                close();
                                                props.handleSubmit();
                                            }}>
                                                <Text style={{ marginHorizontal: scale(7) }} bold size={8.5} color="white">{t('MakeFilter')}</Text>
                                            </Button>
                                        </View>
                                    </View>
                                )}
                            </Formik> */}
                            <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', marginBottom: scale(18) }}>
                                <Text color={colors.MainBlue} semiBold size={7} style={{ alignSelf: "flex-start" }} >{t("Price")}</Text>

                                <View style={{ flexDirection: "row", }}>
                                    <View>
                                        <Text color={colors.MainBlue} semiBold size={7} style={{ paddingHorizontal: scale(10), }}>{t("from")}</Text>

                                        <Input {...props} name="min"
                                            containerStyle={{ borderRadius: scale(10), height: scaledHeight(6.5), borderColor: colors.Gray2, borderWidth: scale(1), alignSelf: 'stretch', color: colors.Whitebackground, width: scaledWidth(45), marginHorizontal: scaledWidth(1.25) }}
                                            // placeholder={}
                                            defaultValue={min?min:''}
                                            keyboardType="number-pad"
                                            inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                            onChangeText={newText => setmin(newText)} />
                                    </View>

                                    <View>
                                        <Text color={colors.MainBlue} semiBold size={7} style={{ paddingHorizontal: scale(10), }} >{t("to")}</Text>

                                        <Input {...props} name="max"
                                            containerStyle={{ borderRadius: scale(10), height: scaledHeight(6.5), borderColor: colors.Gray2, borderWidth: scale(1), color: colors.Whitebackground, width: scaledWidth(45), marginHorizontal: scaledWidth(1.25) }}
                                            defaultValue={max?max:''}
                                            keyboardType="number-pad"
                                            inputStyle={{ borderRadius: 15, paddingVertical: scale(4), paddingHorizontal: scale(4) }}
                                            onChangeText={newText => setmax(newText)} />
                                    </View>
                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center', borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(5), borderRadius: scale(50), marginTop: scale(18) }}>
                                    <Button radius={25} backgroundColor={colors.MainBlue} elevation={2} style={{ paddingHorizontal: scale(60), }} onPress={() => {
                                       props.Brand ? null: props.chooiseBrand(choice);
                                        props.dismiss();
                                        if(min && max){
                                            props.priceFilter(min,max)
                                        }
                                        // chooseBrand(choice)
                                        // close();
                                        // props.handleSubmit();
                                    }}>
                                        <Text style={{ marginHorizontal: scale(7) }} bold size={8.5} color="white">{t('MakeFilter')}</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}