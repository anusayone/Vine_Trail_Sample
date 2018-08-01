import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
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
    View, TextInput,
    CameraRoll,
} from "react-native";

import * as Types from "../constants/types";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import {ActionCreators} from "../actions/index";

const styles = StyleSheet.create({
    toolbarView: {
        width: '100%',
        height: 68,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 22.7,
        paddingRight: 22.7,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    toolbarMenuIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain'
    },
    toolbarNotificationIcon: {
        width: 27,
        height: 24,
        resizeMode: 'contain',
        marginRight: 0,
    },
    toolbarNapaIconView: {
        alignItems: 'center',
        flex: 1
    },
    toolbarNapaIcon: {
        width: responsiveWidth(25),
        height: responsiveFontSize(5),
        resizeMode: 'contain',
        marginLeft: responsiveWidth(3)
    },
    contentView: {
        ...StyleSheet.absoluteFillObject,
        marginTop: 68,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonLoginContainerView: {
        borderRadius: responsiveWidth(1.5),
        alignItems: 'center',
        marginBottom: responsiveHeight(3),
        marginTop: responsiveHeight(4),
        backgroundColor: '#fff',
        height: responsiveWidth(14),
        width: responsiveHeight(43),
    },

    buttonLoginTouchableView: {
        width: responsiveHeight(43),
        height: responsiveWidth(14),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});

class ScavengerHuntTryAgainScreen extends Component {
    static navigationOptions = {
    gesturesEnabled: false,
        header: null,
        tabBarLabel: () => (
            <Text style={{fontSize: responsiveFontSize(1.6)}}>Home</Text>
        ),
        tabBarIcon: () => (<View style={{alignItems: 'center', padding: responsiveWidth(2), justifyContent: 'center'}}>
            <Image
                style={{width:responsiveHeight(2.5),height:responsiveHeight(2.5),resizeMode: 'contain'}}
                source={require('../../assets/images/home_icon.png')}
                resizeMode={'contain'}/>
        </View>)
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedTaskDetails: [],
            huntDetails:[]
        }
    }

    onBackPress = () => {
     this.props.navigation.goBack();
        //this.props.navigation.navigate(Types.SCAVENGER_HUNT_VERIFICATION_SCREEN,this.state.selectedTaskDetails);
        return true;
    };

    componentDidMount() {
        console.log(this.props.navigation.state.params.uploadedImage.uri);
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.setState({
            selectedTaskDetails: this.props.navigation.state.params,
            huntDetails: this.props.hunt.huntDetails,
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    render() {
        let selectedTaskDetails = this.props.navigation.state.params;
        return (
            <View style={{
                alignItems: 'center',
                flex: 1,
                flexDirection: 'column',}}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                <View style={{
                     ...StyleSheet.absoluteFillObject,
                    width:'100%',
                }}>
                
                        <Image
                            style={{
                            height:responsiveHeight(100),
                            width:'100%',
                            resizeMode: 'cover',
                            }}
                source={{uri:this.props.navigation.state.params.uploadedImage.uri}}/>
                <Image
                style={{
                    height:responsiveHeight(100),
                    width:'100%',
                    resizeMode: 'cover',
                    position:'absolute'}}
                source={require('../../assets/images/hunt_overlay.png')}/>
                    <View style={styles.toolbarView}>
                        <View style={{
                            alignItems: 'center',
                            position:'absolute',
                            justifyContent:'center',
                            width:responsiveWidth(100),
                            height: 68,
                            backgroundColor: '#252f39',
                            top: 0,
                            left: 0,
                            zIndex: 1,
                            flexDirection: 'row',
                            paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
                                }}>
                            <TouchableOpacity
                                style={{
                            position:'absolute',
                            paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
                            left:0,
                            //borderColor:'#dd0000',borderWidth:2,
                            height: 68,
                            alignItems: 'center',
                            justifyContent:'center',
                            paddingLeft:responsiveWidth(3),
                            paddingRight:responsiveWidth(3)}}
                                onPress={() => {
                                 this.onBackPress()}}>
                                <Image
                                    style={styles.toolbarMenuIcon}
                                    source={require('../../assets/images/back_icon.png')}/>
                            </TouchableOpacity>
                            <Text style={{color: '#fff',
                            fontSize: responsiveFontSize(2.1),
                            fontFamily: 'Roboto-Medium',
                            justifyContent:'center',
                            alignItems: 'center',
                           // position:'absolute',
                            }}>Task {selectedTaskDetails.level} - Not Match</Text>
                        </View>
                    </View>
                    <View style={styles.contentView}>
                        <View style={{
                                   alignItems:'center',
                        }}>
                            <View style={{
                                    alignItems:'center',
                                    height: responsiveHeight(12.5),
                                    width:responsiveWidth(100),
                            }}>
                                <Image
                                    style={{
                                           height: responsiveHeight(12.5),
                                           width:responsiveHeight(12.2),
                                           position:'absolute',
                                           resizeMode: 'cover'
                                    }}
                                    source={require('../../assets/images/scavenger_hunt_try_again_icon.png')}/>
                            </View>
                            <View style={{
                                    marginTop:20,
                                    alignItems:'center',
                                    width:responsiveWidth(100),
                            }}>
                                <Text style={{
                                    fontSize:responsiveFontSize(4),
                                    fontFamily:'Roboto-Bold',
                                    color:'#fff',
                                    textAlign:'center'}}>
                                    You did not make it this time
                                </Text>
                            </View>
                            <View
                                style={{
                                    borderRadius: responsiveWidth(1.5),
                                    alignItems: 'center',
                                    marginBottom: responsiveHeight(3),
                                    marginTop: responsiveHeight(4),
                                    backgroundColor:'#da7c3c',
                                    height: responsiveWidth(14),
                                    width: responsiveHeight(43),
                                }}>
                                <TouchableOpacity
                                    onPress={()=>{
                                            this.props.navigation.navigate(Types.SCAVENGER_HUNT_VERIFICATION_SCREEN,selectedTaskDetails)
                                        }}>
                                    <View
                                        style={styles.buttonLoginTouchableView}>
                                        <Text style={{
                                                color: '#FFF',
                                                fontFamily:'Roboto-Bold',
                                                fontSize: responsiveFontSize(2.5)
                                            }}>{"TRY AGAIN"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text style={{
                                color:'#fff',
                                fontSize:14}}>
                                OR
                            </Text>
                            <View
                                style={styles.buttonLoginContainerView}>
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.props.navigation.navigate(Types.SCAVENGER_HUNT_DETAILS_SCREEN,this.state.huntDetails)
                                        }}>
                                    <View
                                        style={styles.buttonLoginTouchableView}>
                                        <Text style={{
                                                color: '#33376f',
                                                fontFamily:'Roboto-Bold',
                                                fontSize: responsiveFontSize(2.5)
                                            }}>{"TRY OTHER LEVEL"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    bottomnavigator: state.bottomnavigator,
    session: state.session,
    user: state.user,
    hunt:state.hunt
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScavengerHuntTryAgainScreen);
