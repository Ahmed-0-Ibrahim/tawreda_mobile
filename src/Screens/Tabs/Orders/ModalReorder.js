import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback,FlatList } from 'react-native';
import { Button } from "../../../Components/Button";
import { Text } from "../../../Components/Text";
import { scale, scaledHeight, scaledWidth } from "../../../Utils/responsiveUtils";
import Images from "../../../Assets/Images";
import colors from "../../../Utils/colors";
import { Icon } from "../../../Components/Icon";
import { Image } from "../../../Components/Image";
import { PayType } from "../Wallet/payType";
import { Input } from "../../Components/Input";
import { Formik } from "formik";
import * as yup from 'yup';
import { Card } from "./Card";
export default ModalReorder = (props) => {

    const [loding, setLoading]=useState(true)
    const [data, setData]=useState()
    const { t, i18n } = useTranslation();
    const [id,setid]=useState([23,6,5])

   
    useEffect(() => {
        console.log('props props modal :::',props.ids)
        setData(props.ids)
    }, [props.ids]);

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
                        <View style={{ flexDirection: 'row', justifyContent: "space-around", width: scaledWidth(90), alignContent: 'center', alignItems: "center" }}>
                            <TouchableOpacity style={{
                                alignItems: 'center', justifyContent: 'center',
                                width: scaledWidth(8), height: scaledWidth(8), borderRadius: scaledWidth(8) / 2, backgroundColor: 'rgba(118, 118, 128, 0.12)'
                            }} onPress={() => {
                                props.dismiss();
                            }}>
                                <Icon name="close" type="IonIcons" size={9.5} color={colors.MainBlue} />
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: scale(7) }} bold size={8.5} color="#CA944B">{t('Notavalible')}</Text>

                        </View>


                        <View style={{  width: scaledWidth(95), marginVertical: scale(2), alignItems: 'center' }}>
                            {/* <Button linear circle={20} style={{ marginTop: -30, }} activeOpacity={1}  >
                                {props.close ? <Icon name="close-sharp" type="IonIcons" size={20} /> :
                                    <Icon name="refresh-ccw" type="Feather" size={20} />}
                            </Button>
                            <Text color={'#CA944B'} size={8}>{props.text}</Text> */}
                            <FlatList showsHorizontalScrollIndicator={false} data={data} renderItem={({ item }) => {
                                return <Card id={item} method={(value)=>{setLoading(value)}} />
                            }} />
                            <View style={{ justifyContent: 'center', alignItems: 'center', borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(5), borderRadius: scale(50), marginTop: scale(18) }}>
                                <Button loading={loding} radius={25} backgroundColor={colors.MainBlue} elevation={2} style={{ paddingHorizontal: scale(60), }} onPress={
                                    props.method
                                }>
                                    <Text style={{ marginHorizontal: scale(7) }} bold size={8.5} color="white">{t('deleteAndCon')}</Text>
                                </Button>
                            </View>

                        </View>
                        <View style={{ height: scaledHeight(5), }} />
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}