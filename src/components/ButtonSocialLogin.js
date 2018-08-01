import React from "react";
import {Image, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";

const styles = StyleSheet.create({
    buttonSocialLoginContainerView: {
        width: 278.7,
        height: 32.7,
        flexDirection: 'row'
    },
    buttonSocialLoginFacebookView: {
        width: 278.7,
        height: 32.7,
        flex: 1
    },
    buttonSocialLoginFacebookBackGroundImage: {
        resizeMode: 'contain',
        width: 139.3,
        height: 32.7
    },
    buttonSocialLoginFacebookInnerView: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSocialLoginFacebookIcon: {
        resizeMode: 'contain',
        width: 6.3,
        height: 12,
        marginRight: 4.7
    },
    buttonSocialLoginGoogleView: {
        width: 278.7,
        height: 32.7,
        flex: 1
    },
    buttonSocialLoginGoogleBackGroundImage: {
        resizeMode: 'contain',
        width: 139.3,
        height: 32.7
    },
    buttonSocialLoginGoogleInnerView: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonSocialGoogleFacebookIcon: {
        resizeMode: 'contain',
        width: 17.3,
        height: 11,
        marginRight: 4.7
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Roboto-Bold',
        fontSize: 10
    }
});

export default class ButtonSocialLogin extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            active: false
        }
    }

    render() {
        const {facebookLogin, googleLogin} = this.props;
        return (
            <View style={styles.buttonSocialLoginContainerView}>
                <View style={styles.buttonSocialLoginFacebookView}>
                    <TouchableWithoutFeedback
                        onPress={facebookLogin}>
                        <View>
                            <Image
                                style={styles.buttonSocialLoginFacebookBackGroundImage}
                                source={require('../../assets/images/facebook_login.png')}/>
                            <View style={styles.buttonSocialLoginFacebookInnerView}>
                                <Image
                                    style={styles.buttonSocialLoginFacebookIcon}
                                    source={require('../../assets/images/facebook_icon.png')}/>
                                <Text style={styles.buttonText}>FACEBOOK</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.buttonSocialLoginGoogleView}>
                    <TouchableWithoutFeedback
                        onPress={googleLogin}>
                        <View>
                            <Image
                                style={styles.buttonSocialLoginGoogleBackGroundImage}
                                source={require('../../assets/images/google_login.png')}/>
                            <View style={styles.buttonSocialLoginGoogleInnerView}>
                                <Image
                                    style={styles.buttonSocialGoogleFacebookIcon}
                                    source={require('../../assets/images/google.png')}/>
                                <Text style={styles.buttonText}>GOOGLE</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}