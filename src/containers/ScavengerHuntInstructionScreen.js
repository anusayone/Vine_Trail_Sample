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
    View,
    FlatList
} from "react-native";
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import LongButton from "../components/LongButton";
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
        //resizeMode: 'cover',
    },
    contentView: {
        ...StyleSheet.absoluteFillObject,
        // borderColor: '#dd0000', borderWidth: 2,
        marginTop: 68,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }

});

class ScavengerHuntInstructionScreen extends Component {
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
            huntDetails: [],
            isHuntDetailsAvailable: false
        }
    }

    onBackPress = () => {
        this.props.navigation.navigate(Types.SCAVENGER_HUNT);
        return true;
    };

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        let id = this.props.navigation.state.params.id;
        this.props.getHuntDetails(id).then(() => {
            this.setState({
                huntDetails: this.props.hunt.huntDetails,
                isHuntDetailsAvailable: true
            });
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    render() {
        let selectedHunt = this.props.hunt.huntDetails;
        let welcomeText = String(this.props.hunt.huntDetails.welcome_text);
        let welcomeTextArray = welcomeText.split('\r\n\r\n');
        welcomeTextArray.splice(welcomeTextArray.length - 1, 1);
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
                            }}>Instructions</Text>
                    </View>
                </View>
                <View style={styles.contentView}>
                    {
                        (this.state.isHuntDetailsAvailable)
                            ? <View style={{
                                alignItems:'center',
                                height:responsiveHeight(65),
                                width:responsiveWidth(100)}}>
                                <View style={{
                                    alignItems:'center',
                                    height:responsiveHeight(18),
                                    width:responsiveWidth(100)
                                }}>
                                    <Image
                                        style={{
                                           height: responsiveHeight(18),
                                           width:responsiveHeight(18),
                                           position:'absolute',
                                           resizeMode: 'cover'
                                        }}
                                        source={require('../../assets/images/scavenger_hunt_instruction_icon.png')}/>
                                </View>
                                <View style={{
                                    marginTop:responsiveHeight(7.5),
                                    marginBottom:responsiveHeight(7.5),
                                    width:responsiveWidth(90)
                                }}>
                                    <FlatList
                                        data={welcomeTextArray}
                                        renderItem={({item,index}) =>
                                             <View style={{
                                                    flexDirection:'row',
                                                    marginTop:10,
                                                    alignItems:'center',}}>
                                                <View style={{
                                                            height:10,
                                                            width:10,
                                                        }}>
                                                            <Image
                                                                style={{
                                                                    height: 10,
                                                                    width:10,
                                                                    position:'absolute',
                                                                    resizeMode: 'cover'
                                                                }}
                                                                source={require('../../assets/images/scavenger_hunt_arrow_icons.png')}/>
                                                        </View>
                                                <View style={{
                                                          alignItems:'center',
                                                          paddingLeft:responsiveHeight(1.7),
                                                          }}>
                                                          <Text style={{
                                                                fontFamily:'Roboto-Regular',
                                                                fontSize:responsiveFontSize(1.9),
                                                                color:'#252f39'
                                                                }}>
                                                                {welcomeTextArray[index]}
                                                          </Text>
                                                </View>
                                             </View>
                                        }
                                        keyExtractor={(item, index) => index.toString()}>
                                    </FlatList>
                                </View>
                                <View style={{
                                        flexDirection:'row',
                                        alignItems:'center',justifyContent:'center',
                                        width:responsiveWidth(90)
                                    }}>
                                    <View style={{
                                        justifyContent:'center',
                                        height: responsiveHeight(6.5),
                                        width:responsiveHeight(6.5),}}>
                                        <Image
                                            style={{
                                               height: responsiveHeight(6.5),
                                               width:responsiveHeight(6.5),
                                               resizeMode: 'contain'
                                            }}
                                            source={require('../../assets/images/scavenger_hunt_like_icon.png')}/>
                                    </View>
                                    <View >
                                        <Text style={{color:'#3c92ca',
                                            fontFamily:'Roboto-Medium',
                                            fontSize:responsiveFontSize(3)}}>GOOD LUCK!</Text>
                                    </View>
                                </View>
                                <View style={{
                                    marginTop:responsiveHeight(5)}}>
                                    <LongButton
                                        onPress={() => {
                                            this.props.navigation.navigate(Types.SCAVENGER_HUNT_DETAILS_SCREEN,selectedHunt)
                                        }}
                                        title={'LET'+"'"+'S START THE HUNT'}
                                    />
                                </View>
                            </View>
                            : null
                    }
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    bottomnavigator: state.bottomnavigator,
    session: state.session,
    user: state.user,
    hunt: state.hunt
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScavengerHuntInstructionScreen);
