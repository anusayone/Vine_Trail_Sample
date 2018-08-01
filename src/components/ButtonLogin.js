import React from "react";
import {Image, StyleSheet, Text, TouchableWithoutFeedback, View,TouchableOpacity} from "react-native";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
const styles = StyleSheet.create({
    buttonLoginContainerView: {
        width: '100%',
        alignItems: 'center',
        marginBottom: responsiveHeight(3),
        marginTop: responsiveHeight(4)
    },
    buttonLoginBackgroundImage: {
        height: responsiveWidth(14),
        width: responsiveHeight(43),
        resizeMode: 'contain'
    },
    buttonLoginTouchableView: {
        width: responsiveHeight(43),
        height: responsiveWidth(14),
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
});
export default class ButtonLogin extends React.PureComponent {

    constructor() {
        super();
        this.state = {
            active: false
        }
    }

    render() {
        const {onPress, title, disabled} = this.props;
        return (
            <View
                style={styles.buttonLoginContainerView}>
                <Image
                    style={styles.buttonLoginBackgroundImage}
                    source={require('../../assets/images/signup_background.png')}>
                </Image>
                <TouchableWithoutFeedback
                    onPress={onPress}>
                    <View
                        style={styles.buttonLoginTouchableView}>
                        <Text style={{
                            color: '#FFFFFF',
                            fontFamily:'Roboto-Light',
                            fontSize: responsiveFontSize(3)
                        }}>{title}</Text>

                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}