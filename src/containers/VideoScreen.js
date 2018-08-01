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
    TouchableHighlight,
    NetInfo
} from "react-native";
import {ActionCreators} from "../actions/index";
import {PermissionsAndroid} from 'react-native';
import * as Types from "../constants/types";
import {responsiveHeight, responsiveFontSize, responsiveWidth} from "../helpers/Responsive";
import Toast from "react-native-simple-toast";

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
        marginTop: 68,
        alignItems: 'center',
        backgroundColor: '#fff',
        // borderColor: '#dd0000', borderWidth: 2
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        flex: 1,
        flexBasis: '10%'
    },
    header: {
        flexGrow: 1
    },
    buttonGroup: {
        flexGrow: 1
    },
    slider: {
        flexGrow: 1
    },
    button: {
        backgroundColor: '#dbdcdb',
        padding: 10,
        marginRight: 4,
        borderRadius: 4,
        borderBottomColor: '#7b7b7b',
        borderBottomWidth: 5
    },
    buttonText: {
        color: '#404040'
    },
    center: {
        marginTop: 30,
        marginBottom: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    headerTop: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    userPic: {
        height: 20,
        width: 20,
        borderRadius: 10,
        marginRight: 10
    },
    userName: {
        fontSize: 20
    }
});

class VideoScreen extends Component {
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
            videos: [],
            columns: 2,
            netstatus: true,
            errortext: "No internet"
        }
    }

    onBackPress = () => {
        this.props.navigation.navigate(Types.DASHBOARD);
        // this.props.navigation.navigate(Types.DASHBOARD);
        return true;
    };
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
       let renderedData = [];
               this.props.getVideos().then(() => {
                   this.setState({
                       videos: this.props.misc.videos.results
                   });
               })
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
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.getNetinfo();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        navigator.geolocation.clearWatch(this.watchId);
    }

    render() {
        return (
        (this.state.netstatus)?
            <View style={styles.containerView}>
                <StatusBar translucent={true}
                           backgroundColor={'rgba(0,0,0,0.4)'}
                           barStyle={'light-content'}/>
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
                <View style={styles.contentView}>
                    {
                        (this.state.videos.length > 0)
                            ? <FlatList
                                data={this.state.videos}
                                renderItem={({item,index}) =>{
                            return(
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate(Types.PLAY_VIDEO_SCREEN,item);
                                    }}>
                                    <View style={{
                                        width:responsiveWidth(100),
                                        height:responsiveHeight(30),
                                        //borderColor:'#dd0000',borderWidth:2
                                    }}>
                                        <Image
                                            style={{
                                                width:responsiveWidth(100),
                                                height:responsiveHeight(30),
                                            }}
                                            source={{uri:item.thumbnail}}/>
                                        <View style={{
                                            bottom:responsiveWidth(0),
                                            position:'absolute',
                                            width:responsiveWidth(100),
                                            //borderColor:'#dd0000',borderWidth:2,
                                            }}>
                                            <Image
                                            style={{
                                               bottom:responsiveWidth(0),
                                            position:'absolute',
                                            }}
                                            source={require('../../assets/images/background.png')}/>
                                        <Text style={{
                                            color:'#fff',
                                            marginLeft:responsiveWidth(5),
                                            marginRight:responsiveWidth(5),
                                            fontSize:responsiveFontSize(2),
                                            fontFamily:'Roboto-Bold',
                                            //borderColor:'#dd0000',borderWidth:2,
                                            paddingBottom:responsiveWidth(5),
                                            paddingTop:responsiveWidth(5)
                                            // color:'#0000',
                                        }}>{item.title}</Text>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            ) }}
                                //keyExtractor={(item, index) => item.id.toString()}
                                onEndReached={()=>{
                            // this.fetchMoreRestaurants();
                        }}
                                onEndReachedThreshold={0.6}
                            />
                            : <View style={{
                                backgroundColor:'transparent',
                                width:responsiveWidth(90),
                                height:responsiveHeight(90),
                                alignItems:'center',
                                justifyContent:'center',
                        }}>
                                <ActivityIndicator size="large" color='#000'/>
                            </View>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoScreen);