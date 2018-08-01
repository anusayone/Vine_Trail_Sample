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
    ActivityIndicator
} from "react-native";
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import MapView from "react-native-map-clustering";
import {Callout, Marker} from "react-native-maps";
import  {Polyline}  from 'react-native-maps';
import MapViewDirections from "react-native-maps-directions";
import CustomMarkerCallout from "../components/CustomMarkerCallout";
import SearchResult from "../components/SearchResult";
import MapLegend from "../components/MapLegend";
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
    SELECTED_MARKER_OFFSET
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
        paddingLeft: 22.7,
        paddingRight: 22.7
    },
    toolbarMenuIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    toolbarNapaIcon: {
        width: responsiveWidth(25),
        height: responsiveFontSize(5),
        resizeMode: 'contain',
        marginLeft: responsiveWidth(3)
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

class Map extends Component {
    static navigationOptions = {
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
    };

    constructor(props) {
        super(props);
        this.filterModalTop = new Animated.Value(responsiveHeight(100));
        this.markerRefs = [];
        this.shouldShowCallout = false;
        this.shouldCalculateDistance = false;
        this.searchTimeOutId = null;
        this.getPoiTimeOutId = null;
        this.distance = '';
        this.duration = '';
        this.markerPressedLatitude = '';
        this.markerPressedLongitude = '';
        this.markerPressedOffset = '';
        this.markerPressedPoi = '';
        this.markerPressedRef = '';
        this.state = {
            currentRegion: {
                latitude: DEFAULT_LATITUDE,
                longitude: DEFAULT_LONGITUDE,
                latitudeDelta: DEFAULT_LATITUDE_DELTA,
                longitudeDelta: DEFAULT_LONGITUDE_DELTA
            },
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
            secondCoordinateArray: [],
            thirdCoordinateArray: [],
            // markerPressedLatitude: '',
            // markerPressedLongitude: '',
            // markerPressedOffset: '',
            // markerPressedPoi: '',
            // markerPressedRef: ''
        }
    }

    onBackPress = () => {
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
        Keyboard.dismiss();
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.checkLocationPermission();
        this.props.getPoiCategories().then(() => {
            if (this.props.explore && this.props.explore.categories) {
                this.setState({poiCategories: this.props.explore.categories});
            }
        });

        this.props.getPointsOfInterest().then(() => {
            if (this.props.explore && this.props.explore.pointsOfInterest) {
                this.setState({pointsOfInterest: this.props.explore.pointsOfInterest});
                // let renderedArray, latitude, longitude, coordinates,color;
                // this.state.pointsOfInterest.map((poi) => {
                //     coordinates = poi.position.split(',');
                //     renderedArray = renderedArray.concat(
                //         latitude = parseFloat(coordinates[0]),
                //         longitude = parseFloat(coordinates[1]),
                //         color = ['#dd0000', '#000000', '#4bb7dd', '#dd0000', '#000000', '#4bb7dd']
                //     );
                //
                // });
            }
        });

        this.props.getCoordinates().then(() => {
            this.setState({
                coordinatePoints: this.props.explore.coordinates,
                isCoordinatePointsAvailable: true
            });
        });
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({
                    currentLatitude: 38.267755,
                    currentLongitude: -122.28342500000001,
                    // currentLatitude: position.coords.latitude,
                    // currentLongitude: position.coords.longitude,
                    locationError: null,
                });
            },
            (error) => this.setState({locationError: error.message}),
            {enableHighAccuracy: false, timeout: this.state.locationTimeOut, maximumAge: 600000, distanceFilter: 10},
        );
        console.log(this.state.currentLatitude);
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
        this.clearPoiSearch();
        if (!this.state.filterModalVisible) {
            this.setState({filterModalVisible: true});
            this.filterModalTop.setValue(responsiveHeight(100));
            Animated.parallel([
                Animated.timing(
                    this.filterModalTop,
                    {
                        toValue: responsiveHeight(100) - responsiveHeight(37.5) - 55.5,
                        duration: 600,
                        easing: Easing.cubic
                    }
                ),
            ]).start(() => {
                //Animation ended
            });
        }
    }

    closeFilterModal() {
        if (this.state.filterModalVisible) {
            this.filterModalTop.setValue(responsiveHeight(100) - responsiveHeight(37.5) - 56);
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

    searchPoi(term) {
        this.setState({searchTerm: term});
        if (this.searchTimeOutId)
            clearTimeout(this.searchTimeOutId);

        let that = this;
        this.searchTimeOutId = setTimeout(() => {
            if (term.length > 2) {
                that.props.getSearchResults(term).then(() => {
                    if (that.props.explore && that.props.explore.pointsOfInterest) {
                        that.setState({pointsOfInterest: that.props.explore.pointsOfInterest.results});
                    }
                });
            }
        }, 1000);
    }

    clearPoiSearch() {
        //this.fitAllMarkers();
        this.setState({selectedPointOfInterest: null});
        this.props.getPointsOfInterest().then(() => {
            if (this.props.explore && this.props.explore.pointsOfInterest) {
                console.log(this.props.explore.pointsOfInterest)
                this.setState({
                    pointsOfInterest: this.props.explore.pointsOfInterest,
                    searchTerm: ''
                });

            }
        });
    }

    onCategorySelect(categories) {
        this.setState({selectedPointOfInterest: null});
        let categoryIds = [];
        categories.map((category) => {
            categoryIds = categoryIds.concat(category.id);
        });
        this.setState({selectedCategoryIds: categoryIds});

        if (this.getPoiTimeOutId)
            clearTimeout(this.getPoiTimeOutId);
        let that = this;
        this.getPoiTimeOutId = setTimeout(() => {
            that.props.getFilteredPoi(categoryIds).then(() => {
                if (that.props.explore && that.props.explore.pointsOfInterest) {
                    that.setState({pointsOfInterest: that.props.explore.pointsOfInterest.results});
                }
            });
        }, 1000);
    }

    onSearchItemSelected(selectedPOI) {
        this.setState({selectedPointOfInterest: selectedPOI,});
        let coordinates = selectedPOI.position.split(',');
        this.moveToMarker(parseFloat(coordinates[0]), parseFloat(coordinates[1]), SELECTED_MARKER_OFFSET, selectedPOI);
    }

    moveToMarker(latitude, longitude, offset = 0, poi = null) {
        if (latitude && longitude) {
            let marker = {
                latitude: latitude + offset,
                longitude: longitude,
                latitudeDelta: SELECTED_LATITUDE_DELTA,
                longitudeDelta: SELECTED_LONGITUDE_DELTA
            };
            this.mapView._root.animateToRegion(marker, 1000);
            // if(poi){
            //     setTimeout(()=>{
            //         this.markerRefs['poi_' + poi.id].showCallout();
            //     },1100);
            // }
        }
    }

    moveToCurrentPosition(latitude, longitude, offset = 0) {
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

    markerPressed(latitude, longitude, offset = 0, poi = null) {
        this.markerPressedLatitude = latitude;
        this.markerPressedLongitude = longitude;
        this.markerPressedOffset = offset;
        this.markerPressedPoi = poi;
        if (latitude && longitude) {
            let marker = {
                latitude: latitude + offset,
                longitude: longitude,
                latitudeDelta: SELECTED_LATITUDE_DELTA,
                longitudeDelta: SELECTED_LONGITUDE_DELTA
            };
            this.mapView._root.animateToRegion(marker, 2000);
        }
        this.shouldShowCallout = true;

    }

    // onRegionChange(region) {
    //    // console.log(region);
    //     if(this.state.markerPressedPoi!=''){
    //         setTimeout(() => {
    //             this.markerRefs['poi_' + this.state.markerPressedPoi.id].hideCallout();
    //         }, 1000);
    //     }
    // }

    distanceCalculation() {
        if (this.markerPressedPoi != '' && this.shouldCalculateDistance) {
            console.log("distance calculation");
            let clatitude = this.state.currentLatitude;
            let clongitude = this.state.currentLongitude;
            let coordinates = this.markerPressedPoi.position.split(',');
            this.props.getDistance(coordinates, clatitude, clongitude).then(() => {
                if (this.props.explore.distance) {
                    setTimeout(() => {
                        this.shouldCalculateDistance = false;
                    }, 500);
                    this.distance = this.props.explore.distance["0"].elements["0"].distance.text;
                    this.duration = this.props.explore.distance["0"].elements["0"].duration.text;
                }
            });
        }
    }

    mapRegionChanged(region) {
        console.log("map region change completed");
        if (this.markerPressedPoi != '' && this.shouldCalculateDistance) {
            let clatitude = this.state.currentLatitude;
            let clongitude = this.state.currentLongitude;
            let coordinates = this.markerPressedPoi.position.split(',');
            this.props.getDistance(coordinates, clatitude, clongitude).then(() => {
                if (this.props.explore.distance) {
                    setTimeout(() => {
                        this.shouldCalculateDistance = false;
                    }, 500);
                    this.distance = this.props.explore.distance["0"].elements["0"].distance.text;
                    this.duration = this.props.explore.distance["0"].elements["0"].duration.text;
                }
            });
        }
        if (this.shouldShowCallout) {
            this.markerRefs['poi_' + this.markerPressedPoi.id].showCallout();
            setTimeout(() => {
                this.shouldShowCallout = false;
            }, 500);
        }
    }

    renderDatas() {
        //if (this.shouldCalculateDistance === false && this.shouldShowCallout === false) {
        console.log("inside renderData");
        let k;
        let color = ['#dd0000', '#000000', '#4bb7dd', '#dd0000', '#000000', '#4bb7dd'];
        let renderedData = [];
        if (this.state.pointsOfInterest || this.state.selectedPointOfInterest) {
            let pointsOfInterest = this.state.selectedPointOfInterest ? [this.state.selectedPointOfInterest] : this.state.pointsOfInterest;
            pointsOfInterest.clatitude = this.state.currentLatitude;
            pointsOfInterest.clongitude = this.state.currentLongitude;
            renderedData = renderedData.concat(
                pointsOfInterest.map((poi) => {
                    if (this.markerPressedPoi != '' && (this.markerPressedPoi.id === poi.id)) {
                        this.shouldCalculateDistance = true;
                        //this.distanceCalculation();
                    }
                    poi.clatitude = this.state.currentLatitude;
                    poi.clongitude = this.state.currentLongitude;
                    let coordinates = poi.position.split(',');
                    return (
                        <Marker
                            key={poi.id}
                            image={{uri: poi.category.category_icon}}
                            coordinate={{latitude: parseFloat(coordinates[0]), longitude: parseFloat(coordinates[1])}}
                            ref={(ref) => this.markerRefs['poi_' + poi.id] = ref}
                            onPress={() => {
                                   this.markerRefs['poi_' + poi.id].showCallout();
                                   this.markerPressed(parseFloat(coordinates[0]), parseFloat(coordinates[1]), SELECTED_MARKER_OFFSET,poi);
                                   }}>
                            <Callout
                                tooltip={false}
                                style={{
                                            width: responsiveWidth(80),
                                            minHeight: responsiveHeight(30),
                                            maxHeight:responsiveHeight(42)
                                        }}
                                onPress={()=>{
                                            this.props.navigation.navigate(Types.MAP_POINTER_DETAIL_SCREEN,
                                                                        poi
                                                                        )
                                            }}>
                                <CustomMarkerCallout
                                    poi={poi}
                                    parentProps={this.props}
                                    distance={this.distance}
                                    duration={this.duration}/>
                            </Callout>
                        </Marker>
                    )
                })
            );
        }
        if (this.state.isCoordinatePointsAvailable && this.state.pointsOfInterest.length > 0) {
            let firstCoordinateSet = [];
            let coordinatePoints = this.props.explore.coordinates;
            renderedData = renderedData.concat(
                coordinatePoints.map((points, index) => {
                    firstCoordinateSet = points.coordinates;
                    firstCoordinateSet.color = color[index];
                    let firstCoordinateArray = [];
                    for (k = 0; k < firstCoordinateSet.length; k++) {
                        firstCoordinateArray.color = color[k];
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
                            strokeWidth={2}
                        />
                    )
                })
            );
        }
        return renderedData;
        // }

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
                    {/*<TouchableOpacity*/}
                    {/*onPress={() => {*/}
                    {/*}}>*/}
                    {/*<Image*/}
                    {/*style={styles.toolbarMenuIcon}*/}
                    {/*source={require('../../assets/images/menu.png')}*/}
                    {/*/>*/}
                    {/*</TouchableOpacity>*/}
                    <View style={styles.toolbarNapaIconView}>
                        <Image
                            style={styles.toolbarNapaIcon}
                            source={require('../../assets/images/napa_valley_logo.png')}
                        />
                    </View>
                    <TouchableOpacity
                        style={{}}
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
                                marginRight: 10
                            }}
                            source={require('../../assets/images/filter_icon.png')}/>
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback
                    onPress={() => {
                       // this.searchInput.blur();
                        this.closeFilterModal();
                    }}>
                    <MapView
                        clusterTextColor={'#fff'}
                        clusterTextSize={15}
                        clusterColor='#e57e39'
                        customClusterMarkerDesign={<ClusterMarker/>}
                        provider={'google'}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        loadingBackgroundColor={'#DDDDDD'}
                        cacheEnabled={true}
                        loadingEnabled={true}
                        showsUserLocation={true}
                        followsUserLocation={false}
                        onRegionChangeComplete={(region) => {
                                    this.mapRegionChanged(region);
                                    }}
                        onRegionChange={(region) => {

                                    }}
                        region={this.state.currentRegion}
                        style={styles.mapView}
                        minZoomLevel={6}
                        showsMyLocationButton={false}
                        moveOnMarkerPress={false}
                        ref={(ref) => this.mapView = ref}>
                        {this.renderDatas()}
                    </MapView>
                </TouchableWithoutFeedback>
                {
                    (this.state.isCoordinatePointsAvailable == false && this.state.pointsOfInterest.length === 0)
                        ? <View style={{
                                backgroundColor:'transparent',
                                width:responsiveWidth(90),
                                height:responsiveHeight(90),
                                alignItems:'center',
                                justifyContent:'center',
                                //borderColor:'#dd0000',borderWidth:2
                        }}>
                            <ActivityIndicator size="large" color="#000"/>
                        </View>
                        : null
                }
                {(this.state.isSearchBarVisible && this.state.isCoordinatePointsAvailable && this.state.pointsOfInterest)
                    ? <View style={{
                    //borderColor:'#dd0000',borderWidth:2,
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
                    }}>
                        <View
                            style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 5,
                            paddingRight: 5
                        }}>
                            <Image
                                style={{width: 15, height: 15, margin: 5}}
                                source={require('../../assets/images/searchbar_first_icon.png')}>
                            </Image>
                            <TextInput
                                style={{
                                flex: 1,
                                textAlignVertical: 'center',
                                fontSize: 12,
                                height: 40
                            }}
                                value={this.state.searchTerm}
                                ref={(ref) => this.searchInput = ref}
                                onChangeText={(term) => {
                                if(term.length===0){
                                    this.clearPoiSearch();
                                }
                                this.searchPoi(term);
                            }}
                                placeholder='Search'
                                underlineColorAndroid={'transparent'}>
                            </TextInput>
                            <TouchableOpacity onPress={() => {
                            this.clearPoiSearch();
                            //this.fitAllMarkers();
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
                    bottom: this.state.filterModalVisible
                    ?responsiveHeight(39)
                    :responsiveWidth(3),
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
                            //this.moveToMarker(this.state.currentLatitude, this.state.currentLongitude);
                            this.moveToCurrentPosition(this.state.currentLatitude, this.state.currentLongitude);
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
                        onCategorySelect={(categories) => this.onCategorySelect(categories)}
                        categories={this.state.poiCategories}
                    />
                </Animated.View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Map);
