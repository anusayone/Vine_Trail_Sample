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
    View, FlatList
} from "react-native";
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import ImageLoad from 'react-native-image-placeholder';
import {TUTORIAL} from "../constants/location";
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
        width: 16.7,
        height: 16.7,
        resizeMode: 'contain',
        marginRight: 0,
    },
    toolbarFilterIcon: {
        width: 16.7,
        height: 16.7,
        resizeMode: 'contain',
        marginRight: 15,
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
    contentView: {
        ...StyleSheet.absoluteFillObject,
        //borderColor: '#dd0000', borderWidth: 2,
        marginTop: 68,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    },
    mapView: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        //left: 0,
        //top: 68
    },
});

class TutorialScreen extends Component {
    static navigationOptions = {
        header: null,
        gesturesEnabled: false,
    }

    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
            slider1Ref: false,
        }
    }

    onBackPress = (category) => {
        this.props.navigation.goBack();
        return true;
    };

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    get pagination() {
        return (
            <Pagination
                dotsLength={5}
                activeDotIndex={this.state.activeSlide}
                containerStyle={{
                    backgroundColor: 'transparent' ,
                    paddingTop:0,
                    marginTop:responsiveHeight(3)
               }}
                dotContainerStyle={{
                      marginLeft:1,
                      marginRight:1,
                }}
                dotStyle={{
                      width: 15,
                      height: 15,
                      borderRadius: 45,
                      backgroundColor: '#000',
              }}
                inactiveDotStyle={{
                  width: 15,
                  height: 15,
                  borderRadius: 45,
                  backgroundColor: '#000000'
              }}
                carouselRef={this.state.slider1Ref || {}}
                tappableDots={true}
                activeOpacity={1}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    renderTutorials(item, index) {
        if (item.index < 5) {
            return (
                <TouchableOpacity
                    onPress={() => {
                                //this.props.navigation.navigate(Types.HUNT_IMAGES_SCREEN);
                                }}>
                    <View style={{
                                padding:5,
                                alignItems:'center',
                                justifyContent:'center',
                                width:responsiveWidth(80),
                                }}>
                        <Image
                            style={{
                                    height:responsiveWidth(44),
                                    width:responsiveWidth(44),
                                    resizeMode: 'cover',
                                    marginTop:responsiveWidth(4),
                                    }}
                            source={
                                (item.index==0)
                                    ?require('../../assets/images/tutorial_nearby_icon.png')
                                    :(item.index==1)
                                    ?require('../../assets/images/tutorial_hunt_icon.png')
                                    :(item.index==2)
                                    ?require('../../assets/images/tutorial_trial_tour_icon.png')
                                    :(item.index==3)
                                    ?require('../../assets/images/tutorial_map_icon.png')
                                    :require('../../assets/images/tutorial_report_issue.png')
                                }
                        />
                        <Text style={{
                                fontFamily:'Roboto-Bold',
                                fontSize:responsiveFontSize(3),
                                color:'#333333'}}>{item.item.heading1}
                            <Text style={{
                                fontFamily:'Roboto-Bold',
                                fontSize:responsiveFontSize(3),
                                color:'#e57e39'}}> {item.item.heading2}</Text>
                        </Text>
                        <Text style={{
                                fontFamily:'Roboto-Regular',
                                fontSize:responsiveFontSize(1.6),
                                color:'#333333',
                                textAlign:'center',
                                padding:responsiveWidth(3),
                               }}>{item.item.content}
                            </Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <View style={{
                alignItems: 'center',
                flex: 1,
                flexDirection: 'column',
                backgroundColor: '#fff',
            }}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                <Image
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        resizeMode: 'cover'
                    }}
                    source={require('../../assets/images/bg_splash.png')}/>
                <View style={{
                    alignItems:'center',
                    justifyContent:'center',
                    width:responsiveWidth(100),
                    height:responsiveHeight(100),
                    }}>
                    <View style={{
                            width: responsiveWidth(80),
                            height: responsiveHeight(83),
                            alignItems:'center',justifyContent:'center',
                        }}>
                        <Image
                            style={{
                                width: responsiveWidth(80),
                                height: responsiveHeight(83),
                                borderRadius:responsiveWidth(3)
                            }}
                            source={require('../../assets/images/tutorial_screen_white_rectangle.png')}/>
                        <View style={{position:'absolute',
                                }}>
                            <ScrollView
                                style={{height: responsiveHeight(83)}}
                                keyboardShouldPersistTaps='handled'
                                horizontal={false}
                                scrollEnabled={true}>
                                <Carousel
                                    ref={(c) => { if (!this.state.slider1Ref) { this.setState({ slider1Ref: c }); } }}
                                    data={TUTORIAL}
                                    renderItem={(item,index)=>this.renderTutorials(item,index)}
                                    sliderWidth={responsiveWidth(80)}
                                    itemWidth={responsiveWidth(80)}
                                    onSnapToItem={(index) => this.setState({ activeSlide: index })}/>
                                { this.pagination }
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate(Types.DASHBOARD);
                                    }}>
                                    <View style={{height:responsiveHeight(5)}}>
                                        <Text style={{position:'absolute',
                                        right:responsiveWidth(7),
                                        color:'#e57e39',
                                        fontSize:responsiveFontSize(2.4)}}>Skip</Text>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(TutorialScreen);
