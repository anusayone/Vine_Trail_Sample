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
        backgroundColor: '#fff'
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});

class NearByWineries extends Component {

    static navigationOptions = {
        gesturesEnabled: false,
        header: null,
        tabBarLabel: () => (
            <Text style={{fontSize: responsiveFontSize(1.6)}}>Nearby</Text>
        ),
        tabBarIcon: () => (<View style={{alignItems: 'center', padding: responsiveWidth(2), justifyContent: 'center'}}>
            <Image
                style={{width:responsiveHeight(2.5),height:responsiveHeight(2.5),resizeMode: 'contain'}}
                source={require('../../assets/images/bottom_navigation_nearby_icon.png')}
                resizeMode={'contain'}/>
        </View>)
    }

    constructor(props) {
        super(props);
        this.distance = null;
        this.duration = null;
        this.currentLatitude = '';
        this.currentLongitude = '';
        this.searchTimeOutId=null;
        this.state = {
            distance: '',
            duration: '',
            restaurants: [],
            isRestaurantsAvailable: false,
            currentLatitude: null,
            currentLongitude: null,
            isDistanceAvailable: false,
            locationError: null,
            locationTimeOut: 1000 * 60 * 60,
            isSearchBarVisible: false,
            searchTerm:'',
            pointsOfInterest:[],
            isSearchResultVisible:false,
            isMoreLoaderVisible:false,
            netstatus: true,
            errortext: "No internet"
        }
    }

    onBackPress = () => {
        this.props.navigation.goBack();
        //this.props.navigation.navigate(Types.DASHBOARD);
        return true;
    };
    getData(){
       this.watchId = navigator.geolocation.getCurrentPosition(
                   (position) => {
                       // this.currentLatitude = 38.267755;
                       // this.currentLongitude = -122.28342500000001;
                       this.currentLatitude= position.coords.latitude;
                       this.currentLongitude= position.coords.longitude;
                       if (this.currentLatitude != '') {
                           this.props.getMoreRestaurants(19, this.currentLatitude, this.currentLongitude).then(() => {
                               this.setState({
                                   restaurants: this.props.restaurants.restaurants.results,
                                   isRestaurantsAvailable: true
                               });
                           });
                       }
                       else {
                           Toast.show('Location not Available')
                       }
                   },
                   (error) => {this.setState({locationError: error.message})
                       Toast.show('Location not Available')
                   },
                   {
                       enableHighAccuracy: false,
                       timeout: this.state.locationTimeOut,
                       maximumAge: 600000,
                       distanceFilter: 10
                   },
               );
    }
    getNetinfo(){
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
              this.setState({netstatus: isConnected });
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
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.getNetinfo();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        navigator.geolocation.clearWatch(this.watchId);
    }

    POIPressed(item) {
        this.props.navigation.navigate(Types.NEARBY_DETAIL_SCREEN, item)
    }

    onSelectedPOI(item) {
        this.props.navigation.navigate(Types.NEARBY_DETAIL_SCREEN, item);
    }

    fetchMoreRestaurants() {
        if (this.props.restaurants.restaurants.next) {
            this.setState({
                isMoreLoaderVisible: true
            });
            this.props.getMoreRestaurants(19, this.currentLatitude, this.currentLongitude, true).then(() => {
                this.setState({
                    restaurants: this.props.restaurants.restaurants.results,
                    isRestaurantsAvailable: true,
                    isMoreLoaderVisible:false
                });
            })
        }
    }

    searchPoi(term) {
        this.setState({searchTerm: term});
        if (this.searchTimeOutId)
            clearTimeout(this.searchTimeOutId);

        let that = this;
        this.searchTimeOutId = setTimeout(() => {
            if (term.length > 2) {
                that.props.getCategorySearchResults(19,term).then(() => {
                    if (that.props.restaurants && that.props.restaurants.categorySearchResult) {
                        this.setState({
                            pointsOfInterest: that.props.restaurants.categorySearchResult,
                            isSearchResultVisible:true
                        });
                    }
                });
            }
        }, 1000);
    }

    clearPoiSearch() {
        console.log("inside clear poi search");
        this.setState({
            searchTerm: '',
            pointsOfInterest:[]
        });
    }

    onSearchItemSelected(selectedPOI) {
        Keyboard.dismiss();
        this.setState({
            isSearchResultVisible:false,
            searchTerm:'',
            isSearchBarVisible:false
        });
        this.props.navigation.navigate(Types.NEARBY_DETAIL_SCREEN, selectedPOI);
    }

