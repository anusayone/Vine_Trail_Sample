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
    Linking,
    SafeAreaView, NetInfo
} from "react-native";
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import SideMenu from 'react-native-side-menu';
import Toast from "react-native-simple-toast";
import SideDrawer from '../components/SideDrawer';
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
        // shadowColor: '#e9e9e9',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        flex: 1,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        borderRadius: 7,
        marginLeft: responsiveWidth(4.2),
        borderWidth: responsiveWidth(0.3), borderColor: '#949494'
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
    }
});
class Dashboard extends Component {
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
        this.flag=false;
        this.count=0;
        this.state = {
            isSideDrawerOpen: false,
            currentLatitude: null,
            currentLongitude: null,
            locationError: null,
            locationTimeOut: 1000 * 60 * 60,
            locationEnabled:false,
            notificationList:null
        }
        this.onBackPress = this.onBackPress.bind(this);
    }

    onBackPress = () => {
        BackHandler.exitApp();
        //this.props.navigation.goBack(null);
        // return true;
        //return false;
        // BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        // this.props.navigation.goBack();
        //BackHandler.exitApp();
        return true;
    };

    joinNowPressed(){
    if(this.state.netStatus){
    let url='http://vinetrail.org/pub/htdocs/membership.html';
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }else{
    Toast.show("No Internet")}
    }

    componentDidMount() {
    NetInfo.getConnectionInfo().then((connectionInfo) => {
                if (connectionInfo.type === 'none') {
                this.setState({netStatus:false})
                    Toast.show('No internet connectivity');
                } else {
                 this.setState({netStatus:true})
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        Keyboard.dismiss();
        this.props.getNotificationList().then(()=>{
            this.setState({notificationList:this.props.trailTour.notificationList.results});
            if(this.state.notificationList!==null){
                this.state.notificationList.map((item)=>{
                    if(!item.read){
                        this.count=this.count+1;
                    }
                })
            }
        });
        }
        });

        // this.watchId = navigator.geolocation.watchPosition(
        //     (position) => {
        //         this.setState({
        //             currentLatitude: position.coords.latitude,
        //             currentLongitude: position.coords.longitude,
        //             locationError: null,
        //         });
        //     },
        //     (error) => this.setState({locationError: error.message}),
        //     {enableHighAccuracy: false, timeout: this.state.locationTimeOut, maximumAge: 600000, distanceFilter: 10},
        // );
    }

    componentWillMount()
    {
        AsyncStorage.getItem("userfirst", (err, result) => {
            if (err) {
            } else {
                if (result == null) {
                  //  Toast.show("First time");
                    AsyncStorage.setItem("notificationOn","true");
                    //   this.setModalVisible(true);
                } else {
                    //Toast.show("Not first time");
                }
            }
        });
        AsyncStorage.setItem("userfirst", JSON.stringify({"value":"true"}), (err,result) => {
        });
        navigator.geolocation.clearWatch(this.watchId);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    logout() {
        this.props.logout();
        this.props.navigation.navigate('LOGIN_SCREEN');
    }

    render() {
        return (
            <View style={styles.containerView}>
                {/*{this.renderLocationStatus()}*/}
                <StatusBar translucent={true}
                           backgroundColor={'rgba(0,0,0,0.4)'}
                           barStyle={'light-content'}/>
                <View style={styles.toolbarView}>
                    <View style={styles.toolbarNapaIconView}>
                        <Image
                            style={styles.toolbarNapaIcon}
                            source={require('../../assets/images/napa_valley_logo.png')}/>
                    </View>
                    <TouchableOpacity
                        style={{
                            //borderWidth:2,borderColor:'#dd0000'
                        }}
                        onPress={()=>{
                            this.props.navigation.navigate(Types.NOTIFICATION_SCREEN);
                        }}>
                        <View style={{flexDirection:'row',
                        //borderWidth:2,borderColor:'#ff0000',
                        //width:responsiveWidth(15)
                        }}>{
                            (this.count==0)
                                ?null
                                :<View style={{
                                alignItems:'center',
                                justifyContent:'center',
                                borderRadius:responsiveWidth(10),
                                backgroundColor:'#ff0000',
                                marginRight:-responsiveWidth(3),
                                zIndex:100,
                                //padding:responsiveWidth(2),
                                height:responsiveWidth(5),
                                width:responsiveWidth(5)}}>
                                    <Text style={{color:'#fff',
                                fontSize:responsiveFontSize(1.4)}}>
                                        {this.count}
                                    </Text>
                                </View>
                        }


                            <Image
                                style={styles.toolbarNotificationIcon}
                                source={require('../../assets/images/notification_icon.png')}/>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={styles.contentView}>
                    <View style={styles.dashboardGridRow}>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                this.props.navigation.navigate(Types.EXPLORE_SCREEN);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_explore_icon2.png')}/>
                                <Text
                                    style={styles.dashboardItemText}>Explore</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                NetInfo.getConnectionInfo().then((connectionInfo) => {
                                    if (connectionInfo.type === 'none') {
                                        Toast.show('No internet connectivity');
                                    } else {
                                        this.joinNowPressed();
                                    }
                                });
                                // this.props.navigation.navigate(Types.JOIN_US_SCREEN);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_join_now_icon2.png')}/>
                                <Text style={styles.dashboardItemText}>Join Now
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                //this.props.navigation.navigate({ key: Types.DASHBOARD, routeName: Types.SOCIAL});
                                this.props.navigation.navigate(Types.SOCIAL);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_social_icon2.png')}/>
                                <Text style={styles.dashboardItemText}>Social
                                </Text>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.dashboardGridRow}>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                this.props.navigation.navigate(Types.SCAVENGER_HUNT);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_hunt_icon2.jpg')}/>
                                <Text style={styles.dashboardItemText}>Scavenger Hunt
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                this.props.navigation.navigate(Types.REPORT);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_report_issue_icon2.png')}/>
                                <Text style={styles.dashboardItemText}>Report Issue
                                </Text>

                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                this.props.navigation.navigate(Types.TRIAL_TOUR);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_trial_tour_icon2.png')}/>
                                <Text style={styles.dashboardItemText}>Trail Tours
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.dashboardGridRow}>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                this.props.navigation.navigate(Types.SECTION_MAP);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_section_map_icon2.png')}/>
                                <Text style={styles.dashboardItemText}>Section Maps
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                            onPress={()=>{
                                this.props.navigation.navigate(Types.WINERIES_SCREEN);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_wineries_icon2.png')}/>
                                <Text style={styles.dashboardItemText}>Wineries
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                this.props.navigation.navigate(Types.RESTAURANTS);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_restuarants_icon2.png')}/>
                                <Text style={styles.dashboardItemText}>Restaurants
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{width: '100%',
                        height: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        paddingRight:responsiveWidth(4),
                        marginTop:responsiveWidth(4),
                        marginBottom:responsiveWidth(4)}}>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                this.props.navigation.navigate(Types.LODGE_SCREEN);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_lodging_icon2.png')}/>
                                <Text style={styles.dashboardItemText}>Lodging
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                this.props.navigation.navigate(Types.VIDEO_SCREEN);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_videos_icon2.png')}/>
                                <Text style={styles.dashboardItemText}>Videos
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                this.props.navigation.navigate(Types.SETTINGS_SCREEN);
                            }}>
                            <View style={styles.dashboardGridColumn}>
                                <Image
                                    style={styles.dashboardItemImage}
                                    source={require('../../assets/images/dashboard_settings_icon2.png')}/>
                                <Text style={styles.dashboardItemText}>Settings
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
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
    trailTour:state.trailTour
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
