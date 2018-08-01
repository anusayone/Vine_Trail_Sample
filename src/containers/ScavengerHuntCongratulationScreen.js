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
    CameraRoll
} from "react-native";
import ButtonLogin from "../components/ButtonLogin";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import {ActionCreators} from "../actions/index";
import * as Types from "../constants/types";
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
        // borderColor: '#dd0000', borderWidth: 2,
        marginTop: 68,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

class ScavengerHuntCongratulationScreen extends Component {
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
                resizeMode: 'cover',position:'absolute'}}
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
                            }}>Task {selectedTaskDetails.level} - Verified</Text>
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
                                           height: responsiveHeight(15),
                                           width:responsiveHeight(15),
                                           position:'absolute',
                                           resizeMode: 'cover'
                                                }}
                                    source={require('../../assets/images/scavenger-hunt-award.png')}/>
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
                                    Congratulations
                                </Text>
                                <Text style={{
                                    marginTop:5,
                                    fontSize:responsiveFontSize(3),
                                    fontFamily:'Roboto-Regular',
                                    color:'#fff',
                                    textAlign:'center'}}>
                                    You won the task
                                </Text>
                            </View>
                            <View style={{
                                width:responsiveWidth(100),
                                alignItems:'center',
                                marginTop:30,
                                marginBottom:20
                            }}>
                                <ButtonLogin
                                    onPress={() => {
                                        this.props.navigation.navigate(Types.SCAVENGER_HUNT_DETAILS_SCREEN,this.state.huntDetails)
                                    }}
                                    title={'TRY NEXT LEVEL'}
                                />
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

export default connect(mapStateToProps, mapDispatchToProps)(ScavengerHuntCongratulationScreen);
