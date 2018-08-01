import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    ActivityIndicator,
    BackHandler,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    Keyboard,
    TextInput,
    PermissionsAndroid,
    Platform,
    NetInfo
} from "react-native";
import {ActionCreators} from "../actions/index";
import styles from "../styles/common";
import InputLogin from "../components/InputLogin";
import ButtonLogin from "../components/ButtonLogin";
import Toast from "react-native-simple-toast";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
import * as Types from "../constants/types";

class SignupScreen extends Component {
    static navigationOptions = {
        gesturesEnabled: false,
        header: null
    }

    constructor(props) {
        super(props);
        this.isPermissionAllowed = false;
        this.state = {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            showActivityIndicator: false
        }
    }

    onBackPress = () => {
        this.props.navigation.goBack();
        return true;
    };


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

    componentDidMount() {
        //console.log(this.isPermissionAllowed);
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
         this.checkLocationPermission();
        Keyboard.dismiss();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    checkFields() {
        let flag = true;
        if (this.state.email === '') {
            flag = false;
        }
        return flag;
    }

    signUp() {
        if (this.checkFields()) {
            NetInfo.getConnectionInfo().then((connectionInfo) => {
                if (connectionInfo.type === 'none') {
                    Toast.show('No internet connectivity');
                } else {
                    console.log(this.isPermissionAllowed);
                    if (Platform.OS === 'android') {
                        if (this.isPermissionAllowed) {
                            this.setState({showActivityIndicator: true});
                            this.props.signUp(
                                this.state.firstName,
                                this.state.lastName,
                                this.state.username,
                                this.state.email,
                                this.state.password
                            ).then(() => {
                                this.setState({showActivityIndicator: false});
                                if (this.props.user.signUpResult) {
                                    this.props.restoreUser(this.props.user.signUpResult);
                                    this.props.navigation.navigate(Types.JOIN_US_SCREEN);
                                } else if (this.props.user.signUpError) {
                                    this.parseSignUpErrors(this.props.user.signUpError);
                                }
                            });
                        } else {
                            this.checkLocationPermission();
                        }
                    } else {
                        this.setState({showActivityIndicator: true});
                        this.props.signUp(
                            this.state.firstName,
                            this.state.lastName,
                            this.state.username,
                            this.state.email,
                            this.state.password
                        ).then(() => {
                            this.setState({showActivityIndicator: false});
                            if (this.props.user.signUpResult) {
                                this.props.restoreUser(this.props.user.signUpResult);
                                this.props.navigation.navigate(Types.JOIN_US_SCREEN);
                            } else if (this.props.user.signUpError) {
                                this.parseSignUpErrors(this.props.user.signUpError);
                            }
                        });
                    }
                }
            });
        } else {
            Toast.show('Please check all fields');
        }
    }


    parseSignUpErrors(errors) {
        let flag = true;
        Object.keys(errors).forEach((key) => {
            if (flag) {
                flag = false;
                Toast.show(errors[key][0]);
            }
        })
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
        return (
            <View style={styles.containerView}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                <Image
                    style={styles.loginBackgroundImage}
                    source={require('../../assets/images/bg_sigup.png')}/>
                <View style={styles.loginBackgroundOverlay}/>
                {this.renderAcitivityIndicator()}
                <ScrollView
                    bounces={false}
                    style={{height: '100%'}}
                    keyboardShouldPersistTaps='handled'
                    scrollEnabled={true}>
                    <View style={{
                        width: responsiveWidth(100),
                        //height: responsiveHeight(20),
                        paddingTop: responsiveHeight(7),
                        justifyContent: 'center',
                        marginBottom:responsiveWidth(5),
                        marginTop:responsiveWidth(5)

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
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            paddingBottom: responsiveHeight(3),
                            marginBottom:responsiveWidth(5)
                        }}>
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
                                    source={require('../../assets/images/first_name_icon.png')}/>
                                <TextInput
                                    style={styles.loginInput}
                                    placeholderTextColor={'#FFFFFF'}
                                    placeholder={'First Name'}
                                    keyboardType={"default"}
                                    multiline={false}
                                    value={this.state.firstName}
                                    secureTextEntry={false}
                                    onChangeText={(firstName) => {
                                        this.setState({firstName: firstName})
                                    }}
                                    onSubmitEditing={() => { this.second.focus(); }}
                                    ref={(input) => { this.first = input; }}
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
                                    source={require('../../assets/images/last_name_icon.png')}/>
                                <TextInput
                                    style={styles.loginInput}
                                    placeholderTextColor={'#FFFFFF'}
                                    placeholder={'Last Name'}
                                    onChangeText={(lastName) => {
                                        this.setState({lastName: lastName})
                                    }}
                                    keyboardType={"default"}
                                    multiline={false}
                                    value={this.state.lastName}
                                    secureTextEntry={false}
                                    blurOnSubmit={false}
                                    underlineColorAndroid={'transparent'}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => { this.third.focus(); }}
                                    ref={(input) => { this.second = input; }}
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
                                    source={require('../../assets/images/username.png')}/>
                                <TextInput
                                    style={styles.loginInput}
                                    placeholderTextColor={'#FFFFFF'}
                                    placeholder={'Username'}
                                    onChangeText={(username) => {
                                        this.setState({username: username})
                                    }}
                                    keyboardType={"default"}
                                    multiline={false}
                                    value={this.state.username}
                                    secureTextEntry={false}
                                    blurOnSubmit={false}
                                    underlineColorAndroid={'transparent'}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => { this.fourth.focus(); }}
                                    ref={(input) => { this.third = input; }}
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
                                    source={require('../../assets/images/email_icon.png')}/>
                                <TextInput
                                    style={styles.loginInput}
                                    placeholderTextColor={'#FFFFFF'}
                                    placeholder={'Email Address'}
                                    onChangeText={(email) => {
                                        this.setState({email: email})
                                    }}
                                    keyboardType={"email-address"}
                                    multiline={false}
                                    value={this.state.email}
                                    secureTextEntry={false}
                                    blurOnSubmit={false}
                                    underlineColorAndroid={'transparent'}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => { this.fifth.focus(); }}
                                    ref={(input) => { this.fourth = input; }}
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
                                    style={styles.loginInput}
                                    placeholderTextColor={'#FFFFFF'}
                                    placeholder={'Password'}
                                    onChangeText={(password) => {
                                        this.setState({password: password})
                                    }}
                                    keyboardType={"default"}
                                    multiline={false}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    blurOnSubmit={false}
                                    underlineColorAndroid={'transparent'}
                                    // returnKeyType={"next"}
                                    onSubmitEditing={() => {this.signUp() }}
                                    ref={(input) => { this.fifth = input; }}
                                />
                            </View>
                        </View>

