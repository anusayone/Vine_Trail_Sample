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
    TextInput,
    NetInfo
} from "react-native";
import ButtonLogin from "../components/ButtonLogin";
import Toast from "react-native-simple-toast";
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
import ImageLoad from 'react-native-image-placeholder';
import POIComponent from "../components/POIComponent";
import SearchResult from "../components/SearchResult";

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
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        //resizeMode: 'cover',
    },
    contentView: {
        ...StyleSheet.absoluteFillObject,
        // borderColor: '#dd0000', borderWidth: 2,
        marginTop: 68,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center'
        //borderColor:'#dd0000',borderWidth:2
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});

class NotificationScreen extends Component {

    static navigationOptions = ({navigation}) => ({
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
    });
    constructor(props) {
        super(props);
        this.currentLatitude = '';
        this.currentLongitude = '';
        this.searchTimeOutId = null;
        this.state = {
            locationError: null,
            locationTimeOut: 1000 * 60 * 60,
            notificationList:null,
            loader:false,
            isMoreLoaderVisible:false,
            netstatus:true,
            errortext:"No internet",
        };
        // this.onBackPress = this.onBackPress.bind(this);
    }
    getTime= (date1) => {

        var date = new Date(date1);

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";



    }
    onBackPress = () => {
        //this.props.navigation.goBack();
        // BackHandler.addEventListener('hardwareBackPress', function() {
        //     // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
        //     // Typically you would use the navigator here to go to the last state.
        //     return false;
        // });
        this.props.navigation.navigate('BottomNavigator');
        //this.props.navigation.navigate(Types.DASHBOARD);
        return true;
    };
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.getNetinfo();
    }
    getData(){
        this.setState({loader:true});
                this.props.getNotificationList().then(()=>{
                  //  console.log(this.props.trailTour.notificationList.results);
                    this.setState({notificationList:this.props.trailTour.notificationList.results})
                    this.setState({loader:false});
                });
    }
    getNetinfo(){
          NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
            NetInfo.isConnected.fetch().done(
              (isConnected) => {
              if(isConnected)
                {
                  this.getData();
                  this.setState({netstatus:true});
                }
                else {
                  this.setState({netstatus:false});
                this.setState({errortext:"No internet"})
                }
              this.setState({ netstatus: isConnected });
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
    fetchMoreNotification() {
    if(this.state.netstatus){
    // console.log("fetch more notificationnnn");
            if (this.props.trailTour.notificationList.next) {
                    this.setState({
                        isMoreLoaderVisible: true
                    });
                this.props.getNotificationList(true).then(() => {
                    //  console.log(this.props.social.socialImages.results);
                    this.setState({
                        notificationList: this.props.trailTour.notificationList.results,
                        loader:false,
                        isMoreLoaderVisible:false
                    });
                });
            }
    }

    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        //navigator.geolocation.clearWatch(this.watchId);
    }
    notificationItemPressed(item){
    if(this.state.netstatus){
        //console.log(item);
        if(item.read){
            if(item.notification_type=='New Scavenger Hunt'){
                this.props.navigation.navigate(Types.SCAVENGER_HUNT,item.extra_data.id);
            }else{
                let jsonObject = JSON.parse('{"audioUrl":"http://www.music.helsinki.fi/tmt/opetus/uusmedia/esim/a2002011001-e02-128k.mp3"}');
                //  global.id=item.extra_data.id;
                //  global.notname=item.extra_data.title;
                // global.noturl=item.extra_data.audio_url;
                global.id="";

                if(item.extra_data.title!=null) {
                    global.notname = item.extra_data.title;
                }
                else
                {
                    global.notname="No Audio available"
                }

                if(item.extra_data.audioUrl!=null)
                    global.noturl=item.extra_data.audioUrl;
                // global.notname="hellor";
                // global.noturl="";
                // console.log(item.extra_data.id);
                //console.log(item.extra_data.title);
                //console.log(item.extra_data.audioUrl);
                global.notnew=true;
                if(item.extra_data.audioUrl!=null){
                    this.props.navigation.navigate(Types.TRIAL_TOUR,jsonObject);
                }else{
                    Toast.show("No Audio")
                }
                // this.props.navigation.navigate(Types.TRIAL_TOUR,item.extra_data);
                //global.notnew=true;
            }
        }else{
            this.props.readNotification(item.id)
                .then(()=>{
                    if(item.notification_type=='New Scavenger Hunt'){
                        this.props.navigation.navigate(Types.SCAVENGER_HUNT,item.extra_data.id);
                    }else{
                        let jsonObject = JSON.parse('{"audioUrl":"http://www.music.helsinki.fi/tmt/opetus/uusmedia/esim/a2002011001-e02-128k.mp3"}');
                        // global.id=item.extra_data.id;
                        // global.notname=item.extra_data.title;
                        // global.noturl=item.extra_data.audioUrl;

                        global.id="";
                        // global.notname="hello";
                        // global.noturl="";

                        if(item.extra_data.title!=null)
                            global.notname=item.extra_data.title;
                        else
                        {
                            global.notname="No Audio available"
                        }

                        if(item.extra_data.audioUrl!=null)
                            global.noturl=item.extra_data.audioUrl;

                        global.notnew=true;
                        if(item.extra_data.audioUrl!=null){
                            this.props.navigation.navigate(Types.TRIAL_TOUR,jsonObject);
                        }else{
                            Toast.show("No Audio")
                        }

                        //  global.notnew=true;
                        // this.props.navigation.navigate(Types.TRIAL_TOUR,item.extra_data);
                        //global.notnew=true;
                    }
                });
        }
    }else{
        Toast.show("No Internet");
    }
    }
    render() {
     //   console.log(this.state.notificationList);
        if(this.state.loader)
        {
            return(
                <View style={{alignItems: 'center', justifyContent: 'center',height:responsiveHeight(100)}}>

                    <ActivityIndicator size="large" color="#000" style={{alignSelf:'center'}}>
                    </ActivityIndicator>
                </View>
            )}

        else

            return (
            (this.state.netstatus)
               ? <View style={styles.containerView}>
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
                            }}>Notifications</Text>
                        </View>
                        {/*<TouchableOpacity>*/}
                        {/*<Image*/}
                        {/*style={styles.toolbarFilterIcon}*/}
                        {/*source={require('../../assets/images/restaurant_page_filter_icon.png')}/>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    {
                        (this.state.notificationList!==null)
                            ?(this.state.notificationList.length!=0)
                                ?<View style={styles.contentView}>
                                    <FlatList
                                        data={this.state.notificationList}
                                        renderItem={({item,index}) =>{
                            return(
                                <TouchableOpacity
                                onPress={() => {
                                   this.notificationItemPressed(item);
                                // console.log(item);
                                }}>
                                <View style={{
                                    width:responsiveWidth(100),
                                    borderBottomColor:'#d0d0d0',
                                    borderBottomWidth:1,
                                    backgroundColor:(item.read)?"#ffffff":'#f1f6fc'}}>
                                    <View style={{
                                        flexDirection:'row',
                                        alignItems:'center',
                                        }}>
                                        {
                                          (item.extra_data.logo!=undefined)?
                                    <Image
                                        style={{
                                              height:responsiveHeight(5),
                                              width:responsiveHeight(5),
                                              resizeMode: 'contain',
                                              margin:responsiveWidth(5)
                                              }}
                                      source={{uri:item.extra_data.logo}}


                                        //source={require('../../assets/images/trail_tour_music_icon2.png')}
                                    />:
                                    <Image
                                        style={{
                                              height:responsiveHeight(5),
                                              width:responsiveHeight(5),
                                              resizeMode: 'contain',
                                              margin:responsiveWidth(5)
                                              }}
                                        source={{uri:item.extra_data.mediaUrl}}
                                        />
                                  }
                                    <View style={{
                                        flex:1,
                                       // borderColor:'#dd0000',borderWidth:2
                                    }}>
                                        <Text style={{
                                            fontSize:responsiveFontSize(2),
                                            color:'#838383',
                                            fontFamily:'Roboto-Regular'
                                        }}>{(item.notification_type==='New Scavenger Hunt')
                                        ?item.extra_data.name
                                        :item.extra_data.title}</Text>

                                        <Text style={{
                                            fontWeight: 'bold',
                                        fontSize:responsiveFontSize(1.5)}}>
                                        {item.notification_type}
                                        </Text>
                                    </View>
                                        <View style={{
                                        margin:responsiveWidth(5)
                                        }}>

                                        <Text style={{
                                            fontSize:responsiveFontSize(1.4),
                                            color:'#838383',
                                            fontFamily:'Roboto-Regular'}}>
                                        {this.getTime(item.sent_time)}</Text>
                                        </View>

                                 </View>
                                </View>
                                </TouchableOpacity>
                                )}}
                                        //keyExtractor={(item, index) => item.id.toString()}
                                        onEndReachedThreshold={0.9}
                                        onEndReached={()=>{
                                    this.fetchMoreNotification();
                                }}/>
                                </View>
                                :<View style={styles.contentView}>
                                    <View
                                        style={{
                                             // borderColor:'#dd0000',borderWidth:3,
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width:responsiveWidth(55)}}>
                                        <Image
                                            style={{
                                            width:responsiveWidth(15),
                                            height:responsiveWidth(19.5),
                                            }}
                                            source={require('../../assets/images/notification_image.png')}/>
                                        <Text style={{fontFamily:'Roboto-Bold',
                                            fontSize:responsiveFontSize(2.5),
                                            marginTop:responsiveWidth(5),
                                            color:'#848484'}}>
                                                            Nothing Here!!!
                                        </Text>
                                        <Text style={{fontFamily:'Roboto-Regular',
                                            fontSize:responsiveFontSize(1.5),
                                            marginTop:responsiveWidth(3),
                                            color:'#a4a2a2',
                                            textAlign:'center'}}>
                                            Tap the notification setting button below and check again.
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                                // borderColor:'#dd0000',borderWidth:2,
                                            backgroundColor: '#da7c3c',
                                            width:responsiveWidth(55),
                                             borderRadius:responsiveWidth(1.5),
                                            alignItems:'center',
                                            justifyContent:'center',
                                            marginBottom:responsiveHeight(7),
                                            marginTop:responsiveWidth(5),
                                            position:'absolute',
                                            bottom:responsiveWidth(12)
                                        }}
                                        onPress={()=>{
                                        this.props.navigation.navigate(Types.SETTINGS_SCREEN);
                                }}>
                                        <Text style={{
                                           fontSize:responsiveFontSize(1.9),
                                            color: '#fff',
                                            padding:responsiveWidth(3.9),
                                            textAlign: 'center',
                                            fontFamily:'Roboto-Regular'
                                        }}>{"Notification Settings"}</Text>
                                    </TouchableOpacity>
                                </View>
                            : null
                    }
                    {(this.state.isMoreLoaderVisible) ?
                        <View style={{position:'absolute',
                            //borderColor:'#dd0000',borderWidth:2,
                            bottom:responsiveWidth(5)
                        }}>
                            <ActivityIndicator size="large" color="#000"/>
                        </View>
                        : null}
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
                                             }}>Notifications</Text>
                                         </View>
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
    trailTour:state.trailTour
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);