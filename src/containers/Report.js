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
    View, TextInput,
    CameraRoll,
    FlatList, Picker,
    Alert,
    ActivityIndicator,
    NetInfo
} from "react-native";
import Toast from "react-native-simple-toast";
import * as Types from "../constants/types";
import LongButton from "../components/LongButton";
import ViewPhotos from "../components/ViewPhotos";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import {ActionCreators} from "../actions/index";
import ImagePicker from 'react-native-image-picker';
import GridView from "react-native-super-grid";
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
        //marginLeft: responsiveWidth(3)
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
        alignItems: 'center',
        //backgroundColor: '#fff'
    },
    buttonLoginContainerView: {
        //backgroundColor: '#dd0000',
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
    }
});
var options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
class Report extends Component {
    static navigationOptions = {
        gesturesEnabled: false,
        header: null,
        tabBarLabel: () => (
            <Text style={{fontSize: responsiveFontSize(1.6)}}>Report</Text>
        ),
        tabBarIcon: () => (<View style={{alignItems: 'center', padding: responsiveWidth(2), justifyContent: 'center'}}>
            <Image
                style={{width:responsiveHeight(2.5),height:responsiveHeight(2.5),resizeMode: 'contain'}}
                source={require('../../assets/images/bottom_navigation_report_icon.png')}
                resizeMode={'contain'}/>
        </View>)
    }

    constructor(props) {
        super(props);
        this.isAlertVisible = false;
        this.timeOut = null;
        this.state = {
            comment: '',
            isPhotosAvailable: false,
            showPhotoGallery: false,
            avatarSource: null,
            huntDetails: [],
            imageUri: [],
            selectedProblem: '',
            issueCategory: [],
            showActivityIndicator: false,
            currentLatitude: null,
            currentLongitude: null,
            locationError: null,
            locationTimeOut: 1000 * 60 * 60,
        }
    }

