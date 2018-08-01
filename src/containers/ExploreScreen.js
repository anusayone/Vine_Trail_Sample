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
    View,
    ActivityIndicator,
    NetInfo
} from "react-native";
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import MapView from "react-native-maps";
import {Callout, Marker} from "react-native-maps";
import  {Polyline}  from 'react-native-maps';
import MapViewDirections from "react-native-maps-directions";
import CustomMarkerCallout from "../components/CustomMarkerCallout";
import SearchResult from "../components/SearchResult";
import MapLegend from "../components/MapLegend";
import {MAP_API_KEY} from "../constants/common";
import Toast from "react-native-simple-toast";
import {responsiveHeight, responsiveFontSize, responsiveWidth} from "../helpers/Responsive";
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
        paddingLeft: responsiveWidth(4),
        paddingRight: responsiveWidth(4)
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
        marginLeft: responsiveWidth(0)
    },
    exploreSearchBarBackgroundImage: {
        width: responsiveWidth(90),
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
        flex: 1
    },
});

class ExploreScreen extends Component {

    static navigationOptions = {
        gesturesEnabled: false,
        header: null,
        tabBarLabel: () => (
            <Text style={{fontSize:responsiveFontSize(1.6)}}>Map</Text>
        ),
        tabBarIcon: () => (
            <View style={{alignItems: 'center', padding: responsiveWidth(2), justifyContent: 'center'}}>
                <Image
                    style={{width:responsiveHeight(2.5),height:responsiveHeight(2.5),resizeMode: 'contain'}}
                    source={require('../../assets/images/bottom_navigation_map_icon.png')}
                    resizeMode={'contain'}/>
            </View>
        )
    };

    constructor(props) {
        super(props);
        this.currentLatitude = null;
        this.currentLongitude = null;
        this.filterModalTop = new Animated.Value(responsiveHeight(100));
        this.markerRefs = [];
        this.shouldShowCallout = false;
        this.shouldCalculateDistance = false;
        this.searchTimeOutId = null;
        this.getPoiTimeOutId = null;
        this.distance = '';
        this.duration = '';
        this.markerPressedPoi = '';
        this.currentRegion = {
            latitude: 38.3525762274876,
            longitude: -122.37586190924048,
            latitudeDelta: 0.47025514851385,
            longitudeDelta: 0.46127725392581453
        };
        this.shouldCallAPI = true;
        this.state = {
            poiCategories: [],
            pointsOfInterest: [],
            currentLatitude: null,
            currentLongitude: null,
            selectedPointOfInterest: null,
            locationError: null,
            locationTimeOut: 1000 * 60 * 60,
            filterModalVisible: false,
            selectedCategoryIds: '',
            searchTerm: '',
            distance: '',
            duration: '',
            selectedLatitudeDelta: SELECTED_LATITUDE_DELTA,
            selectedLongitudeDelta: SELECTED_LONGITUDE_DELTA,
            selectedLatitude: '',
            selectedLongitude: '',
            coordinatePoints: [],
            isSearchBarVisible: true,
            isCoordinatePointsAvailable: false,
            firstCoordinateArray: [],
            isDistanceAvailable: false,
            isFilteredPOIAvailable: true,
            netstatus: true,
            errortext: "No internet"

        }
    }

    onBackPress = () => {
        this.props.navigation.navigate(Types.DASHBOARD);
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

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        navigator.geolocation.clearWatch(this.watchId);
    }

    openFilterModal() {
        Keyboard.dismiss();
        if (this.state.isSearchBarVisible) {
            this.searchInput.clear();
        }
        if (!this.state.filterModalVisible) {
            this.setState({filterModalVisible: true});
            this.filterModalTop.setValue(responsiveHeight(100));
            Animated.parallel([
                Animated.timing(
                    this.filterModalTop,
                    {
                        toValue: responsiveHeight(100) - responsiveHeight(47.5) - 55.5,
                        duration: 600,
                        easing: Easing.cubic
                    }
                ),
            ]).start(() => {
            });
        }
    }

    closeFilterModal() {
        if (this.state.filterModalVisible) {
            this.filterModalTop.setValue(responsiveHeight(100) - responsiveHeight(47.5) - 56);
            Animated.parallel([
                Animated.timing(
                    this.filterModalTop,
                    {
                        toValue: responsiveHeight(100),
                        duration: 600,
                        easing: Easing.cubic
                    }
                ),
            ]).start(() => {
                this.setState({filterModalVisible: false});
            });
        }
    }

