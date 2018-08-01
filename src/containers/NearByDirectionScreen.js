import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    Animated,
    BackHandler,
    Easing,
    Image,
    ImageBackground,
    Keyboard,
    PermissionsAndroid,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Toast from "react-native-simple-toast";
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import MapView from "react-native-map-clustering";
import {Callout, Marker} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {MAP_API_KEY} from "../constants/common";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../helpers/Responsive";
import ClusterMarker from "../components/ClusterMarker";
import {
    DEFAULT_LATITUDE,
    DEFAULT_LATITUDE_DELTA,
    DEFAULT_LONGITUDE,
    DEFAULT_LONGITUDE_DELTA,
    SELECTED_LATITUDE_DELTA,
    SELECTED_LONGITUDE_DELTA,
    SELECTED_MARKER_OFFSET,
    MAP_STYLE
} from "../constants/location";

const styles = StyleSheet.create({
    containerView: {
        ...StyleSheet.absoluteFillObject,
        // justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#DDDDDD'
    },
    mapView: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        left: 0,
        top: 68
    },
    marker: {
        width: 20,
        height: 20
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
        paddingLeft: 22.7
    },
    toolbarMenuIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain'
    },
    toolbarNapaIcon: {
        width: responsiveWidth(25),
        height: responsiveFontSize(5),
        resizeMode: 'contain',
        marginLeft: responsiveWidth(3)
    },
    exploreSearchBarBackgroundImage: {
        width: 325.7,
        height: 39,
    },
    exploreSearchBarFirstIcon: {
        width: 11.3,
        height: 11.3,
        margin: 10,
        resizeMode: 'contain'
    },
    exploreSearchBarSearchIcon: {
        width: 11.3,
        height: 11.3,
        resizeMode: 'contain',
        margin: 10,
    },
    toolbarNapaIconView: {
        flex: 1,
        marginLeft:responsiveWidth(5)
    },
});

