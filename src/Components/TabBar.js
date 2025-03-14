import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, scaledHeight, scaledWidth } from '../Utils/responsiveUtils';
import Navigation from '../Utils/Navigation';
import { Navigation as NNavigation } from 'react-native-navigation';
import Images from '../Assets/Images';
import { Image } from './Image';
import { Text } from './Text';
import colors from '../Utils/colors';
import { useTabIndex } from './TabBarHook';
import { useSelector } from 'react-redux';
import { Icon } from './Icon';
import { connect } from 'formik';
import { store } from '../Redux/store';
import { MadelLogin } from './ModelLogin';
export const TabBar = (props) => {
    const { t, i18n } = useTranslation();

    const products = useSelector(state => state.cart.products);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);

    const activeTabIndex = useTabIndex(Navigation.currentTabIndex);

    const onTabItemPress = (index) => {
        Navigation.mergeOptions(Navigation.bottomTabsID, {
            bottomTabs: {
                currentTabIndex: index, options: {
                    statusBar: {
                        backgroundColor: colors.MainBlue
                    }
                }
            }
        });
        Navigation.currentTabIndex = index;
    }

    const styles = StyleSheet.create({
        tabItem: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: "center",
            alignContent: "center",
            color: colors.MainBlue
        },
        tabImage: {
            width: scaledWidth(7),
            height: scaledWidth(7),
            marginBottom: scale(3),
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: "center",
            alignContent: "center",
            color: colors.MainBlue
        },
        tabImageSmall: {
            width: scaledWidth(6.4),
            height: scaledWidth(6.4),
            marginBottom: scale(6)
        },
        tabImageSmaller: {
            width: scaledWidth(6),
            height: scaledWidth(6),
            marginBottom: scale(6)
        },
        highlight: {
            flex: 1,
            marginHorizontal: scale(32),
            borderBottomEndRadius: scale(15),
            borderBottomStartRadius: scale(15),
            backgroundColor: colors.highlight,
            shadowColor: colors.highlight,
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.5,
            shadowRadius: 40.65,

            elevation: 6,

        },
        noHighlight: {
            flex: 1,
            marginHorizontal: scale(32),
        }
    })

    return (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignSelf: 'stretch', backgroundColor: 'white' }}>
            <View style={{
                alignSelf: 'stretch', backgroundColor: 'white', borderRadius: scale(18), paddingHorizontal: scale(10), marginHorizontal: scale(10),
                shadowOffset: { width: 0, height: 5 }, overflow: 'visible', bottom: 20,
                shadowOpacity: 0.4,
                shadowColor: 'rgba(90,108,234,0.5)',
                shadowRadius: 10,
                elevation: 10,
            }}>

                <View style={{ alignSelf: 'stretch', height: scaledHeight(1.6), flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={[activeTabIndex === (i18n.language === 'ar' ? 3 : 0) ? styles.highlight : styles.noHighlight,]} />
                    <View style={activeTabIndex === (i18n.language === 'ar' ? 2 : 1) ? styles.highlight : styles.noHighlight} />
                    <View style={activeTabIndex === (i18n.language === 'ar' ? 1 : 2) ? styles.highlight : styles.noHighlight} />
                    <View style={activeTabIndex === (i18n.language === 'ar' ? 0 : 3) ? styles.highlight : styles.noHighlight} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: scale(10), justifyContent: 'space-between' }}>

                    <TouchableOpacity activeOpacity={0.5} style={styles.tabItem} onPress={() => onTabItemPress(i18n.language === 'ar' ? 3 : 0)}>
                        {activeTabIndex === (i18n.language === 'ar' ? 3 : 0) ? <Image source={Images.HomeDark} equalSize={6} />
                            : <Image source={Images.Home} equalSize={6} />}
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.5} style={styles.tabItem} onPress={() => onTabItemPress(i18n.language === 'ar' ? 2 : 1)}>


                        {activeTabIndex === (i18n.language === 'ar' ? 2 : 1) ? <Image source={Images.bagDark} equalSize={6} />
                            : <Image source={Images.bag} equalSize={6} />}
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.5} style={styles.tabItem} onPress={() => {
                        if (!store.getState().auth.token) {
                            setServiceModalVisible(true);
                        } else { onTabItemPress(i18n.language === 'ar' ? 1 : 2) }
                    }}>
                        {activeTabIndex === (i18n.language === 'ar' ? 1 : 2) ? <Image source={Images.HeartDark} equalSize={6} />
                            : <Image source={Images.Heart} equalSize={6} />}
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.5} style={styles.tabItem} onPress={() => onTabItemPress(i18n.language === 'ar' ? 0 : 3)}>
                        {activeTabIndex === (i18n.language === 'ar' ? 0 : 3) ? <Image source={Images.PersonDark} equalSize={6} />
                            : <Image source={Images.Person} equalSize={6} />}
                    </TouchableOpacity>

                </View>
            </View>
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

//export default connect() (TabBar); 