    onBackPress = () => {
        this.props.navigation.navigate(Types.DASHBOARD);
        return true;
    };

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
    getData(){
        this.props.issueCategories().then(() => {
            this.setState({
                issueCategory: this.props.misc.issueCategory
            });
        });
        this.watchId2 = navigator.geolocation.getCurrentPosition(
            (position2) => {
                this.setState({
                    currentLatitude: position2.coords.latitude,
                    currentLongitude: position2.coords.longitude,
                    locationError: null,
                });
            },
            (error) => this.setState({locationError: error.message}),
            {enableHighAccuracy: false, timeout: this.state.locationTimeOut, maximumAge: 600000, distanceFilter: 10},
        );
    }
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.getNetinfo();

    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    uploadImages() {
        ImagePicker.showImagePicker(options, (response) => {

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
                    imageUri: this.state.imageUri.concat(response.uri),
                    //imageUri: response.uri,
                    avatarSource: source,
                    isPhotosAvailable: true
                });
            }
        });
    }

    reportIssue(types, message, image) {

        if (image.length == 0 && types == '') {
            Alert.alert(
                'Not Submitted',
                'Select the type of issue from the list or upload any image',
                [
                    // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {
                        text: 'OK', onPress: () => {
                        this.setState({showActivityIndicator: false});
                    }
                    },
                ],
                {cancelable: false}
            )
        } else {
            this.props.reportIssue(types, message, image, this.state.currentLatitude, this.state.currentLongitude).then(() => {
                //if (this.props.misc.reportIssue && this.props.misc.reportStatus > 200 && this.props.misc.reportStatus < 205) {

                Alert.alert(
                    'Report Issue',
                    'Thanks for your report',
                    [
                        {
                            text: 'OK', onPress: () => {
                            this.setState({showActivityIndicator: false});
                            this.reloadPage()
                        }
                        },
                    ],
                    {cancelable: false}
                )
            });
        }
    }

    reloadPage() {
        this.setState({
            imageUri: [],
            comment: '',
            isPhotosAvailable: false,
            selectedProblem: ''
        });
    }

    render() {
        let imageArray = [], issueArray = [];
        imageArray = this.state.imageUri;
        if (this.state.issueCategory.length > 0) {
            this.state.issueCategory.map((item) => {
                //console.log(item.report_category)
                issueArray = issueArray.concat(item)
            })
        }
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        let currentDate = date + '-' + month + '-' + year;
        return (
            <View style={styles.containerView}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                <View style={styles.toolbarView}>
                    <View style={styles.toolbarNapaIconView}>
                        <Image
                            style={styles.toolbarNapaIcon}
                            source={require('../../assets/images/napa_valley_logo.png')}/>
                    </View>
                </View>
                {this.renderAcitivityIndicator()}
                <View style={styles.contentView}>
                    <ScrollView
                        bounces={false}
                        style={{height: responsiveHeight(83)}}
                        keyboardShouldPersistTaps='handled'
                        horizontal={false}
                        scrollEnabled={true}>
                        <View style={{
                            width:responsiveWidth(100),
                            height:responsiveHeight(15),
                            backgroundColor:'#ededed',
                            justifyContent:'center'}}>
                            <View style={{
                                marginLeft:responsiveWidth(7),
                                height:responsiveHeight(11.5),
                                alignItems:'center',justifyContent:'center',
                                position:'absolute',
                               // borderWidth:2,borderColor:'#dd0000'
                             }}>
                                <Text
                                    style={{
                                fontSize:responsiveFontSize(2.7),
                                color:'#252f39',
                                fontFamily:'Roboto-Medium'
                            }}>
                                    Report Problem
                                </Text>
                                <Text style={{
                                fontSize:responsiveFontSize(1.7),
                                color:'#252f39',
                                fontFamily:'Roboto-Medium'
                            }}>
                                    See a problem? Tell us !
                                </Text>
                            </View>
                        </View>
                        <View style={
                            {width:responsiveWidth(100),
                            alignItems:'center',
                            justifyContent:'center',
                            //backgroundColor:'#fff'
                           // borderColor:'#dd0000',borderWidth:2
                            }}>
                            {/*<Image*/}
                                {/*style={{*/}
                                    {/*width:responsiveWidth(100),*/}
                                    {/*alignItems:'center',*/}
                                    {/*justifyContent:'center',*/}
                                    {/*position:'absolute',*/}
                                   {/*// borderColor:'#dd0000',borderWidth:2*/}
                                {/*}}*/}
                                {/*source={require('../../assets/images/report_layer.png')}/>*/}
                            <View style={{
                                borderColor:'#999999',borderWidth:0.9,
                                width:responsiveWidth(93),
                                height:responsiveHeight(20),
                                flexDirection:'row',
                                backgroundColor:'#fff',
                                marginTop:responsiveWidth(5),
                               // borderColor:'#dd0000',borderWidth:2,
                                borderRadius:responsiveWidth(8)
                                }}>
                                <View style={{
                                    width:responsiveWidth(83),
                                    flexDirection:'row',
                                    // borderColor:'#dd0000',borderWidth:2,
                                }}>
                                    <ScrollView>
                                        <TextInput
                                            style={{
                                                flex:1,
                                                width:'100%',
                                                fontSize: responsiveFontSize(2.4),
                                                color: '#000',
                                                paddingLeft: responsiveHeight(3),
                                                paddingRight: responsiveHeight(2),
                                                fontFamily: 'Roboto-Regular',
                                                marginTop:responsiveWidth(1),
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
                                           // secureTextEntry={false}
                                            // onSubmitEditing={() => { this.secondTextInput.focus(); }}
                                            ref={(input) => { this.comment = input; }}
                                            //blurOnSubmit={false}
                                            returnKeyType={"next"}/>
                                    </ScrollView>
                                </View>
                                <TouchableOpacity onPress={()=>{
                                          this.setState({comment:''})
                                        }}>
                                    <View style={{
                                        alignItems:'center',
                                    width:responsiveWidth(10),
                                     //borderColor:'#dd0000',borderWidth:2,
                                     marginTop:responsiveWidth(2),
                                     //marginRight:responsiveWidth(4)
                                     }}>
                                        <Image
                                            style={{
                                            width: responsiveWidth(4),
                                            height:responsiveWidth(4),
                                            resizeMode: 'contain',
                                            marginTop:responsiveWidth(2)
                                        }}
                                            source={require('../../assets/images/close_icon.png')}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                backgroundColor:'#fff',
                                width:responsiveWidth(93),
                                borderRadius:responsiveWidth(10),
                               marginTop:responsiveWidth(5),
                               marginBottom:responsiveWidth(5),
                               //height:responsiveHeight(0),
                               paddingTop:0,
                               }}>
                                <Picker
                                    selectedValue={this.state.selectedProblem}
                                    onValueChange={(itemValue, itemIndex) => {
                                    console.log("......"+itemValue);
                                    this.setState({selectedProblem: itemValue})
                                }}
                                    mode={'dropdown'}
                                    style={{
                                           width:responsiveWidth(93),
                                          // borderColor:'#858383',borderWidth:0.7,
                                           borderRadius:responsiveWidth(10),
                                    }}
                                    itemStyle={{
                                       // borderColor:'#dd0000',borderWidth:2,
                                        borderRadius:responsiveWidth(10),
                                        height:responsiveHeight(23),
                                        fontSize:responsiveFontSize(2)
                                    }}>
                                    {
                                        issueArray.map((issue, index) => {
                                            // console.log(issue);
                                            return (

                                                <Picker.Item
                                                    label={issue.complaint_text}
                                                    value={issue.id}>
                                                </Picker.Item>
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                        this.uploadImages();
                                        }}>
                                <View style={{
                                        //borderColor:'#dd0000',borderWidth:2,
                                        width:responsiveWidth(93),
                                        marginBottom:responsiveWidth(5),
                                        backgroundColor:'#da7c3c',
                                        borderRadius:responsiveWidth(10),
                                        flexDirection:'row',
                                        alignItems:'center',
                                        justifyContent:'center'
                                    }}>
                                    <Image
                                        style={{
                                            width: responsiveWidth(6),
                                            height:responsiveWidth(6),
                                            resizeMode: 'contain',
                                        }}
                                        source={require('../../assets/images/report_camera_icon.png')}/>
                                    <Text style={{
                                            padding:responsiveWidth(3.9),
                                            color:'#fff',
                                            fontFamily:'Roboto-Regular',
                                            fontSize:responsiveFontSize(1.9)}}>Add Photo </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{
                                    flexDirection:'row',
                                    }}>
                                {(this.state.isPhotosAvailable) ?
                                    <View style={{
                                            maxWidth:responsiveWidth(93),
                                            alignItems:'center',
                                            justifyContent:'center',
                                            }}>
                                        <FlatList
                                            data={this.state.imageUri}
                                            horizontal={true}
                                            renderItem={({item}) =>
                                            <TouchableOpacity
                                                 onPress={() => {
                                                    }}>
                                                    <View
                                                        style={{
                                                            marginTop:responsiveWidth(5),
                                                            marginLeft:responsiveWidth(2.7),
                                                            marginBottom:responsiveWidth(5.5),
                                                            width:responsiveWidth(32),
                                                            height:responsiveWidth(32),
                                                            borderColor:'#858383',borderWidth:0.7,
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                        }}>
                                                        <Image
                                                            style={{
                                                                width:responsiveWidth(30),
                                                                height:responsiveWidth(30),
                                                                resizeMode: 'cover',
                                                                }}
                                                            source={{uri:item}}/>
                                                    </View>
                                                </TouchableOpacity>
                                        }
                                            keyExtractor={(item, index) => index.toString()}/>
                                    </View>
                                    : null
                                }
                            </View>
                            <TouchableOpacity
                                onPress={()=>{
                                    NetInfo.getConnectionInfo().then((connectionInfo) => {
                                    if (connectionInfo.type === 'none') {
                                        Toast.show('No internet connectivity');
                                    }else{
                                       this.setState({showActivityIndicator: true});
                                    this.reportIssue(this.state.selectedProblem,this.state.comment,imageArray)

                                    } });
                                    }}>
                                <View style={{
                                    // borderColor:'#dd0000',borderWidth:2,
                                backgroundColor: '#34d043',
                                width:responsiveWidth(93),
                                 borderRadius:responsiveWidth(10),
                                flexDirection: 'row',
                                alignItems:'center',
                                justifyContent:'center',
                                marginBottom:responsiveHeight(7),
                            }}>
                                    <Image
                                        style={{
                                            width: responsiveWidth(6),
                                            height:responsiveWidth(6),
                                            resizeMode: 'contain',
                                        }}
                                        source={require('../../assets/images/issue.png')}/>
                                    <Text style={{
                                   fontSize:responsiveFontSize(1.9),
                                    color: '#fff',
                                    padding:responsiveWidth(3.9),
                                    textAlign: 'center',
                                    fontFamily:'Roboto-Regular'
                                }}>{"Report Issue"}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    bottomnavigator: state.bottomnavigator,
    session: state.session,
    user: state.user,
    misc: state.misc
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);
