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
import * as Types from "../constants/types";
import Toast from "react-native-simple-toast";
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
    toolbarNapaIconView: {
        alignItems: 'center',
        flex: 1,
    },
    contentView: {
        ...StyleSheet.absoluteFillObject,
        //borderColor: '#dd0000', borderWidth: 2,
        marginTop: 68,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    },
    toolbarMenuIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain'
    },
});

class SectionMap extends Component {
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
        this.state = {
            isSVGImagesAvailable: false,
            svgImages:[],
            netstatus: true,
            errortext: "No internet"
        }
    }

    onBackPress = () => {
        this.props.navigation.navigate('BottomNavigator');
        //this.props.navigation.navigate(Types.DASHBOARD);
        return true;
    };
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
    getData(){
        this.props.getSVGImages().then(()=>{
                console.log(this.props.misc.svg);
                this.setState({
                    svgImages: this.props.misc.svg,
                    isSVGImagesAvailable: true
                });
            })
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
        navigator.geolocation.clearWatch(this.watchId);
    }

    render() {
       // console.log(this.state.svgImages)
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
                            }}>Section Maps</Text>
                    </View>
                </View>
                <View style={styles.contentView}>
                    {
                        (this.state.isSVGImagesAvailable)
                            ? <FlatList
                            bounces={false}
                                data={this.state.svgImages}
                                renderItem={({item,index}) =>{
                                    return(
                                        <TouchableOpacity onPress={()=>{
                                            this.props.navigation.navigate(Types.SVG_IMAGE_SCREEN,item);
                                        }}>
                                        <View style={{width:responsiveWidth(100),
                                        borderBottomWidth:0.7,
                                        borderBottomColor:'#949494',
                                        alignItems:'center',
                                        padding:responsiveWidth(5)}}>
                                        <Text>{item.title}</Text>
                                        </View>
                                        </TouchableOpacity>
                                    )}
                                }
                                //keyExtractor={(item, index) => item.id.toString()}
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
                          }}>Section Maps</Text>
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
    misc: state.misc
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionMap);
