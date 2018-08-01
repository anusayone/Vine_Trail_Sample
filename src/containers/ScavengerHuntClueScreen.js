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
    View
} from "react-native";
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
import LongButton from "../components/LongButton";
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
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contentView: {
        ...StyleSheet.absoluteFillObject,
        marginTop: 68,
        alignItems: 'center',
        justifyContent: 'center'
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});

class ScavengerHuntClueScreen extends Component {
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
            hint: {},
            huntDetails: [],
            selectedTaskDetails: []
        }
    }

    onBackPress = () => {
     //this.props.navigation.goBack();
        this.props.navigation.navigate(Types.SCAVENGER_HUNT_DETAILS_SCREEN,this.state.huntDetails.id);
        return true;
    };

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.setState({
            huntDetails: this.props.hunt.huntDetails,
            selectedTaskDetails: this.props.navigation.state.params
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    render() {
        let selectedTaskDetails = this.props.navigation.state.params;
        let hint = this.props.navigation.state.params.hint;
        return (
            <View style={styles.containerView}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
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
                            }}>Task {selectedTaskDetails.level} - Clue</Text>
                    </View>

                </View>
                <View style={styles.contentView}>
                    <ScrollView
                        bounces={false}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps='handled'
                    >
                    <View style={{
                        width:responsiveWidth(100),
                        //height:responsiveHeight(72),
                        alignItems: 'center',
                        //borderColor:'#dd0000',borderWidth:2
                    }}>
                        <View style={{
                            height: responsiveWidth(38),
                            width:responsiveWidth(38),
                            marginTop:responsiveWidth(5)
                           // borderColor:'#dd0000',borderWidth:2
                        }}>
                            <Image
                                style={{
                                        height: responsiveWidth(38),
                                        width:responsiveWidth(38),
                                        position:'absolute',
                                        resizeMode: 'cover'
                                        }}
                                source={require('../../assets/images/scavenger_hunt_clue_icon.png')}/>
                        </View>
                        <View style={{
                            alignItems:'center',
                            flex:1,
                        }}>
                            <View style={{
                                marginTop:responsiveWidth(5),
                                height: responsiveHeight(3),
                                width:responsiveWidth(90),
                                alignItems:'center',
                               // borderColor:'#dd0000',borderWidth:2
                            }}>
                                <Image
                                    style={{
                                       height: responsiveHeight(3),
                                        width:responsiveWidth(10),
                                        position:'absolute',
                                        resizeMode: 'cover'
                                        }}
                                    source={require('../../assets/images/scavenger_clue_arrow_white_up.png')}/>
                            </View>
                            <View style={{
                                width:responsiveWidth(90),
                                backgroundColor:'#fff',
                                alignItems:'center',
                                justifyContent:'center',
                                paddingTop:40,
                                paddingBottom:40,
                                paddingRight:20,
                                paddingLeft:20,
                                marginTop:-2,
                                //borderColor:'#dd0000',borderWidth:2
                            }}>
                                <Text style={{
                                    fontSize:responsiveFontSize(1.8),
                                    textAlign:'center',
                                    lineHeight:25,
                                    color:'#1c232b',
                                    fontFamily:'Roboto-Regular'}}>
                                    {hint}
                                </Text>
                            </View>

                            <View style={{
                                width:responsiveWidth(100),
                                alignItems:'center',
                                marginTop:responsiveHeight(5)
                            }}>
                                <LongButton
                                    onPress={() => {
                                        this.props.navigation.navigate(Types.SCAVENGER_HUNT_VERIFICATION_SCREEN,selectedTaskDetails)
                                    }}
                                    title={'I FOUND IT !'}/>
                            </View>
                        </View>
                    </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    session: state.session,
    user: state.user,
    explore: state.explore,
    hunt: state.hunt
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScavengerHuntClueScreen);
