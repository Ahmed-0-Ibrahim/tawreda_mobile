import Images from "../Assets/Images";
import colors from "./colors";
import { responsiveFontSize, scale, scaledHeight } from "./responsiveUtils";
import { Platform } from 'react-native';

export default {
    text: {
        fontSize: responsiveFontSize(7),
        color: colors.textSecondary,
        fontFamily: 'Vazirmatn-Regular',
        paddingTop: scale(2),
    },
    textBold: {
        fontSize: responsiveFontSize(7),
        color: colors.textSecondary,
        fontFamily: 'Vazirmatn-Bold',
    },
    button: {
        borderRadius: scale(15),
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: scale(4),
        paddingHorizontal: scale(4),
    },
    buttonLoading: "white",
    icon: {
        color: 'white'
    },
    imageDefaultIcon: Images.logoGray,
    inputTitleText: {
        fontSize: responsiveFontSize(6.5),
        color: colors.highlight,
        fontFamily: 'Vazirmatn-Medium'
    },
    inputContainer: {
        //borderWidth: 0.5,
        //borderColor: colors.Gray2
        borderRadius:scale(25)
    },
    input: {
        paddingTop: scale(3),
        paddingBottom: scale(6),
        flex: 1,
        color: colors.textSecondary,
        fontFamily: 'Vazirmatn-Regular'
    },
    inputPlaceholderColor: colors.textTriary,
    inputError: {
        fontSize: responsiveFontSize(5.5),
        color: colors.highlight,
        fontFamily: 'Vazirmatn-Regular'
    },
    toastSuccess: 'white',
    toastFailure: 'white',
    toastInfo: 'white',
    headerContainer: {
        height: scaledHeight(8.5),
        //backgroundColor: colors.header,
        flexDirection: 'row',
        borderBottomLeftRadius: scale(5),
        borderBottomRightRadius: scale(5)
    },
    elevationGame: (opacity = 0.1, shadowColor = colors.MainGray, shadowRadius = 10) => {
        return {
            shadowOpacity: Platform.OS === 'ios' && opacity > 0.3 ? opacity - 0.35 : opacity,
            shadowColor: shadowColor,
            shadowRadius: shadowRadius,
            shadowOffset: { width: 0, height: 6 }
        }
    },
    marginTab: scaledHeight(13),
}