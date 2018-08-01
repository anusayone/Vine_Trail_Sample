import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    ActivityIndicator,
    AsyncStorage,
    BackHandler,
    Image,
    Keyboard,
    NetInfo,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    TextInput,

} from "react-native";
import {ActionCreators} from "../actions/index";
import styles from "../styles/common";
import GoogleSignIn from "react-native-google-sign-in";
import InputLogin from "../components/InputLogin";
import ButtonLogin from "../components/ButtonLogin";
import Toast from "react-native-simple-toast";
import {responsiveFontSize, responsiveHeight, responsiveWidth} from "../helpers/Responsive";
import * as Types from "../constants/types";
import {KeyboardAvoidingView} from 'react-native'
const FBSDK = require('react-native-fbsdk');
const {
    LoginManager,
    AccessToken
} = FBSDK;
class LoginScreen extends Component {

    static navigationOptions = {
        gesturesEnabled: false,
        header: null
    }

    constructor(props) {
        super(props);
        this.isPermissionAllowed=false;
        this.state = {
            username: '',
            password: '',
            facebookLoginSuccess: false,
            facebookAccessToken: false,
            googleLoginSuccess: false,
            googleAccessToken: null,
            showActivityIndicator: false,
            behavior: 'padding',

        }

    }

    onBackPress = () => {
        console.log("on back press of login screen");
        return false;
    };

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.checkLocationPermission();
        Keyboard.dismiss();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    // componentWillReceiveProps(nextProps) {
    //     if (this.checkCurrentScreen('LoginScreen')) {
    //         if (nextProps.session.user && nextProps.session.user.token) {
    //             this.props.navigation.navigate(Types.DASHBOARD);
    //         }
    //     }
    // }

    // checkCurrentScreen(screen) {
    //     console.log(this.props.nav.routes[this.props.nav.routes.length - 1]);
    //     if(this.props.nav.routes[this.props.nav.routes.length - 1].routeName === screen){
    //         return true
    //     }else{
    //         return false
    //     }
    // }