    searchPoi(trimedTerm, term) {
        this.setState({searchTerm: term});
        if (this.searchTimeOutId)
            clearTimeout(this.searchTimeOutId);

        let that = this;
        this.searchTimeOutId = setTimeout(() => {
            if (trimedTerm.length > 2 && this.state.netstatus) {
                that.props.getSearchResults(trimedTerm).then(() => {
                    if (that.props.explore && that.props.explore.pointsOfInterest) {
                        this.setState({
                            pointsOfInterest: that.props.explore.pointsOfInterest.results
                        });
                    }
                });
            }
        }, 1000);
    }

    clearPoiSearch() {
        this.setState({
            searchTerm: '',
            pointsOfInterest: [],
            selectedPointOfInterest: null
        });

    }

    onCategorySelect(categories) {
        if (this.state.netstatus) {
            if (this.state.filterModalVisible) {
                this.closeFilterModal();
            }
            this.setState({
                isFilteredPOIAvailable: false
            });
            this.setState({selectedPointOfInterest: null});
            let categoryIds = categories.id;
            let that = this;
            that.props.getFilteredPoi(categoryIds).then(() => {
                if (that.props.explore.pointsOfInterest.results.length == 0) {
                    Toast.show('No Point of Interests Available')
                }
                let marker2 = {
                    latitude: 38.3525762274876,
                    longitude: -122.37586190924048,
                    latitudeDelta: 0.47007415117811036,
                    longitudeDelta: 0.4612772539258003
                };
                this.mapView.animateToRegion(marker2, 1000);
                this.setState({
                    searchTerm: '',
                    isFilteredPOIAvailable: true,
                    pointsOfInterest: that.props.explore.pointsOfInterest.results
                });
            });

            // // categories.map((category) => {
            // //     categoryIds = categoryIds.concat(category.id);
            // // });
            // this.setState({selectedCategoryIds: categoryIds});
            // if (this.getPoiTimeOutId)
            //     clearTimeout(this.getPoiTimeOutId);
            // let that = this;
            // this.getPoiTimeOutId = setTimeout(() => {
            //     that.props.getFilteredPoi(categoryIds).then(() => {
            //         if (that.props.explore && that.props.explore.pointsOfInterest) {
            //             this.setState({
            //                 isFilteredPOIAvailable: true,
            //                 pointsOfInterest: that.props.explore.pointsOfInterest.results
            //             });
            //         }
            //     });
            // }, 1000);
        }

    }

    onSearchItemSelected(selectedPOI) {
        // this.setState({
        //     searchTerm: '',
        //     pointsOfInterest: [],
        //     selectedPointOfInterest: null
        // });
        this.setState({
            selectedPointOfInterest: selectedPOI,
            searchTerm: selectedPOI.title
        });
        let coordinates = selectedPOI.position.split(',');
        this.moveToMarker(parseFloat(coordinates[0]), parseFloat(coordinates[1]), SELECTED_MARKER_OFFSET, selectedPOI);
    }

    moveToMarker(latitude, longitude, offset = 0, poi = null) {
        if (latitude && longitude) {
            console.log("mooooveee");
            let marker = {
                latitude: latitude + offset,
                longitude: longitude,
                latitudeDelta: SELECTED_LATITUDE_DELTA,
                longitudeDelta: SELECTED_LONGITUDE_DELTA
            };
            this.mapView.animateToRegion({
                latitude: latitude + 0.00094331018,
                latitudeDelta: 0.05878426746144072,
                //latitudeDelta:0.05878426746144072,
                longitude: longitude,
                longitudeDelta: 0.05226787179709902,
                //longitudeDelta:0.05226787179709902,

            }, 1000);
            // if(poi){
            //     setTimeout(()=>{
            //         this.markerRefs['poi_' + poi.id].showCallout();
            //     },1100);
            // }
        }
    }

    moveToCurrentPosition(latitude, longitude, offset = 0) {
        //  console.log("moveToCurrentPosition");
        if (latitude && longitude) {
            let marker = {
                latitude: latitude + offset,
                longitude: longitude,
                latitudeDelta: SELECTED_LATITUDE_DELTA,
                longitudeDelta: SELECTED_LONGITUDE_DELTA
            };
            this.mapView.animateToRegion(marker, 1000);
        }
    }

