import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {AsyncStorage, Image, StatusBar, View,
    BackHandler} from "react-native";
import {ActionCreators} from "../actions/index";
import styles from "../styles/common";
import * as Types from "../constants/types";

class SplashScreen extends Component {
    static navigationOptions = {
        gesturesEnabled: false,
        header: null
    }

    constructor(props) {
        super(props);
    }
    onBackPress = () => {
        console.log("back from splash screen");
        BackHandler.exitApp();
        //this.props.navigation.goBack(null);
        // return true;
        //return false;
        // BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        // this.props.navigation.goBack();
        //BackHandler.exitApp();
        //return true;
    };
    componentDidMount() {
        //BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        setTimeout(() => {
            this.checkLogin();
        }, 2000);
    }

    checkLogin() {
        AsyncStorage.getItem('user', (error, result) => {
            if (result) {
                let user = JSON.parse(result);
                if (user.token) {
                    console.log("from splash screen");
                    this.props.restoreUser(user);
                    this.props.navigation.navigate('BottomNavigator');
                } else {
                    this.props.navigation.navigate(Types.LOGIN_SCREEN);
                }
            } else {
                this.props.navigation.navigate(Types.LOGIN_SCREEN);
            }
        });
    }

    render() {
        return (
            <View style={styles.containerView}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                <Image
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        resizeMode: 'cover'
                    }}
                    source={require('../../assets/images/bg_splash.png')}/>
                <View style={styles.loginBackgroundOverlay}></View>
                <View>
                    <Image
                        style={{
                            width: 161.3,
                            height: 149.3
                        }}
                        source={require('../../assets/images/splash_screen_logo.png')}/>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav,
    session: state.session
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
