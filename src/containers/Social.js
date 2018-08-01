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
    CameraRoll, ActivityIndicator,
    FlatList,
    Picker,
    NetInfo,
    Alert
} from "react-native";
import Toast from "react-native-simple-toast";
import GridView from "react-native-super-grid";
import ButtonLogin from "../components/ButtonLogin";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import {ActionCreators} from "../actions/index";
import * as Types from "../constants/types";
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
    contentView: {
        ...StyleSheet.absoluteFillObject,
        //borderColor: '#dd0000', borderWidth: 2,
        marginTop: 68,
        marginBottom: 56,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});

class Social extends Component {
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
    };

    constructor(props) {
        super(props);
        this.state = {
            isHuntImagesAvailable: false,
            socialImages: [],
            isImageViewVisible: false,
            selectedImage: [],
            more_url_: "",
            isMoreLoaderVisible: false,
            isReportAbuseVisible:false,
            reportAbuseCategories:[],
            selectedProblem:'',
            netstatus:false,
            errortext:'No Internet'
        }
    }


    getmore = () => {

        let url = this.state.more_url_;
        let user = getState().session.user;
        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + user.token,
                }
            })
            .then((response) => {
                return response.json();
            })
            .then(responseJson => {
            })
            .catch(error => {
                //console.error(error);
            });
    }

    onBackPress = () => {
        if(this.state.isImageViewVisible){
            console.log("isImageViewVisible===true")
            this.setState({
                isImageViewVisible: false})
        }else if(this.state.isReportAbuseVisible){
            this.setState({
                isReportAbuseVisible: false})
        }else{
            console.log("isImageViewVisible===false")
            this.props.navigation.navigate('BottomNavigator');
        }
        //this.props.navigation.goBack();
        //this.props.navigation.navigate('BottomNavigator');
        //this.props.navigation.navigate(Types.DASHBOARD);
        return true;
    };
    getData(){
    this.props.getSocialImages(false)
           .then(() => {
               console.log(this.props.social.socialImages.results);
               this.setState({
                   socialImages: this.props.social.socialImages.results,
                   // more_url:this.props.social.socialImages.next,
                   isHuntImagesAvailable: true
               });
           });
           this.props.reportAbuseCategories().then(() => {
               this.setState({
                   reportAbuseCategories: this.props.social.reportAbuseCategory
               });
           });
    }
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
          this.getNetinfo();
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

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    reloadPage(){
        this.setState({
            selectedProblem: '',
            selectedImage:[],
            isReportAbuseVisible:false,
        });
    }
    fetchMoreSocialImages() {

        if (this.props.social.socialImages.next&&this.state.netstatus) {
            this.setState({
                isMoreLoaderVisible: true
            });
            this.props.getSocialImages(true).then(() => {
              //  console.log(this.props.social.socialImages.results);
                this.setState({
                    socialImages: this.props.social.socialImages.results,
                    isHuntImagesAvailable: true,
                    isMoreLoaderVisible:false
                });
            });
        }
    }
    reportAbuse(selectedProblem,selectedImage){
        console.log(selectedImage);
        console.log(selectedProblem);
        if(selectedProblem==''){
            Alert.alert(
                'Report Abuse',
                'Sorry select any category',
                [
                    {
                        text: 'OK', onPress: () => {
                        this.setState({showActivityIndicator: false});

                    }
                    },
                ],
                {cancelable: false}
            )
        }else{
        if(this.state.netstatus){
        this.props.reportAbuse(selectedImage.id,selectedProblem).then(() => {
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

    }
    render() {
    let images;
    if(this.props.social.socialImages.results){
       images = this.props.social.socialImages.results;
    }

        let selectedImage = this.state.selectedImage;
        //console.log(this.state.isImageViewVisible);
        return (
        (this.state.netstatus)?
            <View style={{
                alignItems: 'center',
                flex: 1,
                flexDirection: 'column',
            }}>
                <View style={{
                    width:responsiveWidth(100),
                    height:responsiveHeight(100)}}>
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
                            }}>Hunt Photos</Text>
                        </View>
                    </View>
                    <View style={styles.contentView}>
                        <View style={{
                            // borderColor:'#dd0000',borderWidth:2,
                            margin:responsiveHeight(4)}}>
                            <Text style={{
                                textAlign:'center',
                                color:'#252f39',
                                fontSize:responsiveFontSize(2.5)
                            }}>
                                Images below are shared by users of the scavenger hunt
                            </Text>
                        </View>
                        {
                            (this.state.isHuntImagesAvailable)
                                ? <View
                                    style={{
                                        flex:1,
                                        width:responsiveWidth(100),
                                        backgroundColor: '#FFF',
                                        alignItems:'center',
                                        justifyContent:'center',
                                        //  borderColor:'#dd0000',borderWidth:2,
                                        marginBottom:responsiveWidth(5)
                                    }}>
                                    <FlatList
                                        data={this.state.socialImages}
                                        numColumns={3}
                                        renderItem={({item,index}) =>{
                                            return(
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({
                                                            selectedImage:item,
                                                            isImageViewVisible: true})
                                                    }}
                                                    onLongPress={() => {
                                                        {/*this.setState({*/}
                                                            {/*selectedImage:item,*/}
                                                            {/*isReportAbuseVisible: true})*/}
                                                    }}
                                                    >
                                                    <View style={{
                                                        width:responsiveWidth(31),
                                                        height:responsiveWidth(31),
                                                        // borderColor:'#dd0000',borderWidth:2,
                                                        padding:responsiveWidth(2)
                                                    }}>
                                                        <ImageLoad
                                                            style={{
                                                                width:responsiveWidth(31),
                                                                height:responsiveWidth(31),
                                                            }}
                                                            placeholderStyle={{
                                                                width:responsiveWidth(31),
                                                                height:responsiveWidth(31),
                                                            }}
                                                            placeholderSource={require('../../assets/images/placeholder_image.png')}
                                                            source={{uri:item.image_file}}/>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                        //keyExtractor={(item, index) => item.id.toString()}
                                        onEndReached={()=>{
                                            this.fetchMoreSocialImages();
                                        }}
                                        onEndReachedThreshold={0.8}
                                    />
                                    {(this.state.isMoreLoaderVisible) ?
                                        <View style={{position:'absolute',
                                            //borderColor:'#dd0000',borderWidth:2,
                                            bottom:responsiveWidth(5)
                                        }}>
                                            <ActivityIndicator size="large" color="#000"/>
                                        </View>
                                        : null}

                                </View>
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
                {(this.state.isImageViewVisible&&false)
                    ? <View
                        style={{
                            position:'absolute',
                            width:responsiveWidth(100),
                            height:responsiveHeight(100),
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor: 'transparent',
                            zIndex:20,
                        }}>
                        <View style={{
                            position: 'absolute',
                            width:responsiveWidth(100),
                            height:responsiveHeight(100),
                            backgroundColor: 'rgba(0,0,0,0.9)'}}>
                        </View>
                        <View
                            style={{
                                width:responsiveWidth(80),
                                height:responsiveWidth(85),
                                flexDirection:'column',
                                backgroundColor:'transparent',
                               // borderColor:'#dd0000',borderWidth:2
                            }}>
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                    this.setState({
                                        isImageViewVisible: false})
                                }}>
                                <View
                                    style={{
                                        position:'absolute',
                                        right:0,
                                        width:18,
                                        height:18,
                                    }}>
                                    <Image
                                        style={{
                                            width:18,
                                            height:18,
                                            resizeMode: 'contain'}}
                                        source={require('../../assets/images/close_image_icon.png')}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <View
                                style={{
                                    marginTop:28,
                                    flex:1,
                                    backgroundColor:'transparent'
                                }}>
                                <ImageLoad
                                    style={{
                                        width:responsiveWidth(80),
                                        height:responsiveWidth(80),
                                        resizeMode: 'contain'}}
                                    placeholderStyle={{
                                        width:responsiveWidth(80),
                                        height:responsiveWidth(80),
                                        resizeMode: 'contain'}}
                                    placeholderSource={require('../../assets/images/placeholder_image.png')}
                                    source={{uri:selectedImage.image_file}}/>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={()=>{
                                 this.setState({
                                        selectedImage:selectedImage,
                                        isReportAbuseVisible: true,
                                        isImageViewVisible:false})
                                    }}>
                            <View style={{
                                            // borderColor:'#dd0000',borderWidth:2,
                                        backgroundColor: '#34d043',
                                        width:responsiveWidth(40),
                                         borderRadius:responsiveWidth(10),
                                        flexDirection: 'row',
                                        alignItems:'center',
                                        justifyContent:'center',
                                        marginTop:responsiveHeight(7),
                                    }}>
                                <Text style={{
                                   fontSize:responsiveFontSize(1.9),
                                    color: '#fff',
                                    padding:responsiveWidth(3.9),
                                    textAlign: 'center',
                                    fontFamily:'Roboto-Regular'
                                }}>{"Report Abuse"}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    : null
                }
                {(this.state.isReportAbuseVisible&&false)
                    ? <View
                        style={{
                            position:'absolute',
                            width:responsiveWidth(100),
                            height:responsiveHeight(100),
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor: 'transparent',
                            zIndex:20,

                        }}>
                        <View style={{
                            position: 'absolute',
                            width:responsiveWidth(100),
                            height:responsiveHeight(100),
                            backgroundColor: 'rgba(0,0,0,0.9)'}}>
                        </View>
                        <View
                            style={{
                                width:responsiveWidth(80),
                                height:responsiveWidth(85),
                                flexDirection:'column',
                                backgroundColor:'transparent',
                                //borderColor:'#dd0000',borderWidth:2
                            }}>
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                    this.setState({
                                        isReportAbuseVisible: false})
                                }}>
                                <View
                                    style={{
                                        position:'absolute',
                                        right:0,
                                        width:18,
                                        height:18,
                                    }}>
                                    <Image
                                        style={{
                                            width:18,
                                            height:18,
                                            resizeMode: 'contain'}}
                                        source={require('../../assets/images/close_image_icon.png')}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <View
                                style={{
                                    marginTop:28,
                                    flex:1,
                                    backgroundColor:'#fff',
                                    //borderColor:'#dd0000',borderWidth:2,
                                    borderRadius:responsiveWidth(3),
                                    alignItems:'center',justifyContent:'center'
                                }}>
                                <Text style={{color:'#000000',
                                fontSize:responsiveFontSize(2)}}>Report Abuse</Text>
                                <View style={{
                              //  backgroundColor:'#fff',
                                width:responsiveWidth(60),
                                borderRadius:responsiveWidth(10),
                               marginTop:responsiveWidth(5),
                               marginBottom:responsiveWidth(5),
                               borderColor:'#ededed',borderWidth:1,
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
                                           //width:responsiveWidth(60),
                                          // borderColor:'#858383',borderWidth:0.7,
                                           borderRadius:responsiveWidth(10),
                                    }}
                                        itemStyle={{
                                       // borderColor:'#dd0000',borderWidth:2,
                                        borderRadius:responsiveWidth(10),
                                        height:responsiveHeight(18),
                                        fontSize:responsiveFontSize(1.9)
                                    }}>
                                        {
                                            this.state.reportAbuseCategories.map((issue, index) => {
                                                // console.log(issue);
                                                return (

                                                    <Picker.Item
                                                        label={issue.report_category}
                                                        value={issue.id}>
                                                    </Picker.Item>
                                                )
                                            })
                                        }
                                    </Picker>
                                </View>
                                <TouchableOpacity
                                    onPress={()=>{
                                    NetInfo.getConnectionInfo().then((connectionInfo) => {
                                    if (connectionInfo.type === 'none') {
                                        Toast.show('No internet connectivity');
                                    }else{
                                       this.setState({showActivityIndicator: true});
                                    this.reportAbuse(this.state.selectedProblem,this.state.selectedImage)
                                    }});
                                    }}>
                                    <View style={{
                                            // borderColor:'#dd0000',borderWidth:2,
                                        backgroundColor: '#34d043',
                                        width:responsiveWidth(35),
                                         borderRadius:responsiveWidth(10),
                                        flexDirection: 'row',
                                        alignItems:'center',
                                        justifyContent:'center',
                                        marginBottom:responsiveHeight(2),
                                    }}>
                                        <Text style={{
                                   fontSize:responsiveFontSize(1.9),
                                    color: '#fff',
                                    padding:responsiveWidth(3.9),
                                    textAlign: 'center',
                                    fontFamily:'Roboto-Regular'
                                }}>{"Report Abuse"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                    : null
                }
            </View>
            :<View style={{
                                 width:responsiveWidth(100),
                                 height:responsiveHeight(100)}}>
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
                                         }}>Hunt Photos</Text>
                                     </View>
                                 </View>
                                 <View style={{
                                 alignItems:"center",
                                 width:responsiveWidth(100),
                                 height:responsiveHeight(100),
                                 //borderWidth:2,borderColor:'#dd0000',
                                 justifyContent:'center'
                                 }}>
                                     <TouchableOpacity
                                         onPress={() => {
                                 this.getData()
                           }}>

                                         <Text>
                                             {"No Internet"}
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
    social: state.social
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Social);
