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
    TouchableOpacity,
    Linking
} from "react-native";
import {ActionCreators} from "../actions/index";
import styles from "../styles/common";
import Toast from "react-native-simple-toast";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
import * as Types from "../constants/types";

class JoinUsScreen extends Component {

    static navigationOptions = {
        gesturesEnabled: false,
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            email: ""
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

    visitNowPressed() {
        let url = 'http://vinetrail.org/pub/htdocs/membership.html';
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    render() {
        return (
            <View style={styles.containerView}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                <Image
                    style={styles.loginBackgroundImage}
                    source={require('../../assets/images/bg_join_us.png')}/>
                <View style={styles.loginBackgroundOverlay}/>
                {this.renderAcitivityIndicator()}
                <ScrollView
                    bounces={false}
                    style={{height: '100%'}}
                    keyboardShouldPersistTaps='handled'
                    scrollEnabled={true}>
                    <View
                        style={{
                        width: responsiveWidth(100),
                        height: responsiveWidth(75),
                        justifyContent: 'center',
                        alignItems: 'center',
                       // borderWidth:2,borderColor:'#dd0000',
                        paddingTop:responsiveWidth(20)
                    }}>
                        <Image
                            style={{
                                width: responsiveHeight(55),
                                height: responsiveWidth(18)
                            }}
                            source={require('../../assets/images/napavalley_logo_image.png')}
                            resizeMode={'contain'}/>
                    </View>
                    <View style={{
                        width: '100%',
                        alignItems: 'center',
                        //borderWidth:2,borderColor:'#dd0000',
                    }}>
                        <View style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: responsiveWidth(86),
                              //borderWidth:2,borderColor:'#dd0000',
                             // height: responsiveHeight(30),
                              backgroundColor:"#fff",
                              paddingBottom:responsiveWidth(15),
                              paddingTop:responsiveWidth(10),
                              borderRadius:responsiveWidth(3)
                        }}>
                            <Text style={{
                                color: '#333333',
                                fontFamily: 'Roboto-Regular',
                                fontSize: responsiveFontSize(3),
                                textAlign: 'center',
                                //marginBottom:responsiveHeight(2),
                                //marginTop:responsiveWidth(6)
                            }}>
                                Join us on
                                <Text style={{color: '#e57e39'}}>
                                    {' '}Website
                                </Text>{'\n'}
                            </Text>
                            <Text style={{
                                paddingLeft:responsiveHeight(3),
                                paddingRight:responsiveHeight(3),
                                fontFamily: 'Roboto-Regular',
                                color: '#333333',
                                fontSize: responsiveFontSize(2),
                                textAlign: 'center'
                            }}>
                                We're building a 47-mile, walking & biking trail system connecting the entire Napa
                                Valley – from Vallejo to Calistoga.
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() =>{
                                //setOpacityTo((value: 2), (duration: 1000));
                                 this.visitNowPressed();
                                }}
                            style={{
                                alignItems:'center',
                                justifyContent:'center',
                                marginTop:-responsiveHeight(5),
                                opacity:10,

                                }}>
                            <View style={{
                                    width: responsiveWidth(50),
                                   // height: responsiveHeight(8),
                                    backgroundColor:'#e57e39',
                                    alignItems:'center',
                                    justifyContent:'center',
                                    borderRadius:responsiveWidth(2),
                                    padding:responsiveWidth(9)
                                }}>
                                <Text style={{
                                position: 'absolute',
                                textAlign: 'center',
                                color: '#fff',
                                fontSize: responsiveFontSize(2.9),
                                fontFamily: 'Roboto-Light'
                            }}>
                                    Visit Now
                                </Text>
                            </View>


                        </TouchableOpacity>
                    </View>
                    <TouchableWithoutFeedback onPress={() => {
                        //this.props.navigation.goBack();
                                this.props.navigation.navigate(Types.TUTORIAL_SCREEN);
                            }}>
                        <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                //borderWidth:2,borderColor:'#dd0000',
                                paddingTop:responsiveHeight(5),
                                }}>
                            <Text style={{
                                    fontFamily: "Roboto-Regular",
                                    fontSize: responsiveFontSize(2.5),
                                    color: '#e57e39',
                                    textAlign: 'center'
                                }}>
                                Skip
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav,

});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinUsScreen);
