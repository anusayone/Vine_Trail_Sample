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
    View, FlatList,
    Switch,
    ProgressBarAndroid,
    ActivityIndicator,
    Slider,
    WebView,
NetInfo

} from "react-native";
import Video from "react-native-video";
//import Video from 'react-native-af-video-player'
import {BASE_PATH, TRAIL_TOUR_SWITCH, TRAIL_TOUR_LIST} from "../constants/common";
import * as Progress from 'react-native-progress';
import {ActionCreators} from "../actions/index";
import {PermissionsAndroid} from 'react-native';
import * as Types from "../constants/types";
import Toast from "react-native-simple-toast";
import {responsiveHeight, responsiveFontSize, responsiveWidth} from "../helpers/Responsive";
//import Orientation from 'react-native-orientation';
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
        paddingLeft: responsiveWidth(4),
        paddingRight: responsiveWidth(4)
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
        // borderColor: '#dd0000', borderWidth: 2
    },
    toolbarNapaIconView: {
        flex: 1
    },
    toolbarNapaIcon: {
        width: responsiveWidth(25),
        height: responsiveFontSize(5),
        resizeMode: 'contain',
        //marginLeft: responsiveWidth(4)
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        //resizeMode: 'cover',
    },
    contentView: {
        ...StyleSheet.absoluteFillObject,
        // marginTop: (!this.state.hideHeader)?68:0,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent:'center',
        borderColor: '#dd0000', borderWidth: 2
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});
navigationOptions = {
    tabBarVisible: false,
}
class PlayVideoScreen extends Component {
    static navigationOptions = {
        gesturesEnabled: false,
        header: null,
        tabBarLabel: () => (
            <Text style={{fontSize: responsiveFontSize(1.6)}}>Home</Text>
        ),
        tabBarIcon: () => (<View style={{alignItems: 'center', padding: responsiveWidth(2), justifyContent: 'center',
        }}>
            <Image
                style={{width:responsiveHeight(2.5),height:responsiveHeight(2.5),resizeMode: 'contain'}}
                source={require('../../assets/images/home_icon.png')}
                resizeMode={'contain'}/>
        </View>)
    };

    constructor(props) {
        super(props);
        this.currentLatitude = '';
        this.currentLongitude = '';
        this.state = {
            locationError: null,
            locationTimeOut: 1000 * 60 * 60,
            showActivityIndicator: false,
            video: [],
            paused:true,
            SliderValue :  0.0,
            duration: 0.0,
            currentTime: 0.0,
            rotate:false,
            videourl:"",
            hideHeader:false
        }
        // video: Video;
    }

    renderAcitivityIndicator() {
        if (this.state.showActivityIndicator) {
            return (
                <View style={{
                    backgroundColor:'transparent',
                    width:responsiveWidth(90),
                    height:responsiveHeight(90),
                    alignItems:'center',
                    justifyContent:'center',
                    position:'absolute'
                }}>
                    <ActivityIndicator size="large" color="#000"/>
                </View>
            );
        }
    }

    onBackPress = () => {
        //  this.props.navigation.navigate(Types.DASHBOARD);
        //  // this.props.navigation.navigate(Types.DASHBOARD);
        // if(this.state.hideHeader){
        //     this.setState({hideHeader:false});
        //     Orientation.lockToPortrait()
        // }
        // else {
        //
        this.props.navigation.goBack();
        //
        // }
        return true;
    };
    rotateOnOff = (value) => {
        this.setState({rotate:value})

    };
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.getNetinfo();
    }
   getNetinfo() {
               NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
               NetInfo.isConnected.fetch().done(
                   (isConnected) => {
                   if (isConnected) {
                       this.getData();
                       this.setState({netstatus: true});
                   }
                   else {
                       this.setState({netstatus: false});
                       this.setState({errortext: "No internet"})
                   }
                       this.setState({netstatus: isConnected});
                   }
               );
           }
   getData(){
      video=this.props.navigation.state.params;
              this.setState({
                  videourl: video.video_url
              });
   }
   handleConnectionChange = (isConnected) => {
                   //Toast.show("connected");
                   if (isConnected) {
                       this.getData();
                       this.setState({netstatus: true});
                   }
                   else {
                       this.setState({netstatus: false});
                       this.setState({errortext: "No internet"})
                   }
                   console.log("is connected:" + isConnected);
               }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        navigator.geolocation.clearWatch(this.watchId);
    }

    playPause = (item) => {
        this.setState({paused: !this.state.paused})
    }

    onLoad = (data) => {
        this.setState({duration: data.duration});
        //Toast.show(data.duration+"");
    };
    onProgress = (data) => {
        this.setState({currentTime: data.currentTime});

        this.setState({SliderValue: this.getCurrentTimePercentage()})
    };
    getCurrentTimePercentage = () => {
        if (this.state.currentTime > 0) {
            return ( parseFloat(this.state.currentTime) / parseFloat(this.state.duration) * 100);
        }
        return 0;
    };

    render() {
        return (
        (this.state.netstatus)?
            <View style={styles.containerView}>
                {(!this.state.hideHeader)?
                    <StatusBar translucent={true}
                               backgroundColor={'rgba(0,0,0,0.4)'}
                               barStyle={'light-content'}/>
                    :null
                }
                {(!this.state.hideHeader)?
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
                            }}>Video</Text>
                        </View>
                    </View>
                    :null
                }

                <View style={{
                    ...StyleSheet.absoluteFillObject,
                    marginTop: (!this.state.hideHeader)?68:0,
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    justifyContent:'center',
                    //borderColor: '#dd0000', borderWidth: 2
                }}>
                    <View
                        style={{
                            width:responsiveWidth(100),
                            //height:responsiveHeight(30),
                            position:'absolute',
                            //borderColor:"#dd0000",borderWidth:2,
                            //bottom:0,
                            backgroundColor:"#fff",
                            // borderColor:"#949494",borderWidth:2,
                        }}>
                        <WebView
                            source={{uri: this.state.videourl}}
                            style={{height:responsiveHeight(100),width:responsiveWidth(100)}}
                        />
                    </View>
                </View>
            </View>
            :<View style={styles.containerView}>
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
                                                   }}>Videos</Text>
                                           </View>
                                           </View>
                                               <View style={{
                                               alignItems:"center",
                                               width:responsiveWidth(100),
                                               height:responsiveHeight(100),
                                              // borderWidth:2,borderColor:'#dd0000',
                                               justifyContent:'center'
                                               }}>
                                                   <TouchableOpacity
                                                       onPress={() => {
                                                       if(this.state.netstatus){
                                                          this.getData()
                                                       }else{
                                                       Toast.show("Turn on Mobile data")
                                                       }

                                                     }}>
                                                       <Text>
                                                           {this.state.errortext}
                                                       </Text>
                                                   </TouchableOpacity>
                                               </View>
                                           </View>
        )
    }
}

const mapStateToProps = (state) => ({
    session: state.session,
    user: state.user,
    misc: state.misc
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayVideoScreen);