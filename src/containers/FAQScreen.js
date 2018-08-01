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
    FlatList, Picker,
    ActivityIndicator,
    NetInfo
} from "react-native";
import LongButton from "../components/LongButton";
import ViewPhotos from "../components/ViewPhotos";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import {ActionCreators} from "../actions/index";
import * as Types from "../constants/types";
import Hyperlink from 'react-native-hyperlink'
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
        marginTop: 68,
        alignItems: 'center',
        backgroundColor: '#fff',
        //borderColor:'#dd0000',borderWidth:2,
        justifyContent: 'center'
    },
    buttonLoginBackgroundImage: {
        height: responsiveWidth(14),
        width: responsiveHeight(43),
        resizeMode: 'contain'
    },
    buttonLoginTouchableView: {
        width: responsiveHeight(43),
        height: responsiveWidth(14),
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
});

class FAQScreen extends Component {
    static navigationOptions = {
        gesturesEnabled: false,
        header: null,
        tabBarLabel: () => (
            <Text style={{fontSize: responsiveFontSize(1.6)}}>Report</Text>
        ),
        tabBarIcon: () => (<View style={{alignItems: 'center', padding: responsiveWidth(2), justifyContent: 'center'}}>
            <Image
                style={{width:responsiveHeight(2.5),height:responsiveHeight(2.5),resizeMode: 'contain'}}
                source={require('../../assets/images/bottom_navigation_report_icon.png')}
                resizeMode={'contain'}/>
        </View>)
    }

    constructor(props) {
        super(props);
        this.state = {
            faq: [],
            question: '',
            netstatus: true,
            errortext: "No internet"
        }
    }

    onBackPress = () => {
        //this.props.navigation.goBack();
        this.props.navigation.navigate(Types.SETTINGS_SCREEN);
        return true;

    };
    getData(){
         this.props.faq().then(() => {
                    this.setState({
                        faq: this.props.misc.faq,
                        // question:this.props.misc.faq["0"].question
                    });
                })
    }
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.getNetinfo();
    }
    getNetinfo(){
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
          this.setState({netstatus: isConnected });
          }
        );
    }
    handleConnectionChange = (isConnected) => {
      //Toast.show("connected");
      if(isConnected)
      {
        this.getData();
        this.setState({netstatus:true});
      }
      else {
        this.setState({netstatus:false});
      this.setState({errortext:"No internet"})
      }
        console.log("is connected:" +isConnected);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    render() {
        return (
(this.state.netstatus)
            ?<View style={{
                  flex: 1,
                  flexDirection: 'column',
                  backgroundColor: '#DDDDDD',
                  }}>
                <Image
                    style={styles.loginBackgroundImage}
                    source={require('../../assets/images/bg_sigup.png')}/>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
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
                     paddingRight:responsiveWidth(3),
                     }}
                    onPress={() => {
                          this.onBackPress()}}>
                    <Image
                        style={{width: 18,
                                 height: 18,
                                 resizeMode: 'contain'}}
                        source={require('../../assets/images/back_icon.png')}/>
                </TouchableOpacity>
                <View style={{alignItems:'center',
                     justifyContent:'center',
                      //borderColor:'#dd0000',borderWidth:2,
                      ...StyleSheet.absoluteFillObject,
                      marginTop: 68,
                     // borderColor:'#dd0000',borderWidth:2,
                      marginBottom:responsiveWidth(10)
                  }}>
                    <View
                        style={{
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 width: responsiveWidth(100),
                                 height: responsiveHeight(14),
                                 //borderColor:'#dd0000',borderWidth:2,
                             }}>
                        <Image
                            style={{
                                  width: responsiveWidth(80),
                                 height: responsiveHeight(14),
                                 resizeMode:'contain',
                                 //borderColor:'#dd0000',borderWidth:2,
                                     }}
                            source={require('../../assets/images/napavalley_logo_image.png')}
                            //resizeMode={'cover'}
                        />
                    </View>
                    <ScrollView
                        bounces={false}
                        style={{
                            //borderColor:'#dd0000',borderWidth:2,
                            backgroundColor:'#fff',
                            borderRadius:responsiveWidth(3),
                            margin:responsiveWidth(5),
                                    }}
                        keyboardShouldPersistTaps='handled'
                        scrollEnabled={true}>
                        <View style={{alignItems:'center',
                        justifyContent:'center',
                        marginTop:responsiveWidth(5)}}>
                            <Text style={{
                                   color: '#000',
                                    fontSize: responsiveFontSize(2.5),
                                     fontFamily: 'Roboto-Regular',
                                     justifyContent:'center',
                                     alignItems: 'center',
                                    }}>FAQ</Text>
                        </View>
                        {
                            (this.state.faq.length > 0)
                                ? this.state.faq.map((item) => {
                                    return (
                                        <View style={{
                                    margin:responsiveWidth(5)
                                   }}>

                                            <Text style={{color:'#e57e39',
                                                     fontSize:responsiveFontSize(2),
                                                     //borderColor:'#DD0000',borderWidth:1,
                                                     textAlign:'left',
                                                     fontFamily:'Roboto-Regular',
                                                     marginBottom:responsiveWidth(1)
                                                    }}>
                                                {item.question}
                                            </Text>
                                            <Hyperlink onPress={(url, text) =>{
                                                  }
                                                 // alert(url + ", " + text)
                                                  }
                                                       linkStyle={{
                                                           color: '#1E90FF',
                                                           fontSize: responsiveFontSize(1.7)
                                                       }}
                                                       linkDefault={ true }>
                                                <Text style={{color:'#333333',
                                                     fontSize:responsiveFontSize(1.7),
                                                    // borderColor:'#DD0000',borderWidth:1,
                                                     textAlign:'left',
                                                     fontFamily:'Roboto-Regular',
                                                    // margin:responsiveWidth(5)
                                                    }}>
                                                    {item.answer}
                                                </Text>
                                            </Hyperlink>
                                        </View>
                                    );
                                })
                                :
                                <View style={{
                                           backgroundColor:'transparent',
                                           width:responsiveWidth(90),
                                           alignItems:'center',
                                           justifyContent:'center',
                                     }}>
                                    <ActivityIndicator size="large" color='#000'/>
                                </View>
                        }
                    </ScrollView>
                </View>
            </View>
            :<View style={{ ...StyleSheet.absoluteFillObject,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flex: 1,
                                                    flexDirection: 'column',
                                                    backgroundColor: '#DDDDDD'
                                                    }}>
                           <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                           <View style={{ width: '100%',
                             height: 68,
                             backgroundColor: '#252f39',
                             position: 'absolute',
                             top: 0,
                             left: 0,
                             zIndex: 1,
                             flexDirection: 'row',
                             paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
                             alignItems: 'center',
                             justifyContent: 'center',
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
                                                 style={{width: 18,
                                                         height: 18,
                                                         resizeMode: 'contain'}}
                                                 source={require('../../assets/images/back_icon.png')}/>
                                         </TouchableOpacity>

                                         <Text style={{color: '#fff',
                                         fontSize: responsiveFontSize(2.1),
                                         fontFamily: 'Roboto-Medium',
                                         justifyContent:'center',
                                         alignItems: 'center',
                                        // position:'absolute',
                                         }}>FAQ</Text>

                                                   </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                          this.getData();
                                            }}>

                                        <Text>
                                            {this.state.errortext}
                                        </Text>

                                    </TouchableOpacity>
                                </View>
        )
    }
}

const mapStateToProps = (state) => ({
    bottomnavigator: state.bottomnavigator,
    session: state.session,
    user: state.user,
    misc: state.misc
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FAQScreen);