    checkLocationPermission() {
        let result = true;
        if (Platform.OS === 'android') {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((hasLocationPermission) => {
                console.log('Does app already have location permission: ' + hasLocationPermission);
                if (hasLocationPermission) {
                    this.isPermissionAllowed=true;
                    result = true;
                    return result;
                } else {
                    this.requestLocationPermission().then((locationPermission) => {
                        if (locationPermission) {
                            console.log('Did app get location permission: ' + hasLocationPermission);
                            this.isPermissionAllowed=true;
                            result = true;
                            return result;
                        } else {
                            console.log('Did app get location permission: ' + hasLocationPermission);
                            this.isPermissionAllowed=false;
                            result = false;
                            return result;
                        }
                    });
                }
            });
        }
         else {
            result = false;
        }
        return result;
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Access',
                    'message': 'Vine Trail need to access your location to function properly.' +
                    ' Please click allow in the next prompt',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location");

                return true;
            } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                console.log("denied");
                return false;
            }
            else {
                console.log("never ask again");
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }

    login() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type === 'none') {
                Toast.show('No internet connectivity');
            } else {
               // console.log(this.checkLocationPermission());
                //console.log(this.isPermissionAllowed);
                if (Platform.OS === 'android') {
                    if (this.isPermissionAllowed) {
                        this.setState({showActivityIndicator: true});
                        this.props.login(this.state.username, this.state.password).then(() => {
                            this.setState({showActivityIndicator: false});
                            if (this.props.session.user.token) {
                                console.log(this.props.session.user.token);
                                this.props.navigation.navigate(Types.DASHBOARD);
                            } else {
                                this.setState({showActivityIndicator: false});
                                console.log('Login failed!');
                                Toast.show('Login failed!');
                            }
                        });
                    }
                    else {
                        this.checkLocationPermission();
                    }
                }else{
                    this.setState({showActivityIndicator: true});
                    this.props.login(this.state.username, this.state.password).then(() => {
                        this.setState({showActivityIndicator: false});
                        if (this.props.session.user.token) {
                            console.log(this.props.session.user.token);
                            this.props.navigation.navigate(Types.DASHBOARD);
                        } else {
                            this.setState({showActivityIndicator: false});
                            console.log('Login failed!');
                            Toast.show('Login failed!');
                        }
                    });
                }
            }
        });
    }

    doGoogleLogin2() {
        this.setState({showActivityIndicator: true});
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type === 'none') {
                Toast.show('No internet connectivity');
            } else {
                GoogleSignIn.configure({
                    shouldFetchBasicProfile: true,
                    offlineAccess: true,
                    forceCodeForRefreshToken: true,
                });
                GoogleSignIn.signInPromise().then((user) => {
                    if (user.accessToken) {
                        console.log('Google sign-in success!');
                        console.log(user.accessToken);
                        this.props.googleLogin(user.accessToken).then(() => {
                            if (this.props.session.user.token) {
                                console.log("google-successsss");
                                this.props.navigation.navigate(Types.DASHBOARD);
                            } else {
                                this.setState({showActivityIndicator: false});
                                console.log('Login failed!');
                                Toast.show('Login failed!');
                            }
                        });
                    } else {
                        this.setState({showActivityIndicator: false});
                        console.log('Google sign-in failed!');
                    }

                });
            }
        });
    }

    doGoogleLogin() {
        let that = this;
        this.setState({showActivityIndicator: true});
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type === 'none') {
                Toast.show('No internet connectivity');
            } else {
                if (Platform.OS === 'android') {
                    console.log("android")
                    if (this.isPermissionAllowed) {
                        console.log("permission allowed");
                        GoogleSignIn.configure({
                            shouldFetchBasicProfile: true,
                            offlineAccess: true,
                            forceCodeForRefreshToken: true,
                        });
                        GoogleSignIn.signInPromise().then(
                            function (user) {
                                if (user.accessToken) {
                                    console.log('Google sign-in success!');
                                    console.log(user.accessToken);
                                    this.props.googleLogin(user.accessToken).then(() => {
                                        if (this.props.session.user.token) {
                                            console.log("google-successsss");
                                            this.props.navigation.navigate(Types.DASHBOARD);
                                        } else {
                                            //this.setState({showActivityIndicator: false});
                                            console.log('Login failed!');
                                            Toast.show('Login failed!');
                                        }
                                    });
                                } else {
                                    //this.setState({showActivityIndicator: false});
                                    console.log('Google sign-in failed!');
                                }

                            }.bind(this),
                            function (error) {
                                console.log('Login fail with error' + error);
                                that.setState({showActivityIndicator: false});

                            });
                    } else {
                        console.log("else")
                        this.checkLocationPermission();
                    }
                }else {
                    console.log("....")
                    GoogleSignIn.configure({
                        shouldFetchBasicProfile: true,
                        offlineAccess: true,
                        forceCodeForRefreshToken: true,
                    });
                    GoogleSignIn.signInPromise().then(
                        function (user) {
                            if (user.accessToken) {
                                console.log('Google sign-in success!');
                                console.log(user.accessToken);
                                this.props.googleLogin(user.accessToken).then(() => {
                                    if (this.props.session.user.token) {
                                        console.log("google-successsss");
                                        this.props.navigation.navigate(Types.DASHBOARD);
                                    } else {
                                        //this.setState({showActivityIndicator: false});
                                        console.log('Login failed!');
                                        Toast.show('Login failed!');
                                    }
                                });
                            } else {
                                //this.setState({showActivityIndicator: false});
                                console.log('Google sign-in failed!');
                            }

                        }.bind(this),
                        function (error) {
                            console.log('Login fail with error' + error);
                            that.setState({showActivityIndicator: false});

                        });
                }
            }
        });
    }

    doFacebookLogin() {
        this.setState({showActivityIndicator: true});
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type === 'none') {
                Toast.show('No internet connectivity');
            } else {
                if (Platform.OS === 'android') {
                    if (this.isPermissionAllowed) {
                        LoginManager.logInWithReadPermissions(['public_profile']).then(
                            function (result) {
                                if (result.isCancelled) {
                                    console.log('Login cancelled');
                                    this.setState({showActivityIndicator: false});
                                } else {
                                    console.log("inside else");
                                    AccessToken.getCurrentAccessToken().then((data) => {
                                        if (data.accessToken) {
                                            console.log('Facebook sign-in success!');
                                            this.props.facebookLogin(data.accessToken).then(() => {
                                                if (this.props.session.user.token) {
                                                    console.log("fb-success");
                                                    this.props.navigation.navigate(Types.DASHBOARD);
                                                } else {
                                                    console.log('Login failed!');
                                                    Toast.show('Login failed!');
                                                    this.setState({showActivityIndicator: false});
                                                }
                                            });
                                        } else {
                                            console.log('Facebook sign-in failed!');
                                            this.setState({showActivityIndicator: false});
                                        }
                                    });
                                }
                            }.bind(this),
                            function (error) {
                                this.setState({showActivityIndicator: false});
                                console.log('Login fail with error' + error);
                            }
                        );
                    } else {
                        //console.log("asdf");
                        this.checkLocationPermission();
                    }
                }else {
                    LoginManager.logInWithReadPermissions(['public_profile']).then(
                        function (result) {
                            if (result.isCancelled) {
                                console.log('Login cancelled');
                                this.setState({showActivityIndicator: false});
                            } else {
                                console.log("inside else");
                                AccessToken.getCurrentAccessToken().then((data) => {
                                    if (data.accessToken) {
                                        console.log('Facebook sign-in success!');
                                        this.props.facebookLogin(data.accessToken).then(() => {
                                            if (this.props.session.user.token) {
                                                console.log("fb-success");
                                                this.props.navigation.navigate(Types.DASHBOARD);
                                            } else {
                                                console.log('Login failed!');
                                                Toast.show('Login failed!');
                                                this.setState({showActivityIndicator: false});
                                            }
                                        });
                                    } else {
                                        console.log('Facebook sign-in failed!');
                                        this.setState({showActivityIndicator: false});
                                    }
                                });
                            }
                        }.bind(this),
                        function (error) {
                            this.setState({showActivityIndicator: false});
                            console.log('Login fail with error' + error);
                        }
                    );
                }
            }
        });
    }

    renderAcitivityIndicator() {
        if (this.state.showActivityIndicator) {
            return (
                <View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        zIndex: 999,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <ActivityIndicator size="large" color="#FFFFFF"/>
                </View>
            );
        }
        return null;
    }

    render() {
        return <View style={styles.containerView}>
            <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
            <Image
                style={styles.loginBackgroundImage}
                source={require('../../assets/images/bg_reset_password.png')}/>
            <View style={styles.loginBackgroundOverlay}/>
            {this.renderAcitivityIndicator()}
            <ScrollView
                bounces={false}
                style={{height: '100%'}}
                keyboardShouldPersistTaps='handled'
                horizontal={false}
                scrollEnabled={true}
            >
                <View
                    style={{
                        width: responsiveWidth(100),
                        height: responsiveWidth(60),
                        justifyContent: 'center',
                    alignItems: 'center',
                   // marginBottom:responsiveHeight(30)
                    }}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Image
                            style={{
                                width: responsiveHeight(55),
                                height: responsiveWidth(18)
                            }}
                            source={require('../../assets/images/napavalley_logo_image.png')}
                            resizeMode={'contain'}/>
                    </View>
                </View>
                <View
                    style={{
                        width: responsiveWidth(100),
                        height: responsiveWidth(58),
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        
                    }}>
                    <KeyboardAvoidingView behavior={this.state.behavior}>
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <View style={{
                                flexDirection: 'row',
                                borderBottomColor: '#fff',
                                borderBottomWidth: responsiveHeight(0.2),
                                alignItems: 'center',
                                marginBottom: responsiveHeight(1),
                                width: responsiveHeight(42),
                                height:responsiveWidth(13),
                            }}>
                                <Image
                                    style={styles.loginInputIcon}
                                    source={require('../../assets/images/username.png')}/>
                                <TextInput
                                    style={styles.loginInput}
                                    placeholderTextColor={'#FFFFFF'}
                                    placeholder={'Username/Email'}
                                    keyboardType={"default"}
                                    multiline={false}
                                    value={this.state.username}
                                    secureTextEntry={false}
                                    onChangeText={(username) => {
                                        this.setState({username: username})
                                     }}
                                    onSubmitEditing={() => { this.secondTextInput.focus(); }}
                                    ref={(input) => { this.firstTextInput = input; }}
                                    blurOnSubmit={false}
                                    underlineColorAndroid={'transparent'}
                                    returnKeyType={"next"}
                                />
                            </View>
                        </View>
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <View style={{
                                flexDirection: 'row',
                                borderBottomColor: '#fff',
                                borderBottomWidth: responsiveHeight(0.2),
                                alignItems: 'center',
                                marginBottom: responsiveHeight(1),
                                width: responsiveHeight(42),
                                height:responsiveWidth(13),
                            }}>
                                <Image
                                    style={styles.loginInputIcon}
                                    source={require('../../assets/images/passwod_icon.png')}/>
                                <TextInput
                                    ref={(input) => { this.secondTextInput = input; }}
                                    style={styles.loginInput}
                                    placeholderTextColor={'#FFFFFF'}
                                    placeholder={'Password'}
                                    keyboardType={"default"}
                                    multiline={false}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    onChangeText={(password) => {
                                        this.setState({password: password})
                                    }}
                                    onSubmitEditing={() => {  this.login() }}
                                    underlineColorAndroid={'transparent'}
                                    //returnKeyType={"next"}
                                />
                            </View>
                        </View>
                        {/*<InputLogin*/}
                        {/*iconImage={require('../../assets/images/username.png')}*/}
                        {/*placeholder={'Username'}*/}
                        {/*keyboardType={'default'}*/}
                        {/*value={this.state.username}*/}
                        {/*onChangeText={(username) => {*/}
                        {/*this.setState({username: username})*/}
                        {/*}}*/}
                        {/*returnKeyType={"next"}*/}
                        {/*onSubmitEditing={(event) => {*/}
                        {/*this.PasswordInput.focus();*/}
                        {/*}}*/}

                        {/*/>*/}
                    </KeyboardAvoidingView>
                    {/*<InputLogin*/}
                    {/*iconImage={require('../../assets/images/passwod_icon.png')}*/}
                    {/*ref={(input) => { this.PasswordInput = input; }}*/}
                    {/*// ref={'PasswordInput'}*/}
                    {/*placeholder={'Password'}*/}
                    {/*keyboardType={'default'}*/}
                    {/*value={this.state.password}*/}
                    {/*secureTextEntry={true}*/}
                    {/*onChangeText={(password) => {*/}
                    {/*this.setState({password: password})*/}
                    {/*}}*/}
                    {/*/>*/}
                    <ButtonLogin
                        onPress={() => {
                            this.login()
                        }}
                        title={'Sign in'}
                        disabled={false}/>
                    <TouchableWithoutFeedback
                        onPress={() => {
                        NetInfo.getConnectionInfo().then((connectionInfo) => {
                                    if (connectionInfo.type === 'none') {
                                        Toast.show('No internet connectivity');
                                    } else {
                            this.props.navigation.navigate('PASSWORD_RESET_SCREEN');
                            }
                            });
                        }}
                        style={{
                            alignSelf: 'center'
                        }}>
                        <View style={{
                            alignSelf: 'center',
                            width: 278.7
                        }}>
                            <Text style={{
                                fontFamily: "Roboto-Regular",
                                fontSize: 15,
                                color: '#ffffff',
                                textAlign: 'center',
                                textDecorationLine:'underline'
                            }}>
                                Forgot Password?
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{
                    width: '100%',
                    height: responsiveWidth(38),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            //this.setState({showActivityIndicator: true});
                            this.doFacebookLogin()
                        }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Image
                                style={styles.facebookLoginBackground}
                                source={require('../../assets/images/facebook_login_bg.png')}>
                            </Image>
                            <Image
                                style={styles.facebookIcon}
                                source={require('../../assets/images/facebook_icon.png')}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                             //this.setState({showActivityIndicator: true});
                            this.doGoogleLogin();
                        }}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 15
                        }}>
                            <Image
                                style={styles.googleLoginBackground}
                                source={require('../../assets/images/google_login_bg.png')}>
                            </Image>
                            <Image
                                style={styles.googleIcon}
                                source={require('../../assets/images/google.png')}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    alignSelf: 'center',
                    width: responsiveHeight(38),
                     marginBottom:responsiveWidth(10),
                     //borderWidth:2,borderColor:'#dd0000',
                     //position:'absolute',

                }}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                        NetInfo.getConnectionInfo().then((connectionInfo) => {
                            if (connectionInfo.type === 'none') {
                                Toast.show('No internet connectivity');
                            } else {
                             this.props.navigation.navigate(Types.SIGNUP_SCREEN);
                                }
                                });
                        }}>
                        <View style={{
                            //paddingTop: responsiveWidth(2),
                        //paddingBottom:responsiveWidth(7)
                        }}>
                            <Text style={{
                                fontFamily: "Roboto-Regular",
                                fontSize: responsiveFontSize(2.4),
                                color: '#FFFFFF',
                                textAlign: 'center'
                            }}>
                                New User ?
                                <Text style={{
                                    fontSize: responsiveFontSize(2.4),
                                    color: '#e57e39',
                                }}> Create an Account
                                </Text>
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ScrollView>

        </View>
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav,
    session: state.session,
    user: state.user,
    explore: state.explore
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
