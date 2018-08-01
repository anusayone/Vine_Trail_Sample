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
    View,
    TextInput,
    CameraRoll,
    PermissionsAndroid,
    ActivityIndicator,
    NetInfo
} from "react-native";
import LongButton from "../components/LongButton";
import * as Types from "../constants/types";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import {ActionCreators} from "../actions/index";
import ImagePicker from 'react-native-image-picker';
import Toast from "react-native-simple-toast";
import ImageLoad from 'react-native-image-placeholder';

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
        resizeMode: 'cover',
    },

    buttonLoginContainerView: {
      //  backgroundColor: '#dd0000',
        width: '100%',
        alignItems: 'center',
        marginBottom: responsiveHeight(3),
        marginTop: responsiveHeight(4)
    },
    buttonLoginBackgroundImage: {
        height: responsiveWidth(14),
        width: responsiveHeight(43),
        resizeMode: 'contain'
    },
    buttonLoginTouchableView: {
        width: responsiveHeight(43),
        height: responsiveWidth(14),
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    contentView: {
        ...StyleSheet.absoluteFillObject,
        marginTop: 68,
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: '#dd0000', borderWidth: 2,
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});

var options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images',
        //cameraRoll:true
    }
};
class ScavengerHuntVerificationScreen extends Component {

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
            selectedTaskDetails: [],
            avatarSource: null,
            huntDetails: [],
            imageUri: [],
            currentLatitude: null,
            currentLongitude: null,
            locationError: null,
            locationTimeOut: 1000 * 60 * 60,
            comment: '',
            location: '',
            showActivityIndicator: false,
            netstatus: true,
            errortext: "No internet"
        }
    }

    onBackPress = () => {
        this.props.navigation.goBack();
        // this.props.navigation.navigate(Types.SCAVENGER_HUNT_CLUE_SCREEN, this.state.selectedTaskDetails);
        return true;
    };
    getData(){
        this.checkLocationPermission();
                this.watchId2 = navigator.geolocation.getCurrentPosition(
                    (position2) => {
                        console.log(position2);
                        this.setState({
                            currentLatitude: position2.coords.latitude,
                            currentLongitude: position2.coords.longitude,
                            locationError: null,
                        });
                    },
                    (error) => this.setState({locationError: error.message}),
                    {enableHighAccuracy: false, timeout: this.state.locationTimeOut, maximumAge: 600000, distanceFilter: 10},
                );
                this.setState({
                    selectedTaskDetails: this.props.navigation.state.params,
                    huntDetails: this.props.hunt.huntDetails,
                });
    }
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
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.getNetinfo();

    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        navigator.geolocation.clearWatch(this.watchId2);
    }

    uploadImage() {
    if(this.state.netstatus){
        ImagePicker.showImagePicker(options, (response) => {

        console.log('Response = ', response);
        if (response.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        }
        else {
            let source = {uri: response.uri};
            this.setState({
                imageUri: response.uri,
                avatarSource: source
            });
        }
    });
    }else{
        Toast.show("No Internet")
    }
    }

    verifyPhoto(selectedTaskDetails) {
    if(this.state.netstatus){

        let taskId = selectedTaskDetails.id;
        if (this.state.imageUri.length == 0) {
            Toast.show('Please upload image');
        }
        else {
            this.setState({showActivityIndicator: true});
            if (this.state.currentLongitude != null && this.state.currentLatitude != null) {
                this.props.completeTask(taskId,this.state.comment, this.state.imageUri, this.state.currentLatitude, this.state.currentLongitude).then(() => {
                    this.setState({showActivityIndicator: false});
                    if (this.props.hunt.completeTask.status === true) {

                        this.props.navigation.navigate(Types.SCAVENGER_HUNT_CONGRATULATION_SCREEN, selectedTaskDetails);
                    } else {
                        this.props.navigation.navigate(Types.SCAVENGER_HUNT_TRY_AGAIN_SCREEN, selectedTaskDetails);
                    }
                });
            }else{
                Toast.show('Location is not available ');
            }
        }
    }else{
             Toast.show("No Internet")
         }
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

    render() {
        let selectedTaskDetails = this.props.navigation.state.params;
        console.log(this.state.currentLongitude);
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        let currentDate = date + '-' + month + '-' + year;
        selectedTaskDetails.uploadedImage=this.state.avatarSource
        return (
        (this.state.netstatus)
            ?<View style={styles.containerView}>
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
                            }}>Task {selectedTaskDetails.level} - Verify</Text>
                    </View>
                </View>
                {this.renderAcitivityIndicator()}
                <View style={styles.contentView}>
                    <ScrollView
                        bounces={false}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps='handled'
                    >
                        <View style={{
                                width:responsiveWidth(100),
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingTop:responsiveHeight(5),
                                paddingBottom:responsiveHeight(5)
                            }}>
                            <View style={{
                            height:responsiveHeight(40),
                            width:responsiveWidth(75),
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor:'#fff'
                        }}>
                                <ImageLoad
                                    style={{
                                            height:responsiveHeight(40),
                                            width:responsiveWidth(75),
                                            resizeMode: 'cover',
                                            }}
                                    loadingStyle={{ size: 'large', color: 'transparent' }}
                                    placeholderStyle={{
                                           height:responsiveHeight(40),
                                           width:responsiveWidth(75),
                                           resizeMode: 'cover',}}
                                    placeholderSource={require('../../assets/images/placeholder_image.png')}
                                    source={this.state.avatarSource}/>

                            </View>
                            <View style={{
                                width:responsiveWidth(80),
                                height:responsiveHeight(5.6),
                                marginTop:-responsiveHeight(2.7)
                            }}>
                                <View style={{
                                    height:responsiveHeight(5.5),
                                    width:responsiveHeight(5.5),
                                    position:'absolute',
                                    right:responsiveWidth(8)
                                }}>
                                    <TouchableOpacity
                                        style={{
                                         height:responsiveHeight(7),
                                         width:responsiveHeight(7),
                                         //borderColor:'#dd0000',borderWidth:2
                                         }}
                                        onPress={()=>{
                                        this.uploadImage();
                                    }}>
                                        <Image
                                            style={{
                                               height:responsiveHeight(5.5),
                                               width:responsiveHeight(5.5),
                                               resizeMode: 'contain',
                                            }}
                                            source={require('../../assets/images/hunt_verification_camera_icon.png')}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{
                                width:responsiveWidth(80),
                                height:responsiveHeight(23),
                            }}>
                                <View style={{
                                    alignItems:'center',
                                    flex:1,
                                    flexDirection:'row',
                                   // borderColor:'#dd0000',borderWidth:2,
                                    width:responsiveWidth(80)
                                }}>
                                    <View style={{flex:1}}>
                                        <Text style={{color:'#000',
                                        fontSize:responsiveFontSize(1.8)}}>Comment :</Text>
                                    </View>
                                    <View style={{
                                        //flex:2,
                                        flexDirection:'row',alignItems:'center'}}>

                                        <View style={{
                                            borderColor:'#999999',borderWidth:0.9,
                                            width:responsiveWidth(56),
                                            height:responsiveHeight(20),
                                            flexDirection:'row',
                                            backgroundColor:'#fff',
                                            borderRadius:10
                                            }}>
                                            <ScrollView>
                                                <TextInput
                                                    style={{
                                            flex:1,
                                            //width:'50%',
                                            fontSize: responsiveFontSize(1.9),
                                            color: '#000',
                                            paddingLeft: responsiveHeight(2),
                                            paddingRight: responsiveHeight(2),
                                            fontFamily: 'Roboto-Regular',
                                            //marginTop:responsiveWidth(4),
                                            paddingBottom:5,
                                            marginBottom:5,
                                            //borderColor:'#dd0000',borderWidth:2,
                                            height:responsiveHeight(17),
                                            textAlignVertical:'top'
                                            }}
                                                    multiline={true}
                                                    value={this.state.comment}
                                                    placeholder={'Your Comment'}
                                                    underlineColorAndroid={'transparent'}
                                                    onChangeText={(text) => {
                                            this.setState({comment: text})}}
                                                    keyboardType={"default"}
                                                    secureTextEntry={false}
                                                    // onSubmitEditing={() => { this.secondTextInput.focus(); }}
                                                    ref={(input) => { this.comment = input; }}
                                                    blurOnSubmit={false}
                                                    returnKeyType={"next"}/>
                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                width:responsiveWidth(100),
                                alignItems:'center',
                                marginTop:responsiveHeight(2.4)
                            }}>
                                <LongButton
                                    onPress={() => {
                                    this.verifyPhoto(selectedTaskDetails);
                                }}
                                    title={'VERIFY PHOTO'}
                                />
                            </View>
                        </View>
                    </ScrollView>
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
                          }}>Scavenger Hunt Verification</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(ScavengerHuntVerificationScreen);