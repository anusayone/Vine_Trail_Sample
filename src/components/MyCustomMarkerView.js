import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
const styles = StyleSheet.create({});

export default class MyCustomMarkerView extends React.PureComponent {
    constructor() {
        super();
    }

    render() {
        const {image} = this.props;
        console.log(image);
        return (
            <View style={{borderColor:'#dd0000',borderWidth:2,
                width:40,
                height:40,
                }}>
                <Image
                    style={{
                        width:20,
                        height:20,
                        }}
                    source={require('../../assets/images/napavalley_logo_image.png')}
                    resizeMode={'contain'}/>
                {/*<Image*/}
                {/*style={{*/}
                {/*width:40,*/}
                {/*height:40,*/}
                {/*resizeMode: 'contain'*/}
                {/*}}*/}
                {/*source={require('../../assets/images/map_pointer_info_clock_icon.png')}*/}
                {/*//source={{uri:image}}*/}
                {/*/>*/}
            </View>
        )
    }
}