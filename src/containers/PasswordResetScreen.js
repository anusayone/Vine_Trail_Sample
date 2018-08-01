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
    TextInput
} from "react-native";
import {ActionCreators} from "../actions/index";
import styles from "../styles/common";
import InputLogin from "../components/InputLogin";
import ButtonLogin from "../components/ButtonLogin";
import Toast from "react-native-simple-toast";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
import * as Types from "../constants/types";
import { KeyboardAvoidingView } from 'react-native';
class PasswordResetScreen extends Component {
    static navigationOptions = {
    gesturesEnabled: false,
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            behavior: ''
        }
    }

    onBackPress = () => {
        this.props.navigation.goBack();
        return true;
    };

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
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

    resetPassword() {
        if (this.checkFields()) {
            this.setState({showActivityIndicator: true});
            this.props.resetPassword(
                this.state.email
            ).then(()=>{
                this.setState({showActivityIndicator: false,
                    email:''});
                if(this.props.session.setSuccessStatus.error_status){
                    Toast.show(this.props.session.setSuccessStatus.error_status);
                }else  if(this.props.session.setSuccessStatus.success_status)
                {
                    Toast.show(this.props.session.setSuccessStatus.success_status);
                }
            })
        } else {
            Toast.show('Please enter Email Address');
        }
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
                <KeyboardAvoidingView
                style={{justifyContent: 'center',
                       //alignItems: 'center',
                       flex: 1,
                      // flexDirection: 'column',
                       backgroundColor: '#DDDDDD',
                       width:responsiveWidth(100),
                        //borderColor:'#dd0000',borderWidth:2
                        }}
                behavior={this.state.behavior}>
                <Image
                    style={styles.loginBackgroundImage}
                    source={require('../../assets/images/bg_login.png')}/>
                <View style={styles.loginBackgroundOverlay}/>
                {this.renderAcitivityIndicator()}
                <ScrollView
                bounces={false}
                    style={{height: '100%'}}
                    keyboardShouldPersistTaps='handled'
                    scrollEnabled={true}>
                    <View style={{
                        width: '100%',
                        height: responsiveWidth(67),
                        paddingTop: responsiveHeight(7),
                        justifyContent: 'center',

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
                            width: '100%',
                            //height: responsiveWidth(90),
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            paddingBottom: responsiveHeight(3),
                             //borderColor:'#dd0000',borderWidth:2
                        }}>
                        <View style={{
                            margin: responsiveWidth(5),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                color: '#ffffff',
                                fontFamily: 'Roboto-Bold',
                                fontSize:responsiveFontSize(3.5)
                            }}>
                                Don't worry!
                            </Text>
                            <Text style={{
                                color: '#fff',
                                fontFamily: 'Roboto-Light',
                                fontSize:responsiveFontSize(2.5),
                                lineHeight: 26.7,
                                textAlign: "center",
                                paddingLeft:5,
                                paddingRight:5
                            }}>
                                Just fill in your email and we'll help you to reset your password
                            </Text>
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
                                    keyboardType={'email-address'}
                                    multiline={false}
                                    value={this.state.email}
                                    secureTextEntry={false}
                                    onChangeText={(email) => {
                                        this.setState({email: email})
                                    }}
                                    ref={(input) => { this.email = input; }}
                                    blurOnSubmit={false}
                                    underlineColorAndroid={'transparent'}
                                    onSubmitEditing={() => {  this.resetPassword() }}
                                   // returnKeyType={"next"}
                                />
                            </View>
                        </View>
                        <ButtonLogin
                            onPress={() => this.resetPassword()}
                            title={'Submit'}
                            disabled={false}/>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.props.navigation.navigate(Types.LOGIN_SCREEN);
                            }}>
                            <View style={{paddingTop: 10,paddingBottom:responsiveWidth(7)}}>
                                <Text style={{
                                    fontFamily: "Roboto-Regular",
                                    fontSize: responsiveFontSize(2.3),
                                    color: '#FFFFFF',
                                    textAlign: 'center'
                                }}>
                                    Back to
                                    <Text style={{
                                        fontSize: responsiveFontSize(2.3),
                                        color: '#e57e39'
                                    }}> Sign in
                                    </Text>
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </ScrollView>
                 </KeyboardAvoidingView>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav,
    session:state.session
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetScreen);
