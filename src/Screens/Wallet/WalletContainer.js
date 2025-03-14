import React, { useEffect, useState } from "react";
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
import { View } from 'react-native';

export const WalletContainer = (props) => {
    const { t, i18n } = useTranslation();
    const { user } = useSelector(state => state.auth);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);

    return (
        <View style={{
            backgroundColor: colors.Whitebackground, borderRadius: scale(15), marginHorizontal: scale(10),
            paddingHorizontal: scale(10), paddingTop: scale(10), paddingBottom: scale(7), elevation: 1, marginBottom: scale(10), width: scaledWidth(95), marginTop: scale(10)
        }}>

            <Text color={'rgba(143, 149, 158, 1)'} style={{ paddingHorizontal: scale(5) }} size={5}>{props.dateTime}</Text>
            <Text semiBold style={{ marginHorizontal: scale(4) }} color={colors.MainBlue} size={6}>{props.description}</Text>

            <Text color={props.pay =="SUM" ? colors.green : colors.red1} style={{ paddingHorizontal: scale(5) }} size={6}>{props.price} {t('pound')}</Text>

        </View>

    );
}

