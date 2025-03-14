import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, I18nManager, Dimensions, ScrollView } from 'react-native';
import colors from '../../../Utils/colors';
import { Text } from '../../../Components/Text';
import { scale, scaledHeight, scaledWidth } from '../../../Utils/responsiveUtils';
import { Image } from '../../../Components/Image';
import { API_ENDPOINT } from '../../../configs';
import Navigation from '../../../Utils/Navigation';
import Images from '../../../Assets/Images';

export default CategoryContainer = (props) => {
  return (

    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "space-between", height: scale(39), backgroundColor: colors.grayBackgroung, borderRadius: scale(10), margin: scale(3) }}
      onPress={() => {
        Navigation.push({
          name: 'Section',
          options: {
            statusBar: {
              backgroundColor: colors.grayBackgroung
            }
          }, passProps: { id: props.item.id,name:props.item.name }
        })
      }}>
      <View style={{ alignItems: "center", alignContent: "center", justifyContent: "center", backgroundColor: "rgba(238, 230, 221, 1)", borderRadius: scale(10), height: scaledWidth(8), width: scaledWidth(8), marginHorizontal: scale(3) }}>
        <Image source={{ uri: `${API_ENDPOINT}${props.item.image}` }} equalSize={6} />
      </View>
      <View style={{ alignItems: "center", alignContent: "center", justifyContent: "center", alignSelf: "center", width: scaledWidth(18) }}>
        <Text color={colors.MainGray} numberOfLines={1} seniBold size={6}>{props.item.name}</Text>
      </View>
    </TouchableOpacity>

  );
}