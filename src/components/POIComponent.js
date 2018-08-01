import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ImageLoad from 'react-native-image-placeholder';
import {
    AsyncStorage,
    BackHandler,
    Image,
    Keyboard,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View, FlatList
} from "react-native";
import * as Types from "../constants/types";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
const styles = StyleSheet.create({
    containerView: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#DDDDDD'
    },
    toolbarView: {
        width: '100%',
        height: 68,
        backgroundColor: '#252f39',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 22.7,
        paddingRight: 22.7
    },
    toolbarMenuIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain'
    },
    toolbarNotificationIcon: {
        width: 16.7,
        height: 16.7,
        resizeMode: 'contain',
        marginRight: 0,
    },
    toolbarFilterIcon: {
        width: 16.7,
        height: 16.7,
        resizeMode: 'contain',
        marginRight: 15,
    },
    toolbarNapaIconView: {
        alignItems: 'center',
        flex: 1
    },
    toolbarNapaIcon: {
        width: 86.7,
        height: 20,
        resizeMode: 'contain',
        marginLeft: 4.7
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        //resizeMode: 'cover',
    },
    contentView: {
        ...StyleSheet.absoluteFillObject,
        //borderColor: '#dd0000', borderWidth: 2,
        marginTop: 68,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});

export default class POIComponent extends React.PureComponent {
    constructor() {
        super();
    }
    componentDidMount() {
           // BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
       // BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        navigator.geolocation.clearWatch(this.watchId);
    }
    render() {
        const {item, distance,onSelectedItem} = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                            onSelectedItem();
                }}>
                <View style={{
                 height:responsiveHeight(27),
                 width:responsiveWidth(92),
                 marginTop:15,
                 marginBottom:15,
                 }}>
                    <ImageLoad
                        style={{
                         height:responsiveHeight(27),
                         width:responsiveWidth(92),
                         position:'absolute',
                         resizeMode: 'cover'
                         }}
                        placeholderStyle={{
                         height:responsiveHeight(27),
                         width:responsiveWidth(92),
                         position:'absolute',
                         resizeMode: 'cover'
                         }}
                        placeholderSource={require('../../assets/images/placeholder_image.png')}
                        source={(item.banner_url==null||item.banner_url=='')
                            ?require('../../assets/images/placeholder_image.png')
                            :{uri:item.banner_url}}
                    />
                    <Image
                        style={{
                         height:responsiveHeight(27),
                         width:responsiveWidth(92),
                         position:'absolute',
                         resizeMode: 'cover'
                         }}
                        source={require('../../assets/images/background.png')}
                    />
                    {/*<View style={{*/}
                        {/*backgroundColor:'#1da1f2',*/}
                        {/*width:60,*/}
                        {/*padding:4,*/}
                        {/*alignItems:'center'}}>*/}
                        {/*<Text style={{*/}
                        {/*fontFamily:'Roboto-Regular',*/}
                        {/*fontSize:10,*/}
                        {/*color:'#fff'}}>{item.poi_offers.length} OFFER</Text>*/}
                    {/*</View>*/}
                    <View style={{
                        width:responsiveWidth(92),
                        //padding:4,
                        position:'absolute',
                        bottom:0,flexDirection:'row',
                        alignItems:'center',
                        //borderColor:'#dd0000',borderWidth:2
                        }}>
                        <View style={{
                             //padding:7
                        }}>
                            <Text style={{
                                  fontFamily:'Roboto-Bold',
                                  fontSize:responsiveFontSize(2.3),
                                  color:'#fff',
                                  paddingBottom:responsiveWidth(4),
                                  paddingLeft:responsiveWidth(4)}}>{item.title}</Text>
                            <Text style={{
                              fontFamily:'Roboto-Bold',
                              fontSize:responsiveFontSize(2.3),
                              color:'#fff',
                              paddingBottom:responsiveWidth(4),
                              paddingLeft:responsiveWidth(4)}}>{distance}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}