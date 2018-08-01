import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    AsyncStorage,
    BackHandler,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Keyboard,
    Switch,
    NetInfo
} from "react-native";
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import GoogleSignIn from "react-native-google-sign-in";
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import Toast from "react-native-simple-toast";
import ImagePicker from 'react-native-image-picker';
const FBSDK = require('react-native-fbsdk');
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
        resizeMode: 'contain',
        marginTop:responsiveHeight(6),
        marginLeft:responsiveWidth(5),
        position:'absolute'
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
        resizeMode: 'cover',
    },
    contentView: {
        ...StyleSheet.absoluteFillObject,
        marginTop: 68,
        backgroundColor: '#fff'
    },
    dashboardGridRow: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingRight: responsiveWidth(4),
        marginTop: responsiveWidth(4),
    },
    dashboardGridColumn: {
        shadowColor: '#e9e9e9',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 1.3,
        flex: 1,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        borderRadius: 5,
        marginLeft: responsiveWidth(4.2),
        borderWidth: responsiveWidth(0.5), borderColor: '#e9e9e9'
    },
    dashboardItemImage: {
        width: responsiveWidth(11),
        height: responsiveWidth(11),
        resizeMode: 'contain'
    },
    dashboardItemText: {
        fontFamily: "Roboto-Regular",
        fontSize: responsiveFontSize(1.7),
        marginTop: responsiveWidth(2),
        textAlign: "center",
        color: "#949494",
    },
    drawerContainer: {
        width: responsiveWidth(100),
        height: '100%',
        backgroundColor: '#252f39',
        position: 'absolute',
    },
    headerContainer: {
        width: responsiveWidth(100),
        height: responsiveWidth(40),
        flexDirection: 'column',
        //alignItems: 'center',
        // justifyContent: 'center',
    },
    headerImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: responsiveWidth(100),
        height: responsiveWidth(25)
    },
    headerProfilePic: {
        width: responsiveWidth(32),
        height: responsiveWidth(35),
        borderRadius:responsiveWidth(20)
        //marginTop: responsiveHeight(4),
    },
    headerTitle: {
        fontFamily: "Roboto-Bold",
        fontSize: responsiveFontSize(3.3),
        textAlign: "center",
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.42)',
        textShadowOffset: {
            width: 0.3,
            height: 0
        },
        textShadowRadius: 0.7,
        marginBottom: responsiveHeight(1),
        width:responsiveWidth(70),
        // /marginTop: responsiveHeight(2)
        //borderColor:'#dd0000',borderWidth:2
    },
    headerDescription: {
        fontFamily: "Roboto-Light",
        fontSize: responsiveFontSize(2.3),
        textAlign: "center",
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.42)',
        textShadowOffset: {
            width: 0.3,
            height: 0
        },
        width:responsiveWidth(70),
        textShadowRadius: 0.7,
        marginBottom: 5
    },
    itemsContainer: {
        flexDirection: 'column',
        width: responsiveWidth(100),
        //flex: 1,
        // borderWidth:2,borderColor:'#dd0000',
        alignItems:'center',
        justifyContent:'center'
    },
    item: {
        flexDirection: 'row',
        width: responsiveWidth(100),
        height: responsiveHeight(9),
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    itemIcon: {
        width: 16,
        height: 16,
        margin: 17,
        resizeMode: 'contain',

    },
    itemArrowIcon: {
        width: 16,
        height: 16,
        margin: 17,
        resizeMode: 'contain',
        position: 'absolute',
        right: 0

    },
    itemText: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        textAlign: "left",
        color: "#ffffff"
    },
    buttonItemText: {
        fontFamily: "Roboto-Bold",
        fontSize: 16,
        textAlign: "center",
        color: "#ffffff"
    },
    buttonItemIcon: {
        width: 16,
        height: 16,
        margin: 10,
        resizeMode: 'contain',
    },
    buttonLogout: {
        flexDirection: 'row',
        width: responsiveWidth(80),
        height: responsiveWidth(14),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fe8e42',
        marginTop:responsiveHeight(5)
    },
});
var options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
const {
    LoginManager,
    AccessToken
} = FBSDK;
class SettingsScreen extends Component {
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
    uploadImage() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};
                this.setState({
                    imageUri: response.uri,
                    avatarSource: source
                });
            }
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            isSideDrawerOpen: false,
            currentLatitude: null,
            currentLongitude: null,
            locationError: null,
            notificationSwitch:true,
            locationTimeOut: 1000 * 60 * 60,
            netstatus:true,
            errortext:"No internet",
        }
    }

    onBackPress = () => {
        this.props.navigation.navigate('BottomNavigator');
        // this.props.navigation.navigate(Types.DASHBOARD);
        //this.props.navigation.goBack();
        return true;
    };
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        AsyncStorage.getItem("notificationOn", (err, result) => {
            if(result){
                console.log(result)
                console.log("'notificationOn')===true");
                if(result=='true'){
                    this.setState({notificationSwitch:true});
                }else{
                    this.setState({notificationSwitch:false})
                }
            }else{
                console.log("error");
                //this.setState({notificationSwitch:result})
            }
        });

        Keyboard.dismiss();
        this.getNetinfo();
    }
    getNetinfo(){
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({ netstatus: isConnected }); }
        );
    }
    handleConnectionChange = (isConnected) => {
      //Toast.show("connected");
      if(isConnected)
      {
        //this.getData();
        this.setState({netstatus:true});
      }
      else {
        this.setState({netstatus:false});
      this.setState({errortext:"No internet"})
      }
        console.log("is connected:" +isConnected);
    }
    componentWillMount() {
        navigator.geolocation.clearWatch(this.watchId);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    logout() {
    if(this.state.netstatus){
    BackgroundGeolocation.stop();
            this.props.logout();
            LoginManager.logOut();
            GoogleSignIn.signOutPromise();
            this.props.navigation.navigate('LOGIN_SCREEN');
    }else{
    Toast.show("No Internet");
    }

    }

    notificationSwitch(value){
     if(this.state.netstatus){
        BackgroundGeolocation.stop();
        if(value){
            BackgroundGeolocation.start();
        }else{
            BackgroundGeolocation.stop();
        }
        AsyncStorage.setItem('notificationOn',value.toString());
        this.setState({notificationSwitch:value})
    }else{
         Toast.show("No Internet");
         }
         }
    render() {
       let user=this.props.session.user;
        // console.log(this.state.avatarSource);
        return (
            (user)?
                <View style={styles.drawerContainer}>
                    <View style={styles.headerContainer}>
                        <Image
                            style={{ position: 'absolute',
                                top: 0,
                                left: 0,
                                width: responsiveWidth(100),
                                height: responsiveWidth(40)}}
                            blurRadius={5}
                            source={require('../../assets/images/side_drawer_header_background.png')}/>

                        <View style={{
                            alignItems:'center',
                            justifyContent:'center',
                            //borderWidth:2,borderColor:'#dd0000',
                            width: responsiveWidth(100),
                            height: responsiveWidth(40),
                            position:'absolute',
                            //marginTop:responsiveHeight(5)
                        }}>
                            {/*<View style={{*/}
                            {/*width: responsiveWidth(32),*/}
                            {/*height: responsiveWidth(35),*/}
                            {/*//marginTop: responsiveHeight(4),*/}
                            {/*//borderWidth:2,borderColor:'#dd0000',*/}
                            {/*borderRadius:responsiveWidth(20),*/}

                            {/*}}>*/}
                            {/*<Image*/}
                            {/*style={styles.headerProfilePic}*/}
                            {/*//source={this.state.avatarSource}source={(this.state.avatarSource)?this.state.avatarSource:require('../../assets/images/temp_profile_pic.png')}*/}
                            {/*source={(this.state.avatarSource)?this.state.avatarSource:require('../../assets/images/temp_profile_pic.png')}*/}
                            {/*//source={require('../../assets/images/temp_profile_pic.png')}*/}
                            {/*/>*/}
                            {/*</View>*/}
                            {/*<View style={{*/}
                            {/*height:responsiveHeight(4.6),*/}
                            {/*marginTop:-responsiveHeight(4),*/}
                            {/*//borderWidth:2,borderColor:'#DD0000',*/}
                            {/*marginLeft:responsiveWidth(18)*/}
                            {/*}}>*/}
                            {/*<View style={{*/}
                            {/*height:responsiveHeight(4.5),*/}
                            {/*}}>*/}
                            {/*<TouchableOpacity*/}
                            {/*onPress={()=>{*/}
                            {/*this.uploadImage();*/}
                            {/*}}>*/}
                            {/*<Image*/}
                            {/*style={{*/}
                            {/*height:responsiveHeight(4.5),*/}
                            {/*width:responsiveHeight(4.5),*/}
                            {/*resizeMode: 'contain',*/}
                            {/*}}*/}
                            {/*source={require('../../assets/images/setting_page_upload_image.png')}/>*/}
                            {/*</TouchableOpacity>*/}
                            {/*</View>*/}
                            {/*</View>*/}
                            <Text
                                style={styles.headerTitle}
                                ellipsizeMode='tail'
                                numberOfLines={1}
                            >{user.username}</Text>
                            <Text
                                style={styles.headerDescription}
                                ellipsizeMode='tail'
                                numberOfLines={1}
                            >{user.name}</Text>
                        </View>
                    </View>
                    <View style={styles.itemsContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate(Types.TERMS_AND_CONDITION_SCREEN);
                            }}>
                            <View style={styles.item}>
                                <Image
                                    source={require('../../assets/images/settings_page_terms_and_conditions_icon.png')}
                                    style={styles.itemIcon}/>
                                <Text style={styles.itemText}>Terms and Conditions</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                              //  Toast.show('Under Development ;-)')
                            }}>
                            <View style={styles.item}>
                                <Image
                                    source={require('../../assets/images/settings_page_custom_notifications.png')}
                                    style={styles.itemIcon}/>
                                <Text style={styles.itemText}>Enable/Disable Push Notifications</Text>
                                <View style={{
                                    position:'absolute',
                                    right:responsiveWidth(0)}}>
                                    <Switch
                                        style={{marginRight:responsiveWidth(5)}}
                                        onValueChange={(value) => {
                                            this.notificationSwitch(value)
                                        }}
                                        onTintColor={'#fff'}
                                        tintColor={'#949494'}
                                        thumbTintColor={'#000'}
                                        value = {this.state.notificationSwitch}
                                    />
                                </View>
                                {/*<Image*/}
                                {/*source={require('../../assets/images/side_drawer_arrow_icon.png')}*/}
                                {/*style={styles.itemArrowIcon}/>*/}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate(Types.ABOUT_US_SCREEN);
                            }}>
                            <View style={styles.item}>
                                <Image
                                    source={require('../../assets/images/settings_page_about_us_icon.png')}
                                    style={styles.itemIcon}/>
                                <Text style={styles.itemText}>About Us</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate(Types.HELP_SCREEN);
                            }}>
                            <View style={styles.item}>
                                <Image
                                    source={require('../../assets/images/settings_page_help_icon.png')}
                                    style={styles.itemIcon}/>
                                <Text style={styles.itemText}>Help</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate(Types.FAQ_SCREEN);
                            }}>
                            <View style={styles.item}>
                                <Image
                                    source={require('../../assets/images/settings_page_faq_icon.png')}
                                    style={styles.itemIcon}/>
                                <Text style={styles.itemText}>FAQ</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate(Types.DASHBOARD);
                            }}>
                            <View style={styles.item}>
                                <Image
                                    source={require('../../assets/images/settings_page_dashboard_icon.png')}
                                    style={styles.itemIcon}/>
                                <Text style={styles.itemText}>Home</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity
                            onPress={() => {
                                this.logout();
                            }}>
                            <View style={styles.buttonLogout}>
                                <Image
                                    source={require('../../assets/images/logout.png')}
                                    style={styles.buttonItemIcon}/>
                                <Text style={styles.buttonItemText}>LOGOUT</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                :null
        )
    }
}

const mapStateToProps = (state) => ({
    bottomnavigator: state.bottomnavigator,
    session: state.session,
    user: state.user,
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);