import React from "react";
import {Image, StyleSheet, TextInput, View} from "react-native";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
const styles = StyleSheet.create({
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
});

export default class InputLogin extends React.PureComponent {
    constructor() {
        super();
    }

    render() {
        const {placeholder, keyboardType, onChangeText, secureTextEntry, value, onSubmitEditing, returnKeyType, iconImage} = this.props;

        return (
            <View style={{width: '100%', alignItems: 'center'}}>
                <View style={{
                    flexDirection: 'row',
                    borderBottomColor: '#fff',
                    borderBottomWidth: responsiveHeight(0.2),
                    alignItems: 'center',
                    marginBottom: responsiveHeight(1),
                    width: responsiveHeight(42),
                    height:responsiveWidth(13),
                }}>
                    <Image
                        style={styles.loginInputIcon}
                        source={iconImage}/>
                    <TextInput
                        style={styles.loginInput}
                        placeholderTextColor={'#FFFFFF'}
                        placeholder={placeholder}
                        keyboardType={keyboardType}
                        multiline={false}
                        value={value}
                        secureTextEntry={secureTextEntry}
                        onChangeText={(text) => onChangeText(text)}
                        underlineColorAndroid={'transparent'}
                        onSubmitEditing={
                            onSubmitEditing
                        }
                        returnKeyType={returnKeyType}
                    />
                </View>
            </View>
        )
    }
}