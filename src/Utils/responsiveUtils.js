import { Dimensions, Platform } from 'react-native';
import PixelRatio from 'react-native/Libraries/Utilities/PixelRatio';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const ratio = width / 375;

export const scaledWidth = (p) => {
    return width * (p / 100);
}

export const scaledHeight = (p) => {
    return height * (p / 100);
}

export const scale = (size) => {
    let newSize = ratio * size;

    // if (Platform.OS === 'ios') {
    //     return Math.round(PixelRatio.roundToNearestPixel(newSize));
    // }
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const responsiveFontSize = (f, factor = 0.5) => {
    const rw =
      Platform.OS === 'ios'
        ? width * ((f - 1) / 100)
        : width * ((f - 1) / 100);
  
    return PixelRatio.roundToNearestPixel(f + (rw - f) * factor);
  };