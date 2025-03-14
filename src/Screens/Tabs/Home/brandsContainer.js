
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
export default brandsContainer = (props) => {
  const cat = true;
  const [highlight, setHighLight] = useState(false);
  return (

    <TouchableOpacity style={{ alignContent: "center", justifyContent: "center", height: scale(50), width: scale(87), backgroundColor: colors.grayBackgroung, borderRadius: scale(10), margin: scale(3), borderColor: highlight ? colors.highlight : colors.grayBackgroung, borderWidth: scale(2), padding: scale(5) }}
      onPress={() => {
        props.Choose ? highlight ? setHighLight(false) : setHighLight(true) : Navigation.push({
          name: 'BrandSection',
          options: {
            statusBar: {
              backgroundColor: colors.grayBackgroung
            }
          }, passProps: { id: props.item.id ,name:props.item.name ,image:props.item.image }

        }
        )
      }}>
      <View style={{ alignItems: "center", alignContent: "center", justifyContent: "center", backgroundColor: colors.Whitebackground, borderRadius: scale(10), width: scale(75), height: scale(40) }}>
        <Image source={{ uri: `${API_ENDPOINT}${props.item.image}` }} equalSize={14.5} />
      </View>
    </TouchableOpacity>

  );
}