    render() {
        let restaurants = this.props.restaurants.restaurants.results;
                let lastDistance;
                if(restaurants&&this.props.explore.wineriesDistance[restaurants[2].id]){
                if(this.props.explore.wineriesDistance[restaurants[2].id]["0"].elements["0"].status=='OK'){
                                 lastDistance="more than "+this.props.explore.wineriesDistance[restaurants[2].id]["0"].elements["0"].distance.text;
                                 //console.log(this.props.explore.distance[restaurants[2].id]["0"].elements["0"].distance.text)
                                }else{
                                //console.log("hhh")
                                lastDistance=this.props.explore.wineriesDistance[restaurants[2].id]["0"].elements["0"].status;
                                }
                                }else{
                                //console.log("l")
                                }
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
                        }}>Wineries</Text>
                        <TouchableOpacity
                            style={{
                                position:'absolute',
                                paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
                                right:0,
                                //borderColor:'#dd0000',borderWidth:2,
                                height: 68,
                                alignItems: 'center',
                                justifyContent:'center',
                                paddingRight:responsiveWidth(5)
                            }}
                            onPress={() => {
                                if(this.state.isSearchBarVisible){
                                    this.setState({
                                        isSearchBarVisible:false
                                    });
                                    Keyboard.dismiss();
                                    this.clearPoiSearch();
                                }else{
                                    this.setState({
                                        isSearchBarVisible:true
                                    });
                                }
                            }}>
                            <Image
                                style={styles.toolbarNotificationIcon}
                                source={(this.state.isSearchBarVisible)
                                    ?require('../../assets/images/close_icon.png')
                                    :require('../../assets/images/restaurant_page_search_icon.png')}/>
                        </TouchableOpacity>
                    </View>
                    {/*<TouchableOpacity>*/}
                    {/*<Image*/}
                    {/*style={styles.toolbarFilterIcon}*/}
                    {/*source={require('../../assets/images/restaurant_page_filter_icon.png')}/>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                <View style={styles.contentView}>
                    <View style={{
                        width:responsiveWidth(100),
                        height:(this.state.isSearchBarVisible)?responsiveHeight(8):0,
                        backgroundColor: '#252f39',
                        alignItems:'center',
                        justifyContent:'center',
                        //borderColor:'#dd0000',borderWidth:2
                    }}>
                        <View style={{
                            justifyContent: 'center',
                            height:responsiveHeight(6),
                            width: responsiveWidth(90),
                            backgroundColor: '#fff',
                            flexDirection:'row',
                            alignItems:'center',
                        }}>
                            <TextInput
                                style={{
                                    flex: 1,
                                    textAlignVertical: 'center',
                                    fontSize: 12,
                                    paddingLeft:responsiveWidth(5),
                                    height:(this.state.isSearchBarVisible)?responsiveHeight(6):0,
                                }}
                                value={this.state.searchTerm}
                                ref={(ref) => this.searchInput = ref}
                                onChangeText={(term) => {
                                    if(term.length===0){
                                        this.clearPoiSearch();
                                    }
                                    this.searchPoi(term);
                                }}
                                placeholder='Search by name'
                                underlineColorAndroid={'transparent'}>
                            </TextInput>
                            <TouchableOpacity onPress={() => {

                            }}>
                                <Image
                                    style={{
                                        width: 15,
                                        height:(this.state.isSearchBarVisible)?15:0,
                                        marginRight:responsiveWidth(3)}}
                                    source={ require('../../assets/images/search_icon.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        width:responsiveWidth(90),
                        alignItems:'center',
                        justifyContent:'center',
                        position:'absolute',
                        zIndex:20,
                        backgroundColor: '#fff',
                        marginTop:(this.state.isSearchBarVisible)?responsiveHeight(7):0,
                        //borderColor:'#dd0000',borderWidth:2
                    }}>
                        {
                            (this.state.searchTerm.length>2&&this.state.isSearchResultVisible&&this.state.pointsOfInterest&& this.state.isSearchBarVisible)?
                                <SearchResult
                                    onSelectedItem={(selectedItem) => this.onSearchItemSelected(selectedItem)}
                                    searchResults={this.state.pointsOfInterest}
                                />
                                : null
                        }
                    </View>

                    {
                        (this.state.isRestaurantsAvailable)
                            ? <FlatList
                                data={restaurants}
                                bounces={false}
                                renderItem={({item,index}) =>
                                    <POIComponent
                                        item={item}
                                        distance={(this.props.explore.wineriesDistance[item.id]&&this.props.explore.wineriesDistance[item.id]["0"].elements["0"].status=='OK')
                                                         ?this.props.explore.wineriesDistance[item.id]["0"].elements["0"].distance.text
                                                        :(lastDistance)
                                                        ?lastDistance
                                                        :''}
                                        onSelectedItem={() => this.onSelectedPOI(item)}
                                    />}
                                //keyExtractor={(item, index) => 'r'+item.id.toString()}
                                onEndReached={()=>{
                                    this.fetchMoreRestaurants();
                                }}
                                onEndReachedThreshold={0.6}
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
                    {(this.state.isMoreLoaderVisible) ?
                        <View style={{position:'absolute',
                            //borderColor:'#dd0000',borderWidth:2,
                            bottom:responsiveWidth(5)
                        }}>
                            <ActivityIndicator size="large" color="#000"/>
                        </View>
                        : null}
                </View>
            </View>
            :<View style={{ ...StyleSheet.absoluteFillObject,
                                                                                                                   justifyContent: 'center',
                                                                                                                   alignItems: 'center',
                                                                                                                   flex: 1,
                                                                                                                   flexDirection: 'column',
                                                                                                                   backgroundColor: '#DDDDDD'
                                                                                                                   }}>
                      <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                      <View style={{ width: '100%',
                        height: 68,
                        backgroundColor: '#252f39',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        flexDirection: 'row',
                        paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
                        alignItems: 'center',
                        justifyContent: 'center',
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
                                            style={{width: 18,
                                                    height: 18,
                                                    resizeMode: 'contain'}}
                                            source={require('../../assets/images/back_icon.png')}/>
                                    </TouchableOpacity>

                                    <Text style={{color: '#fff',
                                    fontSize: responsiveFontSize(2.1),
                                    fontFamily: 'Roboto-Medium',
                                    justifyContent:'center',
                                    alignItems: 'center',
                                   // position:'absolute',
                                    }}>Wineries</Text>

                                              </View>
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
        )
    }
}

const mapStateToProps = (state) => ({
    bottomnavigator: state.bottomnavigator,
    session: state.session,
    user: state.user,
    hunt: state.hunt,
    restaurants: state.restaurants,
    explore: state.explore
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NearByWineries);
