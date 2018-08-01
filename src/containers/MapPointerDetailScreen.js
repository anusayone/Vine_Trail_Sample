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
    Linking,
    NetInfo
} from "react-native";
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
import MapView from "react-native-maps";
import {Marker} from "react-native-maps";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import ImageLoad from 'react-native-image-placeholder';
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

class MapPointerDetailScreen extends Component {
    static navigationOptions = {
        gesturesEnabled: false,
        header: null,
        tabBarLabel: () => (
            <Text style={{fontSize: responsiveFontSize(1.6)}}>Map</Text>
        ),
        tabBarIcon: () => (
            <View style={{alignItems: 'center', padding: responsiveWidth(2), justifyContent: 'center'}}>
                <Image
                    style={{width:responsiveHeight(2.5),height:responsiveHeight(2.5),resizeMode: 'contain'}}
                    source={require('../../assets/images/bottom_navigation_map_icon.png')}
                    resizeMode={'contain'}/>
            </View>
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            offers: [],
            activeSlide: 0,
            slider1Ref: false,
            duration: null,
            distance: '',
            netstatus:true,
            errortext:"No internet",
        }
    }

    onBackPress = (category) => {

        this.props.navigation.goBack();
        return true;
    };

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.getNetinfo();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }
    getData(){
        this.setState({
                    offers: this.props.navigation.state.params.poi_offers,
                    selectedRestaurant: this.props.navigation.state.params
                });
        let selectedRestaurant = this.props.navigation.state.params;
        console.log(selectedRestaurant);
        this.watchId = navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log("inside position in detail");
                        // this.currentLatitude = 38.267755;
                        //   this.currentLongitude = -122.28342500000001;
                        this.currentLatitude = position.coords.latitude;
                        this.currentLongitude = position.coords.longitude;
                        if (this.currentLatitude != null) {
                            let clatitude = this.currentLatitude;
                            let clongitude = this.currentLongitude;
                            let coordinates = selectedRestaurant.position.split(',');
                            this.props.getMarkerDistance(coordinates, clatitude, clongitude).then(() => {
                                this.setState({
                                    distance: this.props.explore.markerDistance["0"].elements["0"].distance.text,
                                    duration: this.props.explore.markerDistance["0"].elements["0"].duration.text
                                });
                            })
                        }
                    },
                    (error) => this.setState({locationError: error.message}),
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
    get pagination() {
        //const {slider1Ref} = this.state;
        return (
            <Pagination
                dotsLength={this.props.navigation.state.params.poi_offers.length>5
                                    ?5
                                    :this.props.navigation.state.params.poi_offers.length}
                activeDotIndex={this.state.activeSlide}
                containerStyle={{
                    marginBottom:responsiveHeight(11),
                    backgroundColor: 'transparent' ,
                    paddingTop:0,
                    paddingBottom:responsiveHeight(6),
                    marginTop:-responsiveHeight(7)
               }}
                dotContainerStyle={{
                     //borderWidth:2,borderColor:'#dd0000',
                      marginLeft:1,
                      marginRight:1,
                }}
                //dotColor='#000000'
                dotStyle={{
                      //borderWidth:2,borderColor:'#fff',
                      width: 15,
                      height: 15,
                      borderRadius: 45,
                      backgroundColor: '#000',
              }}
                inactiveDotStyle={{
                  width: 15,
                  height: 15,
                  borderRadius: 45,
                 // marginHorizontal: 8,
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

    renderOffers(item, index) {
        if (item.index < 5) {
            if ((item.index == 4 && this.state.offers.length !== 5)) {
                return (
                    <TouchableOpacity
                        onPress={() => {
                                //this.props.navigation.navigate(Types.HUNT_IMAGES_SCREEN);
                                }}>
                        <View style={{
                               borderWidth:1,borderColor:'#e9e9e9',
                               padding:5,
                                alignItems:'center',
                                justifyContent:'center'
                                }}>
                            <Image
                                style={{
                                    height:responsiveWidth(44),
                                    width:responsiveWidth(80),
                                    resizeMode: 'cover'}}
                                source={require('../../assets/images/hunt_dummy.png')}
                            />
                            <Image
                                style={{
                                  height:responsiveWidth(44),
                                   width:responsiveWidth(80),
                                   resizeMode: 'cover',
                                  position:'absolute',
                                  left:5,
                                 top:5}}
                                source={require('../../assets/images/hunt_overlay.png')}
                            />
                            <View style={{
                                      position:'absolute',
                                      alignItems:'center',
                                       justifyContent:'center'}}>
                                <Text style={{
                                      color:'#fff',
                                      textAlign:'center'}}>
                                    {'\n' + "more offers"}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            } else
                return (
                    <View style={{
                                borderWidth:1,borderColor:'#e9e9e9',
                                padding:5
                                }}>
                        <Image
                            style={{
                               height:responsiveWidth(44),
                               width:responsiveWidth(80),
                               resizeMode: 'cover'}}
                            source={{uri:item.item.banner_url}}
                        />
                    </View>
                )
        }
    }

    render() {
        let selectedRestaurant = this.props.navigation.state.params;
        let coordinates = selectedRestaurant.position.split(',');
        return (
            <View style={{
                alignItems: 'center',
                flex: 1,
                flexDirection: 'column',
                backgroundColor: '#fff',
            }}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.2)'} barStyle={'light-content'}/>
                <View style={{
                            height:responsiveHeight(40),
                            width:'100%',
                        }}>
                    <ImageLoad
                        style={{
                            height:responsiveHeight(40),
                            width:'100%',
                            position:'absolute'
                            }}
                        placeholderStyle={{height:responsiveHeight(40),
                                    width:'100%',
                                    position:'absolute'}}
                        placeholderSource={require('../../assets/images/placeholder_image.png')}
                        source={(selectedRestaurant.banner_url==null||selectedRestaurant.banner_url=='')?require('../../assets/images/placeholder_image.png'):{uri:selectedRestaurant.banner_url}}
                    />
                    <Image
                        style={{
                            height:responsiveHeight(40),
                            width:'100%',
                            resizeMode: 'cover',
                            position:'absolute'
                           }}
                        source={require('../../assets/images/background.png')}/>
                    <View style={{
                                width: '100%',
                                height: 68,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                //zIndex: 80,
                                flexDirection: 'row',
                                paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingLeft: 22.7,
                                paddingRight: 22.7,
                                backgroundColor: 'rgba(0,0,0,0.4)'
                            }}>
                        <TouchableOpacity
                            style={{
                                    position:'absolute',
                                    paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
                                    left:0,
                                   // borderColor:'#dd0000',borderWidth:2,
                                    height: 68,
                                    alignItems: 'center',
                                    justifyContent:'center',
                                    paddingLeft:responsiveWidth(3),
                                    paddingRight:responsiveWidth(3)}}
                            onPress={() => {
                                 this.onBackPress(selectedRestaurant.category.category)}}>
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
                                    }}>{selectedRestaurant.category.category}</Text>
                    </View>
                    {/*<View style={{*/}
                    {/*//borderColor:'#fff',borderWidth:1,*/}
                    {/*borderRadius:5,*/}
                    {/*backgroundColor:'#1da1f2',*/}
                    {/*paddingTop:5,*/}
                    {/*paddingRight:10,*/}
                    {/*paddingLeft:10,*/}
                    {/*paddingBottom:5}}>*/}
                    {/*<Text style={{color:'#fff'}}>{selectedRestaurant.poi_offers.length} OFFER</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{*/}
                    {/*//borderColor:'#fff',borderWidth:1,*/}
                    {/*borderRadius:5,*/}
                    {/*backgroundColor:'#ff70a8',*/}
                    {/*paddingTop:5,*/}
                    {/*paddingRight:10,*/}
                    {/*paddingLeft:10,*/}
                    {/*paddingBottom:5,*/}
                    {/*marginLeft:13}}>*/}
                    {/*<Text style={{color:'#fff'}}>{selectedRestaurant.poi_promotions.length} PROMOTION</Text>*/}
                    {/*</View>*/}
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.props.navigation.navigate(Types.MAP_DIRECTION_SCREEN,selectedRestaurant);
                                    }}>
                        <View style={{
                                borderRadius:5,
                                borderColor:'#fff',borderWidth:0.7,
                                padding:responsiveHeight(1),
                                position:'absolute',
                                right:responsiveHeight(4),
                                flexDirection:'row',
                                bottom:responsiveHeight(4)}}>
                            <Image
                                style={{
                                        height:responsiveHeight(2),
                                        width:responsiveHeight(2),
                                        resizeMode: 'cover'
                                    }}
                                source={require('../../assets/images/restaurants_page_get_direction_icon.png')}
                            />
                            <Text style={{
                                fontFamily:'Roboto-Regular',
                                fontSize:responsiveFontSize(1.3),
                                color:'#fff',
                                paddingLeft:responsiveWidth(2)}}>Directions</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView
                    bounces={false}
                    scrollEnabled={true}>
                    <View style={{
                        width:responsiveWidth(100),
                        marginBottom:responsiveWidth(7),

                    }}>
                        {/*marginTop:20*/}
                        <View style={{
                        width:responsiveWidth(100),
                    }}>
                            <Text style={{
                                paddingLeft:10,
                                fontFamily:'Roboto-Bold',
                                color:'#434586',
                                fontSize:responsiveFontSize(3),
                                paddingTop:responsiveHeight(1)}}
                                // ellipsizeMode='tail'
                                //numberOfLines={1}
                            >{selectedRestaurant.title}
                            </Text>
                            <Text style={{
                                paddingLeft:10,
                                fontFamily:'Roboto-Regular',
                                color:'#242425',
                                fontSize:responsiveFontSize(2.4),
                                paddingTop:4}}>Distance : {(this.state.distance != '') ? this.state.distance : "Not Available"}
                                {/*{(selectedRestaurant.distancee=='')?"Not Available":selectedRestaurant.distancee}*/}
                            </Text>
                            <Text style={{
                                paddingLeft:10,
                                fontFamily:'Roboto-Regular',
                                color:'#2a2a2a',
                                fontSize:responsiveFontSize(1.9),
                                paddingTop:6}}>{selectedRestaurant.description}
                            </Text>
                            <View style={{
                                alignItems:'center',justifyContent:'center'
                            }}>
                                <View style={{
                                    width:responsiveWidth(93),
                                    flexDirection:'row',
                                    marginTop:10,
                                }}>
                                    <View style={{
                                        flex:1,
                                    }}>
                                        <MapView
                                            provider={'google'}
                                            rotateEnabled={false}
                                            pitchEnabled={false}
                                            loadingBackgroundColor={'#DDDDDD'}
                                            cacheEnabled={false}
                                            loadingEnabled={true}
                                            showsUserLocation={false}
                                            followsUserLocation={false}
                                            scrollEnabled={false}
                                            zoomEnabled={false}
                                            onRegionChange={(region) => {
                                                //this.onRegionChange(region);
                                                }}
                                            region={{
                                            latitude: parseFloat(coordinates[0]),
                                            longitude: parseFloat(coordinates[1]),
                                            latitudeDelta: 0.8232713060681149,
                                            longitudeDelta: 0.7328086718917177
                                        }}
                                            style={styles.mapView}
                                            minZoomLevel={6}
                                            showsMyLocationButton={false}
                                            ref={(ref) => this.mapView = ref}>
                                            <Marker
                                                coordinate={{latitude: parseFloat(coordinates[0]),longitude: parseFloat(coordinates[1])}}
                                                image={{uri: selectedRestaurant.category.category_icon}}
                                            />
                                        </MapView>
                                    </View>
                                    <View style={{alignItems:'center',justifyContent:'center'}}>
                                        <Image
                                            style={{
                                           height:responsiveHeight(5),
                                           width:responsiveHeight(3),
                                           marginLeft:-responsiveHeight(3),
                                           marginRight:-responsiveHeight(2)
                                           }}
                                            source={require('../../assets/images/detail_page_triangle.png')}
                                        />
                                    </View>
                                    <View style={{
                                        flex:1,
                                        backgroundColor:'#252f39',
                                        justifyContent:'center',paddingTop:20,
                                        paddingBottom:20
                                    }}>
                                        <Text
                                            // ellipsizeMode='tail'
                                            // numberOfLines={1}
                                            style={{color:'#fff',paddingLeft:20,
                                            fontSize:responsiveFontSize(2)}}>{selectedRestaurant.title}</Text>
                                        <Text style={{color:'#fff',paddingLeft:20,
                                        fontSize:responsiveFontSize(1.5)}}>{selectedRestaurant.address}</Text>
                                        {(selectedRestaurant.website.length > 0)
                                            ? <View
                                                style={{
                                                marginRight:6,
                                                flexDirection:'row',
                                                paddingLeft:20,
                                                alignItems:'center',
                                                marginTop:10,
                                                //borderColor:'#dd0000',borderWidth:2
                                                }}>
                                                <Image
                                                    style={{
                                                   height:responsiveWidth(2.2),
                                                   width:responsiveWidth(2.2),
                                                   resizeMode: 'cover'
                                                   }}
                                                    source={require('../../assets/images/detail_page_globe_icon.png')}
                                                />
                                                <Text
                                                    style={{color:'#fff',
                                                paddingLeft:responsiveWidth(2),
                                                paddingRight:responsiveWidth(2),
                                                textDecorationLine:'underline'}}
                                                    ellipsizeMode='tail'
                                                    numberOfLines={1}
                                                    onPress={() => {
                                                    if(this.state.netstatus){
                                                    console.log("net status true")
                                                    if(selectedRestaurant.website.length>0){
                                                        Linking.openURL(selectedRestaurant.website)
                                                    }
                                                    }else{
                                                      console.log("net status false")
                                                         Toast.show("Turn on Mobile data");
                                                     }
                                                    }}>
                                                    {"Website"}
                                                </Text>
                                            </View>
                                            : null
                                        }
                                        {(selectedRestaurant.phone !== null && selectedRestaurant.phone.length > 0)
                                            ? <View style={{flexDirection:'row',paddingLeft:20,alignItems:'center',
                                        paddingTop:responsiveWidth(3)}}>
                                                <Image
                                                    style={{
                                                   height:responsiveWidth(2.2),
                                                   width:responsiveWidth(2.2),
                                                   resizeMode: 'cover'
                                                   }}
                                                    source={require('../../assets/images/detail_page_phone_icon.png')}
                                                />
                                                <Text
                                                    style={{color:'#fff',
                                                paddingLeft:10,
                                                paddingRight:responsiveWidth(2),
                                                textDecorationLine:'underline'}}
                                                    ellipsizeMode='tail'
                                                    numberOfLines={1}
                                                    onPress={() => {
                                                    if(selectedRestaurant.phone.length>0){
                                                    Linking.openURL('tel:'+selectedRestaurant.phone)
                                                }}}>
                                                    {"Call"}
                                                </Text>
                                            </View>
                                            : null}
                                    </View>
                                </View>
                            </View>
                        </View>
                        {(this.state.offers.length > 0 && false)
                            ? <View style={{alignItems:'center',
                                      flex:1
                                            }}>
                                <View style={{
                                alignItems:'center',
                                justifyContent:'center',
                                paddingTop:responsiveHeight(5),
                                marginBottom:responsiveHeight(3),
                                backgroundColor:'#fff',
                                 width:responsiveWidth(100)
                                 }}>
                                    <Text style={{
                                    color:'#333333',
                                    fontSize:responsiveFontSize(2.5),
                                    fontFamily:'Roboto-Light'
                                    }}>
                                        OFFERS
                                    </Text>
                                </View>
                                <View style={{
                                      alignItems:'center',
                                        }}>
                                    <Carousel
                                        ref={(c) => { if (!this.state.slider1Ref) { this.setState({ slider1Ref: c }); } }}
                                        data={this.state.offers}
                                        renderItem={(item,index)=>this.renderOffers(item,index)}
                                        sliderWidth={responsiveWidth(100)}
                                        itemWidth={responsiveWidth(80)}
                                        itemHeight={responsiveWidth(44)}
                                        onSnapToItem={(index) => this.setState({ activeSlide: index })}/>
                                    { this.pagination }
                                </View>
                            </View>
                            : <View></View>
                        }
                    </View>
                </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(MapPointerDetailScreen);