class NearByDirectionScreen extends Component {
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
        this.filterModalTop = new Animated.Value(responsiveHeight(100));
        this.markerRefs = [];
        this.searchTimeOutId = null;
        this.getPoiTimeOutId = null;
        this.state = {
            currentRegion: {
                latitude: DEFAULT_LATITUDE,
                longitude: DEFAULT_LONGITUDE,
                latitudeDelta: DEFAULT_LATITUDE_DELTA,
                longitudeDelta: DEFAULT_LONGITUDE_DELTA
            },
            currentLatitude: null,
            currentLongitude: null,
            selectedPointOfInterest: null,
            locationError: null,
            locationTimeOut: 1000 * 60 * 60,
            distance: '',
            duration: '',
            isShowingDirections: false

        }
    }

    onBackPress = () => {
        this.props.navigation.goBack();
        if (this.state.isShowingDirections) {
                     this.setState({isShowingDirections: false});
              } else {

                    }
        return true;
    };

    checkLocationPermission() {
        if (Platform.OS === 'android') {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((hasLocationPermission) => {
                console.log('Does app already have location permission: ' + hasLocationPermission);
                if (hasLocationPermission) {
                    return true
                } else {
                    this.requestLocationPermission().then((locationPermission) => {
                        if (locationPermission) {
                            console.log('Did app get location permission: ' + hasLocationPermission);
                            return true;
                        } else {
                            console.log('Did app get location permission: ' + hasLocationPermission);
                            return false;
                        }
                    });
                }
            });
        } else {
            return false;
        }
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Access',
                    'message': 'Vine Trail will need to access your location to function properly. Please click allow in the next prompt'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location");
                return true;
            } else {
                console.log("Location permission denied");
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }

    componentDidMount() {
        console.log(this.props);
        Keyboard.dismiss();
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.checkLocationPermission();
        let poi = this.props.navigation.state.params
        let coordinates = poi.position.split(',');
        this.setState({selectedPointOfInterest: this.props.navigation.state.params,
            currentRegion: {
                latitude: poi.clatitude,
                longitude: poi.clongitude,
                latitudeDelta: 0.05069002275045875,
                longitudeDelta: 0.03959711641073227
            }});
        this.watchId = navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    currentLatitude: position.coords.latitude,
                  currentLongitude  : position.coords.longitude,
                    // currentLatitude: 38.180750441694805,
                    // currentLongitude: -122.28198878467083,
                    locationError: null,
                });
                this.renderDirections();
            },

            (error) => {this.setState({locationError: error.message})
                Toast.show('Location not available');
            },
            {enableHighAccuracy: false, timeout: this.state.locationTimeOut, maximumAge: 600000, distanceFilter: 10},
        );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        navigator.geolocation.clearWatch(this.watchId);
    }

    renderMarkers() {
        if (this.state.selectedPointOfInterest) {
            let poi = this.state.selectedPointOfInterest
            let coordinates = poi.position.split(',');
            this.setState({
                isShowingDirections: true});
            return (
                <Marker
                    key={poi.id}
                    image={{uri: poi.category.category_icon}}
                    coordinate={{latitude: parseFloat(coordinates[0]), longitude: parseFloat(coordinates[1])}}
                    ref={(ref) => this.markerRefs['poi_' + poi.id] = ref}
                    onPress={() => {
                            }}>
                </Marker>
            )
        } else {
            return [];
        }
    }

    moveToMarker(latitude, longitude, offset = 0) {
        if (latitude && longitude) {
            let marker = {
                latitude: latitude + offset,
                longitude: longitude,
                latitudeDelta: SELECTED_LATITUDE_DELTA,
                longitudeDelta: SELECTED_LONGITUDE_DELTA
            };
            this.mapView._root.animateToRegion(marker, 1000);
        }
    }

    renderDirections() {
        console.log("inside render direction");
        if (this.state.isShowingDirections && this.state.currentLatitude!=null) {
            let renderedDirection = [];
            let poi=this.state.selectedPointOfInterest;
            let coordinates = poi.position.split(',');
            renderedDirection = renderedDirection.concat(
                <MapViewDirections
                    key={'directions'}
                    origin={{latitude: this.state.currentLatitude, longitude: this.state.currentLongitude}}
                    destination={{latitude: parseFloat(coordinates[0]), longitude: parseFloat(coordinates[1])}}
                    apikey={MAP_API_KEY}
                    onReady={(result) => {
                                this.mapView._root.fitToCoordinates(result.coordinates, {
                                  edgePadding: {
                                                  right: ( 100),
                                                  bottom: ( 20),
                                                  left: (20),
                                                  top: ( 100),
                                                }
                                });
                              }}
                    onError={(errorMessage) => {
                                // console.log('GOT AN ERROR');
                              }}
                    strokeWidth={5}
                    strokeColor="#00BFFF"
                />
            );
            renderedDirection = renderedDirection.concat(
                <Marker
                    image={{uri: this.state.selectedPointOfInterest.category.category_icon}}
                    key={'selected_poi'}
                    title={this.state.selectedPointOfInterest.title}
                    coordinate={{latitude: parseFloat(coordinates[0]), longitude: parseFloat(coordinates[1])}}/>
            );
            return renderedDirection;
        } else {
            //Toast.show('Location not available');
            return [];
        }
    }

    renderMapContent() {
        if (this.state.isShowingDirections) {
            return this.renderDirections();
        } else {
            return this.renderMarkers();
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: '#DDDDDD'
            }}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                <View style={styles.toolbarView}>
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
                            paddingRight:responsiveWidth(3),}}
                        onPress={() => {
                                 this.onBackPress()}}>
                        <Image
                            style={styles.toolbarMenuIcon}
                            source={require('../../assets/images/back_icon.png')}/>
                    </TouchableOpacity>
                    <View style={styles.toolbarNapaIconView}>
                        <Image
                            style={styles.toolbarNapaIcon}
                            source={require('../../assets/images/napa_valley_logo.png')}
                        />
                    </View>
                </View>
                <TouchableWithoutFeedback
                    onPress={() => {
                    }}>
                    <MapView
                        provider={'google'}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        loadingBackgroundColor={'#DDDDDD'}
                        cacheEnabled={true}
                        loadingEnabled={true}
                        showsUserLocation={true}
                        followsUserLocation={false}
                        region={this.state.currentRegion}
                        style={styles.mapView}
                        minZoomLevel={8}
                        showsMyLocationButton={false}
                        moveOnMarkerPress={false}
                        customMapStyle={MAP_STYLE}
                        ref={(ref) => this.mapView = ref}>
                        {this.renderMapContent()}
                    </MapView>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav,
    explore: state.explore,
    session: state.session
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NearByDirectionScreen);
