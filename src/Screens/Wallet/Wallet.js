import React, { useEffect, useState } from "react";
import { ScrollView, View,FlatList } from 'react-native';
import { Text } from '../../Components/Text';
import { Image } from '../../Components/Image';
import { Icon } from '../../Components/Icon';
import { Button } from '../../Components/Button';
import { Header } from '../../Components/Header';
import { useTranslation } from "react-i18next";
import Images from "../../Assets/Images";
import { scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import { useSelector, connect } from "react-redux";
import defaultStyles from "../../Utils/defaultStyles";
import WarningModal from "../../Components/WarningModal";
import colors from "../../Utils/colors";
import { WalletContainer } from "./WalletContainer";
import WalletModel from "./WalletModel";
import NotWorkModal from "./notWorkModal";
import { getTransactionApi } from "../../Utils/api";

export const Wallet = (props) => {
    const { t, i18n } = useTranslation();
    const { user } = useSelector(state => state.auth);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    useEffect(() => {
        GetData();
    }, []);

    const [Transaction, setTransaction] = useState([]);

  
    const GetData = async () => {
        setTransaction([]);
        
        getTransactionApi(user.id).then(res => {
            console.log("WalletTransaction ", res);
            setTransaction(res.data.data);
        }).catch(error => {
            console.log("ERROR 11 :::: ", error);
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.Whitebackground }}>
            <Header back title={t('wallet')} style={{ backgroundColor: colors.grayBackgroung }} />

            <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center' }}>

                <View style={{ backgroundColor: colors.grayBackgroung, width: scaledWidth(100), alignItems: "center" }}>
                    <Image source={Images.profileWallet} equalSize={40} noLoad style={{ marginTop: scale(15) }} />
                    <Text semiBold size={7.5} style={{ margin: scale(15), marginBottom: scale(50) }} color={colors.MainBlue}>{t('currentBalance')}</Text>
                </View>


                <View style={{
                    justifyContent: 'center', alignItems: 'center', borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(6), borderRadius: scale(50), shadowColor: "rgba(17, 117, 184, 0.5)",
                    shadowOffset: {
                        width: 1,
                        height: 5,
                    },
                    shadowOpacity: 0.3,
                    //shadowRadius: 15,
                    marginTop: scale(50),
                    elevation: 2,
                }}>

                    <Button radius={25} backgroundColor={colors.MainBlue} elevation={2} style={{ paddingHorizontal: scale(40), height: scale(40), }} onPress={() => {
                        setServiceModalVisible(true);
                    }}>
                        <Text style={{ marginHorizontal: scale(7) }} bold size={7.2} color="white">{t('addBalance')}</Text>
                    </Button>
                </View>
                <Text semiBold color={colors.TextGray} style={{ margin: scale(10) }}>{t("previousOperation")}</Text>
                <ScrollView>
                      {Transaction && Transaction.length > 0 ?
                   
                   <FlatList key={(item) => item.id} data={Transaction} showsVerticalScrollIndicator={false}
                        style={{ marginStart: scale(10) }} contentContainerStyle={{ marginTop: scale(3),alignItems:"flex-start" }} renderItem={({ item }) => { return     <WalletContainer pay={item.type} dateTime={item.updatedAt} description={item.order ?item.description +"  "+item.order?.orderNumber : item.description} price={item.amount} />
                    }} /> :<View>
                    <Text bold size={7.5} style={{ margin: scale(15), marginBottom: scale(30) }} color={colors.MainBlue}>{t("NoLastProcess")}</Text>
                </View>}
                </ScrollView>

                
            </View>

            <View style={{
                alignSelf: 'stretch', paddingVertical: scale(3.5), borderRadius: scale(15),
                alignItems: 'center', justifyContent: 'center', backgroundColor: colors.Whitebackground, width: scale(160), height: scale(50), alignSelf: "center", shadowColor: "rgba(90, 108, 234, 0.7)",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.8,
                shadowRadius: 15,
                position: "absolute",
                right: scaledWidth(28), top: scale(295),
                elevation: 5,
            }}>
                <Text color={colors.highlight} size={7.5} bold>{`${user.wallet ? parseFloat(user.wallet).toFixed(2) : "0.00"} ${t('pound')}`}</Text>
            </View>

            <WalletModel visible={serviceModalVisible} dismiss={() => {
                setServiceModalVisible(false);
            }} />


        </View>
    );
}

