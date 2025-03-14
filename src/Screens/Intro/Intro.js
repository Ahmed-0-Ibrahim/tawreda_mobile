import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity } from 'react-native';
import { useSelector } from "react-redux";
import { authProcedure } from "../../App";
import Images from "../../Assets/Images";
import { Button } from "../../Components/Button";
import { Icon } from "../../Components/Icon";
import ProgressCircle from "../../Components/ProgressCircle";
import { Text } from "../../Components/Text";
import { Image } from "../../Components/Image";
import { API_ENDPOINT } from "../../configs";
import colors from "../../Utils/colors";
import { scale, scaledHeight, scaledWidth } from "../../Utils/responsiveUtils";
import { setInitialized } from "../../Redux/auth";

export const Intro = (props) => {
    const intro = useSelector(state => state.intro.intro);
    const { t, i18n } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const renderIntroItem = () => {
        return (
            <View style={{
                backgroundColor:colors.grayBackgroung,
            }}>
                <Image source={{ uri: `${API_ENDPOINT}${intro[currentIndex].file}` }}
                    style={{ width: currentIndex === 0 ? scaledWidth(100) : scaledHeight(80), height: '80%', left: currentIndex === 0 ? scale(55) : scale(60), }} resizeMode="contain" />
                {console.log("response INTRO aaaaaaaaaaaaaa :::: ", intro[currentIndex].file)}
                <View style={{
                    position: 'absolute',
                    top: scaledHeight(38),
                }}>
                    <Text color={colors.textSecondary} numberOfLines={4} size={15} bold style={{
                        width: scaledWidth(80),
                        paddingHorizontal: scaledWidth(10),
                    }}>{intro[currentIndex].title.replace(" ", "\n")}</Text>
                    <Text color={colors.textTriary} size={7} style={{ paddingHorizontal: scale(30) }}>{intro[currentIndex].text}</Text>
                </View>
            </View>
        );
    }


    const renderDots = () => {
        let dots = intro.map((item, index) => {
            return (
                <View style={{
                    borderRadius: scaledWidth(2.4), width: scaledWidth(2.4), height: scaledWidth(2.4),
                    marginHorizontal: scale(2), backgroundColor: index === currentIndex ? colors.highlight : '#BDBDBD'
                }} />
            );
        });

        return (
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {dots}
            </View>
        );
    }

    return (
        <View style={{ flex: 1 ,backgroundColor:colors.grayBackgroung}}>
            <View style={{
                height: scaledHeight(7), justifyContent: 'center',backgroundColor:colors.grayBackgroung,
            }}>
                {(intro.length - 1) === currentIndex ? <View style={{}} /> :
                    <View style={{}}>
                        <TouchableOpacity onPress={() => {
                            setInitialized();
                            authProcedure(i18n.language === 'ar');
                        }} style={{ left: scaledWidth(80) }}>
                            <Text color={colors.textSecondary} size={8}>{t('skip')}</Text>
                        </TouchableOpacity>
                    </View>}
            </View>
            {renderIntroItem()}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(20), flex: 0.2, marginTop:scaledWidth(15) }}>

                {renderDots()}

                {/* <View style={{ justifyContent: 'flex-end', alignSelf: 'stretch', alignItems: 'center', marginTop: scale(15), borderColor: colors.MainBlue, borderWidth: scale(3), padding: scale(8), borderRadius: scale(50), }}>

                    <Button title={currentIndex === 1 ? t('startnow') : t('next')} size={7.5} elevation={3} style={{
                        
                        alignSelf: 'stretch',

                    }} bold radius={28} color="white"
                        backgroundColor={colors.MainBlue}
                        onPress={() => {
                            if (currentIndex === (intro.length - 1)) {
                                setInitialized();
                                authProcedure(i18n.language === 'ar');
                            }
                            else {
                                setCurrentIndex(currentIndex + 1);
                            }
                        }} />
                </View> */}


                <View style={{ marginLeft: scaledWidth(42), }}>
                    <View style={{ height: scaledHeight(7), justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderColor: colors.MainBlue, borderWidth: scale(3), paddingHorizontal: scale(5), borderRadius: scale(50), elevation: 3 }}>
                        <Button title={currentIndex === 1 ? t('startnow') : t('next')} bold size={7} elevation={3} backgroundColor={colors.MainBlue} color="white"
                            style={{
                                height: scaledHeight(5),
                                width: scaledWidth(30),
                                alignSelf: 'center',
                                alignItems: 'center',

                            }} radius={28} onPress={() => {
                                if (currentIndex === (intro.length - 1)) {
                                    setInitialized();
                                    authProcedure(i18n.language === 'ar');
                                }
                                else {
                                    setCurrentIndex(currentIndex + 1);
                                }
                            }} />
                    </View>
                </View>

                {/* <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.25, marginBottom: scale(5) }}>
                    <ProgressCircle strokeWidth={scale(2)} strokeColor={colors.highlight} strokeEmptyColor={"#C1C1C1"}
                        circleSize={scaledWidth(18)} percentage={parseFloat((currentIndex + 1) / intro.length) * 100} backgroundColor="white">
                        <Button title={t('next')} bold size={10} color="white" linear onPress={() => {
                            if (currentIndex === (intro.length - 1)) {
                                setInitialized();
                                authProcedure(i18n.language === 'ar');
                            }
                            else {
                                setCurrentIndex(currentIndex + 1);
                            }
                        }}>
                        </Button>
                    </ProgressCircle>
                </View> */}
            </View>
        </View>
    );
}