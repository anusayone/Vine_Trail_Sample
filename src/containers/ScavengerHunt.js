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
    ActivityIndicator,
    NetInfo
} from "react-native";
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import ImageLoad from 'react-native-image-placeholder';
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
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
        alignItems: 'center',
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
        //borderColor: '#dd0000', borderWidth: 2,
        marginTop: 68,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});

class ScavengerHunt extends Component {
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

    constructor(props) {
        super(props);
        this.state = {
            hunts: [],
            isHuntAvailable: false,
            netstatus: true,
            errortext: "No internet"

        }
    }

    onBackPress = () => {
        console.log("back button of hunt listing page");
        //this.props.navigation.goBack();
        this.props.navigation.navigate('BottomNavigator');
       //this.props.navigation.navigate(Types.DASHBOARD);
        return true;
    };
    getData(){
    //console.log("get data scavenger hunt")
    this.props.getHunts().then(() => {
        this.setState({
            hunts: this.props.hunt.hunts,
            isHuntAvailable: true
        });
    });
    }
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
    }

    render() {
        let color = ['#fe696f', '#4bb7dd', '#46c2a6', '#ff70a8', '#fe696f', '#4bb7dd', '#fe696f', '#4bb7dd', '#46c2a6', '#ff70a8', '#fe696f', '#4bb7dd', '#fe696f', '#4bb7dd', '#46c2a6', '#ff70a8', '#fe696f', '#4bb7dd', '#fe696f', '#4bb7dd', '#46c2a6', '#ff70a8', '#fe696f', '#4bb7dd']
        let hunts = this.props.hunt.hunts;
        return (
        (this.state.netstatus)?
            <View style={styles.containerView}>
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
                            }}>Available Hunts</Text>
                    </View>
                </View>
                <View style={styles.contentView}>
                    {
                        (this.state.isHuntAvailable)
                            ? <FlatList
                                data={hunts}
                                bounces={false}
                                renderItem={({item,index}) =>
                                <TouchableOpacity
                                onPress={()=>{
                                if(this.state.netstatus){
                                    this.props.navigation.navigate(Types.SCAVENGER_HUNT_DETAILS_SCREEN,item.id)
                                }else{
                                    Toast.show("No Internet");
                                }
                                }}>
                                    <View style={{
                                            height:responsiveHeight(35),
                                            width:responsiveWidth(100),
                
                                        }}>
                                        <ImageLoad
                                          style={{
                                                 height: responsiveHeight(35),
                                                 width:responsiveWidth(100),
                                                 position:'absolute',
                                                 resizeMode: 'cover'
                                                 }}
                                          placeholderStyle={{
                                                 height: responsiveHeight(35),
                                                 width:responsiveWidth(100),
                                                 position:'absolute',
                                                 resizeMode: 'cover'
                                                 }}
                                        placeholderSource={require('../../assets/images/placeholder_image.png')}
                                         source={{uri:item.logo}}
                                         />
                                        <View style={{
                                            height: responsiveHeight(35),
                                            width:responsiveWidth(100)}}>
                                                    <Image
                                                    style={{
                                                       height: responsiveHeight(35),
                                                       width:responsiveWidth(100),
                                                       position:'absolute',
                                                       resizeMode: 'cover'
                                                    }}
                                                    source={require('../../assets/images/hunt_overlay.png')}/>
                                        </View>
                                        <View style={{
                                                backgroundColor:'rgba(236,240,241,0.8)',
                                                flex:1,
                                                flexDirection:'row',
                                                position:'absolute',bottom:0,
                                                width:responsiveWidth(100)}}>
                                                    <View style={{
                                                        justifyContent:'center',
                                                        width: responsiveWidth(50),
                                                        borderStyle: 'solid',
                                                        borderRightWidth: 35,
                                                        borderBottomWidth: 75,
                                                        borderRightColor: 'transparent',
                                                        borderBottomColor: color[index]
                                                    }}>
                                                        <View style={{position:'absolute',
                                                        width: responsiveWidth(50),
                                                        padding:10
                                                        }}>
                                                            <Text style={{
                                                                color:'#fff',
                                                                fontFamily:'Roboto-Regular',
                                                                fontSize:responsiveFontSize(1.4)
                                                                }}>
                                                                {"End Date "+item.end_date_time}
                                                            </Text>
                                                             <Text style={{color:'#fff',
                                                                fontFamily:'Roboto-Bold',
                                                                fontSize:responsiveFontSize(2)
                                                             }}>
                                                                {item.name}
                                                             </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{
                                                        flex:1,
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        //borderColor:'#dd0000',borderWidth:2
                                                    }}>
                                                        <Text style={{
                                                            fontSize:responsiveFontSize(3.5),
                                                            fontFamily:'Roboto-Bold',
                                                            color:color[index]
                                                        }}>
                                                            {item.days_left}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize:responsiveFontSize(1.5),
                                                            fontFamily:'Roboto-Regular',
                                                        }}>
                                                            {"Days left"}
                                                        </Text>
                                                    </View>
                                                    <View style={{
                                                        flex:1,
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                       // borderWidth:2,borderColor:'#dd0000'
                                                       borderLeftWidth:0.3,borderLeftColor:'#828282'
                                                    }}>
                                                        <Text style={{
                                                            fontSize:responsiveFontSize(3.5),
                                                            fontFamily:'Roboto-Bold',
                                                            color:color[index]
                                                        }}>
                                                            {item.no_of_tasks}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize:responsiveFontSize(1.5),
                                                            fontFamily:'Roboto-Regular',
                                                        }}>
                                                            {"Tasks"}
                                                        </Text>
                                                    </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                }
                                keyExtractor={(item, index) => item.id.toString()}
                            />
                            : <View style={{
                                backgroundColor:'transparent',
                                width:responsiveWidth(90),
                                height:responsiveHeight(90),
                                alignItems:'center',
                                justifyContent:'center',
                        }}>
                                <ActivityIndicator size="large" color="#000"/>
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
                         }}>Available Hunts</Text>
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
    bottomnavigator: state.bottomnavigator,
    session: state.session,
    user: state.user,
    hunt: state.hunt
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScavengerHunt);
