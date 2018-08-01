import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
const styles = StyleSheet.create({

});
export default class LongButton extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            active: false
        }
    }

    render() {
        const {onPress, title, disabled} = this.props;
        return (
            <TouchableOpacity
                onPress={onPress}
            >
            <View style={{
                                backgroundColor: '#da7c3c',
                                padding: 10,
                                width:responsiveWidth(90),
                                height:responsiveHeight(6),
                                borderRadius: 5,
                                flexDirection: 'row',
                                alignItems:'center',
                                justifyContent:'center'
                            }}>
                <Text style={{
                                    fontSize: 15,
                                    color: '#fff',
                                    textAlign: 'center',
                                    fontFamily:'Roboto-Regular'
                                }}>{title}</Text>
            </View>
            </TouchableOpacity>
        )
    }
}