                        <ButtonLogin
                            onPress={() => this.signUp()}
                            title={'Sign Up'}
                            disabled={false}/>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.props.navigation.navigate('LOGIN_SCREEN');
                            }}>
                            <View style={{flexDirection: 'row',paddingTop:10,paddingRight:10}}>
                                <Text style={{
                                    fontSize: responsiveFontSize(2),
                                    color: '#fff',
                                    fontFamily: 'Roboto-Light'
                                }}>
                                    Already registered?
                                </Text>

                                <Text style={{
                                    fontSize: responsiveFontSize(2),
                                    color: '#e57e39',
                                    fontFamily: 'Roboto-Light',
                                    marginLeft: responsiveHeight(1)
                                }}>
                                    Sign in
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() =>{
                                 this.props.navigation.navigate('TERMS_AND_CONDITION_SCREEN');
                            }}>
                            <View style={{
                                marginTop: responsiveHeight(3)
                            }}>
                                <Text style={{
                                    fontSize: responsiveFontSize(2),
                                    color: '#ffffff',
                                    textAlign: "center",
                                    fontFamily: 'Roboto-Light'
                                }}>
                                    By clicking Sign up you agree to the{'\n'}
                                    <Text style={{
                                        fontSize: responsiveFontSize(2),
                                        fontFamily: 'Roboto-Light',
                                        color: '#e57e39',
                                        marginLeft: responsiveHeight(1)
                                    }}>
                                        Terms and Conditions{' '}
                                    </Text>
                                    of this Application
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav,
    user: state.user,
    session: state.session
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
