import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, I18nManager, Dimensions, ScrollView } from 'react-native';
import colors from '../../Utils/colors';
import { Text } from '../../Components/Text';
import { scale, scaledHeight, scaledWidth } from '../../Utils/responsiveUtils';
import { Image } from '../../Components/Image';
import { API_ENDPOINT } from '../../configs';
import Images from '../../Assets/Images';
import Navigation from '../../Utils/Navigation';
export default MainBrandsContainer = (props) => {
    const cat = true;
    return (

        <TouchableOpacity style={{ alignItems: "center", alignContent: "center", justifyContent: "center", backgroundColor: colors.CategoryBackgroung, borderRadius: scale(10), height: scaledWidth(15), width: scaledWidth(22), margin: scale(5), padding: scale(15) }}
            onPress={() => {
                Navigation.push({
                    name: 'BrandSection',
                    options: {
                      statusBar: {
                        backgroundColor: colors.grayBackgroung
                      }
                    },passProps: { id: props.item.id ,name:props.item.name ,image:props.item.image }
                  })
            }}>
                              <Image source={{ uri:`${API_ENDPOINT}${props.item.image}` }} equalSize={12.5} style={{borderRadius:10}} />

        </TouchableOpacity>

    );
}