    markerPressed(latitude, longitude, offset = 0, poi = null) {
        // this.markerPressedPoi = poi;
        // if (latitude && longitude) {
        //     let marker = {
        //         latitude: latitude + offset,
        //         longitude: longitude,
        //         latitudeDelta: SELECTED_LATITUDE_DELTA,
        //         longitudeDelta: SELECTED_LONGITUDE_DELTA
        //     };
        //     this.mapView.animateToRegion(marker, 2000)
        // }
        //this.shouldShowCallout = true;
    }

    mapRegionChanged(region) {
        console.log(region);
        //let northEast={longitudeDelta: 0.46125244349239836, latitudeDelta: 0.46615494881811514, longitude: -122.00510585680604, latitude: 38.975738928342246}
        // let southWest={longitudeDelta: 0.4612772539258003, latitudeDelta: 0.47064992746648215, longitude: -122.43938533589245, latitude: 38.29174563577039}
        // this.mapView.setMapBoundaries(northEast,southWest);
        // this.currentRegion = {
        //     latitude: region.latitude,
        //     longitude: region.longitude,
        //     latitudeDelta: region.latitudeDelta,
        //     longitudeDelta: region.longitudeDelta
        // };
    }

    renderDatas() {
        let k;
        //  let color = ['#dd0000', '#000000', '#02b643', '#dd0000', '#000000', '#4bb7dd'];
        let renderedData = [];
        if (this.state.pointsOfInterest || this.state.selectedPointOfInterest && this.state.netstatus) {
            let pointsOfInterest = this.state.selectedPointOfInterest ? [this.state.selectedPointOfInterest] : this.state.pointsOfInterest;
            pointsOfInterest.clatitude = this.currentLatitude;
            pointsOfInterest.clongitude = this.currentLongitude;
            renderedData = renderedData.concat(
                pointsOfInterest.map((poi) => {
                    poi.clatitude = this.currentLatitude;
                    poi.clongitude = this.currentLongitude;
                    let coordinates = poi.position.split(',');
                    return (
                        <Marker
                            key={poi.id}
                            //title={poi.title}
                            image={(Platform.OS!='android')?null
                            :(Platform.OS=='android'&&Platform.Version>23)?
                                    {uri: poi.category.category_icon,}
                            :null}
                            coordinate={{latitude: parseFloat(coordinates[0]), longitude: parseFloat(coordinates[1])}}
                            ref={(ref) => this.markerRefs['poi_' + poi.id] = ref}
                            onCalloutPress={()=>{
                            //this.props.navigation.navigate(Types.MAP_POINTER_DETAIL_SCREEN,poi)
                            }}
                            onPress={() => {
                                    //this.markerPressed(parseFloat(coordinates[0]), parseFloat(coordinates[1]), SELECTED_MARKER_OFFSET,poi);
                                   }}>
                            {(Platform.OS!='android')?
                            <Image
                                  style={{
                                      width:responsiveWidth(14),
                                      height:responsiveWidth(14),
                              //borderColor:'#dd0000',borderWidth:2
                              }}
                                  source={{uri: poi.category.category_icon}}/>
                            :(Platform.OS=='android'&&Platform.Version<=23)
                                ?<Image
                                    style={{
                                        width:responsiveWidth(14),
                                        height:responsiveWidth(14),
                                //borderColor:'#dd0000',borderWidth:2
                                }}
                                    source={{uri: poi.category.category_icon}}/>
                                :null
                            }

                            <Callout
                                onPress={() => {
                                   // console.log(Platform.Version);
                                this.props.navigation.navigate(Types.MAP_POINTER_DETAIL_SCREEN,
                                                               poi
                                                               )
                            }}>
                                <View style={{
                                alignItems:'center',
                                minWidth:responsiveWidth(45),
                                maxWidth:responsiveWidth(90),
                               // padding:responsiveWidth(3),
                                //borderColor:'#dd0000',borderWidth:2,
                                flex:1
                                //margin:responsiveWidth(2)
                            }}>
                                    <Text style={{textAlign:'center',
                            padding:responsiveWidth(3),
                           fontFamily:'Roboto-Bold'
                            }}>{poi.title}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    )
                })
            );
        }
        if (this.state.isCoordinatePointsAvailable && this.state.netstatus) {
            let firstCoordinateSet = [];
            let coordinatePoints = this.props.explore.coordinates;

            renderedData = renderedData.concat(
                coordinatePoints.map((points, index) => {
                    firstCoordinateSet = points.coordinates;
                    firstCoordinateSet.color = points.color;
                    let firstCoordinateArray = [];
                    for (k = 0; k < firstCoordinateSet.length; k++) {
                        firstCoordinateArray.color = points.color;
                        firstCoordinateArray = firstCoordinateArray.concat([{
                            latitude: parseFloat(firstCoordinateSet[k][1]),
                            longitude: parseFloat(firstCoordinateSet[k][0])
                        }])
                    }
                    return (
                        <Polyline
                            key={firstCoordinateArray.length}
                            coordinates={firstCoordinateArray}
                            strokeColor={firstCoordinateSet.color}
                            strokeWidth={3}
                        />
                    )
                })
            );
        }
        return renderedData;
    }
    getData() {
    console.log("ddd")
                Keyboard.dismiss();
                BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
                this.checkLocationPermission();
                this.props.getPoiCategories().then(() => {
                    if (this.props.explore && this.props.explore.categories) {
                        this.setState({poiCategories: this.props.explore.categories});
                    }
                });
                this.watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        // this.currentLatitude = 38.3525762274876;
                        // this.currentLongitude = -122.37586190924048;
                        this.currentLatitude = position.coords.latitude;
                        this.currentLongitude = position.coords.longitude;
                        // this.currentRegion = {
                        //     latitude: this.currentLatitude,
                        //     longitude: this.currentLongitude,
                        //     latitudeDelta: 0.47007415117811036,
                        //     longitudeDelta: 0.4612772539258003
                        // };
                    },
                    (error) => this.setState({locationError: error.message}),
                    {
                        enableHighAccuracy: true,
                        timeout: this.state.locationTimeOut,
                        maximumAge: 600000,
                        distanceFilter: 10,
                        accuracy: 1
                    },
                );
                this.props.getCoordinates().then(() => {
                console.log("rslt")
                    this.setState({
                        coordinatePoints: this.props.explore.coordinates,
                        isCoordinatePointsAvailable: true
                    });
                });
    }

    getNetinfo() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().done(
            (isConnected) => {
            console.log(isConnected)
            if(isConnected){
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
        this.getNetinfo();
       //
    }

    render() {
        return (
            (this.state.netstatus) ?
                <View style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: '#DDDDDD'
            }}>
                    <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                    <View style={styles.toolbarView}>
                        <View style={styles.toolbarNapaIconView}>
                            <Image
                                style={styles.toolbarNapaIcon}
                                source={require('../../assets/images/napa_valley_logo.png')}/>
                        </View>
                        <TouchableOpacity
                            style={{
                             //borderColor:'#dd0000',borderWidth:2,
                             paddingLeft:responsiveWidth(5),
                             //height:68,
                             // paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
                             alignItems:'center',
                             justifyContent:'center'
                         }}
                            onPress={() => {
                            if (this.state.filterModalVisible) {
                                this.closeFilterModal();
                            } else {
                                this.openFilterModal();
                            }
                        }}>
                            <Image
                                style={{
                                width: 24,
                                height: 24,
                                resizeMode: 'contain',
                                ///marginRight: 10
                            }}
                                source={require('../../assets/images/red_location_pin.png')}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableWithoutFeedback
                        onPress={() => {
                       if (this.state.filterModalVisible) {
                                this.closeFilterModal();
                            }
                         Keyboard.dismiss();
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
                            onRegionChangeComplete={(region) => {
                                   // this.mapRegionChanged(region);
                                    }}
                            initialRegion={this.currentRegion}
                            style={styles.mapView}
                            minZoomLevel={10.1}
                            showsMyLocationButton={false}
                            moveOnMarkerPress={false}
                            customMapStyle={MAP_STYLE}
                            showsPointsOfInterest={false}
                            ref={(ref) => this.mapView = ref}>
                            {this.renderDatas()}
                        </MapView>
                    </TouchableWithoutFeedback>
                    {
                        (this.state.isCoordinatePointsAvailable == false
                            && this.state.pointsOfInterest.length === 0 && this.state.netstatus
                        )
                            ? <View style={{
                                backgroundColor:'transparent',
                                width:responsiveWidth(90),
                                height:responsiveHeight(90),
                                alignItems:'center',
                                justifyContent:'center',
                        }}>
                                <ActivityIndicator size="large" color="#000"/>
                            </View>
                            : null
                    }
                    {
                        (this.state.isFilteredPOIAvailable == false)
                            ? <TouchableWithoutFeedback
                                onPress={() => {
                       if (this.state.filterModalVisible) {
                                this.closeFilterModal();
                            }
                         Keyboard.dismiss();
                    }}>
                                <View style={{
                                backgroundColor:'transparent',
                                width:responsiveWidth(90),
                                height:responsiveHeight(90),
                                alignItems:'center',
                                justifyContent:'center',
                        }}>
                                    <ActivityIndicator size="large" color='#000'/>
                                </View>

                            </TouchableWithoutFeedback>
                            : null
                    }
                    {(this.state.isSearchBarVisible
                    && this.state.isCoordinatePointsAvailable
                    && this.state.pointsOfInterest
                    && this.state.netstatus)
                        ? <View style={{
                    justifyContent: 'center',
                    marginTop: Platform.OS==='ios' ? 90 : StatusBar.currentHeight + 60,
                    width: responsiveWidth(90),
                    backgroundColor: '#fff',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,
                    elevation: 2,
                    //borderColor:'#dd0000',borderWidth:2
                    }}>
                            <View
                                style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingRight: 5,
                            //borderColor:'#dd0000',borderWidth:2
                        }}>
                                <TextInput
                                    style={{
                                    flex: 1,
                                    textAlignVertical: 'center',
                                    fontSize: responsiveFontSize(1.9),
                                    height: responsiveWidth(10),
                                    paddingLeft:responsiveWidth(5),
                                    //borderColor:'#dd0000',borderWidth:2,
                                    color:'#949494'
                                }}
                                    value={this.state.searchTerm}
                                    ref={(ref) => this.searchInput = ref}
                                    onChangeText={(term) => {
                                let trimedTerm1=term;
                                let trimedTerm=trimedTerm1.trim();

                                    if(trimedTerm.length===0){
                                        this.clearPoiSearch();
                                    }
                                     if (this.state.filterModalVisible) {
                                        this.closeFilterModal();
                                    }
                                    this.searchPoi(trimedTerm,term);
                                }}
                                    placeholder='Search'
                                    underlineColorAndroid={'transparent'}>
                                </TextInput>
                                <TouchableOpacity onPress={() => {
                                let marker3 = {
                                            latitude: 38.3525762274876,
                                            longitude: -122.37586190924048,
                                            latitudeDelta: 0.47007415117811036,
                                            longitudeDelta: 0.4612772539258003
                                        };
                                this.mapView.animateToRegion(marker3, 1000);
                                this.clearPoiSearch();
                                this.searchInput.clear();
                                this.searchInput.blur();
                            }}>
                                    <Image
                                        style={{width: 15, height: 15, margin: 5}}
                                        source={
                                    this.state.searchTerm.length>2
                                    ? require('../../assets/images/close_icon.png')
                                    : require('../../assets/images/search_icon.png')
                                }>
                                    </Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        : null
                    }
                    {(this.state.searchTerm.length > 2 && this.searchInput.isFocused())
                        ? <SearchResult
                            onSelectedItem={(selectedItem) => this.onSearchItemSelected(selectedItem)}
                            searchResults={this.state.pointsOfInterest}
                        />
                        : null
                    }
                    <View style={{
                    justifyContent: 'center',
                    bottom:responsiveWidth(3),
                    //bottom: this.state.filterModalVisible
                    //?responsiveHeight(49)
                    //:responsiveWidth(3),
                    right: 10,
                    position: 'absolute',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,
                    elevation: 2,
                    borderColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 2
                }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                            this.moveToCurrentPosition(this.currentLatitude, this.currentLongitude);
                        }}>
                            <View style={{
                            width: 33.3,
                            height: 33.3,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                                <Image
                                    style={{
                                    height: 18.7,
                                    width: 18.7,
                                    resizeMode: 'contain'
                                }}
                                    source={require('../../assets/images/show_my_location_button.png')}>
                                </Image>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Animated.View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: this.filterModalTop,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: -1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,
                    elevation: 2,
                }}>
                        <MapLegend
                            categories={this.state.poiCategories}
                            onCategorySelect={(categories) => this.onCategorySelect(categories)}

                        />
                    </Animated.View>
                </View>
                : <View style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: '#DDDDDD'
            }}>
                    <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                    <View style={styles.toolbarView}>
                        <View style={styles.toolbarNapaIconView}>
                            <Image
                                style={styles.toolbarNapaIcon}
                                source={require('../../assets/images/napa_valley_logo.png')}/>
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
                    this.getData()
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
    nav: state.nav,
    explore: state.explore,
    session: state.session,
    restaurants: state.restaurants
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen);