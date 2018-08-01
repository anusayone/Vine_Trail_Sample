import {StatusBar, Platform} from "react-native";
import {responsiveWidth,responsiveFontSize,responsiveHeight} from "../helpers/Responsive";

let styles = {
    containerView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#DDDDDD',
    },
    button: {
        padding: responsiveWidth(3),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000'

    },
    googleSigInContainer: {
        paddingTop: responsiveWidth(4)
    },
    loginBackgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    loginBackgroundOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    facebookLoginBackground: {
        height: 46,
        width: 120.7,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'contain',
    },
    googleLoginBackground: {
        height: 46,
        width: 120.7,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'contain'
    },
    facebookIcon: {
        height: 20.3,
        width: 10,
        position: 'absolute'

    },
    googleIcon: {
        height: 14,
        width: 24.3,
        position: 'absolute'
    },
    loginInputIcon: {
        height: responsiveWidth(4),
        width: responsiveWidth(4),
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'contain',
    },
    loginInput: {
        fontSize: responsiveFontSize(2.5),
        width: responsiveHeight(40),
        height: responsiveWidth(12),
        color: '#FFFFFF',
        paddingLeft: responsiveHeight(2),
        paddingRight: responsiveHeight(2),
        fontFamily: 'Roboto-Regular'
    }
};

export default styles;