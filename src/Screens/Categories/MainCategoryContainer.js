import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, I18nManager, Dimensions, ScrollView } from 'react-native';
import colors from '../../Utils/colors';
import { Text } from '../../Components/Text';
import { scale, scaledHeight, scaledWidth } from '../../Utils/responsiveUtils';
import { Image } from '../../Components/Image';
import { API_ENDPOINT } from '../../configs';
import Navigation from '../../Utils/Navigation';
import Images from '../../Assets/Images';

export default MainCategoryContainer = (props) => {
    const cat = true;
    return (
       
       
        <TouchableOpacity style={{ alignItems: "center", alignContent: "center", justifyContent: "space-between", width: scaledWidth(22), backgroundColor: colors.CategoryBackground2, borderRadius: scale(10), margin: scale(5) }}
        onPress={()=>{
            Navigation.push({
                name: 'Section',
                options: {
                  statusBar: {
                    backgroundColor: colors.grayBackgroung
                  }
                }, passProps: { id: props.item.id,name:props.item.name }
              })
        }}>
        <View style={{ alignItems: "center", alignContent: "center", justifyContent: "center", backgroundColor: colors.CategoryBackgroung, borderTopLeftRadius: scale(10),borderTopRightRadius: scale(10), height: scaledWidth(20), width: scaledWidth(22) }}>
            <Image source={{ uri:`${API_ENDPOINT}${props.item.image}` }} equalSize={14} />
        </View>
        <View style={{ alignItems: "center", alignContent: "center", justifyContent: "center", alignSelf: "center", width: scaledWidth(22),height:scaledWidth(8) }}>
            <Text color={colors.MainGray} seniBold size={6} numberOfLines={1}>{props.item.name}</Text>
        </View>
    </TouchableOpacity>

    );
}