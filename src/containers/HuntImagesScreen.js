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
    CameraRoll
} from "react-native";
import GridView from "react-native-super-grid";
import ButtonLogin from "../components/ButtonLogin";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import {ActionCreators} from "../actions/index";
import * as Types from "../constants/types";
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
        //resizeMode: 'cover',
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

class HuntImagesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isImageViewVisible: false,
            selectedImage: [],
            huntDetails:[]
        }
    }

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
        </View>),

    }

    onBackPress = () => {
        this.props.navigation.navigate(Types.SCAVENGER_HUNT_DETAILS_SCREEN,this.state.huntDetails);
        return true;
    };

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.setState({
            huntDetails: this.props.hunt.huntDetails,
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    render() {
        let images = this.props.hunt.huntImages;
        let selectedImage = this.state.selectedImage;
        return (
            <View style={{
                alignItems: 'center',
                flex: 1,
                flexDirection: 'column',
            }}>
                <View style={{
                    width:responsiveWidth(100),
                    height:responsiveHeight(100)
                }}>
                    <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.4)'} barStyle={'light-content'}/>
                    <View style={styles.toolbarView}>
                        <TouchableOpacity
                            onPress={() => {
                                this.onBackPress()}}>
                            <Image
                                style={styles.toolbarMenuIcon}
                                source={require('../../assets/images/back_icon.png')}/>
                        </TouchableOpacity>
                        <View style={styles.toolbarNapaIconView}>
                            <Text style={styles.toolbarHeading}>Hunts Photos</Text>
                        </View>
                    </View>
                    <View style={styles.contentView}>
                        {
                            <ScrollView
                                scrollEnabled={true}>
                                <View
                                    style={{
                                            flex:1,
                                            width:responsiveWidth(100),
                                            backgroundColor: '#FFF',
                                            alignItems:'center',
                                            justifyContent:'center'
                                    }}>
                                    <GridView
                                        style={{
                                               }}
                                        items={images}
                                        spacing={0}
                                        itemDimension={responsiveWidth(31)}
                                        renderItem={(item) => (
                                                <TouchableOpacity
                                                 onPress={() => {
                                                    this.setState({
                                                        selectedImage:item,
                                                        isImageViewVisible: true})
                                                 }}>
                                                    <View
                                                        style={{
                                                            height:responsiveWidth(31),
                                                            width:responsiveWidth(31),
                                                            marginLeft:responsiveWidth(1.2),
                                                            marginTop:responsiveWidth(1.2),
                                                            alignItems:'center',
                                                            justifyContent:'center'
                                                        }}>
                                                        <Image
                                                            style={{
                                                                height:111,
                                                                width:111,
                                                                resizeMode: 'cover'}}
                                                            source={{uri:item.image}}
                                                        />
                                                    </View>
                                                 </TouchableOpacity>
                                        )}/>
                                </View>
                            </ScrollView>
                        }
                    </View>
                </View>
                {(this.state.isImageViewVisible)
                    ? <View style={{
                                    position:'absolute',
                                    top:0,
                                    bottom:0,
                                    left:0,
                                    right:0,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    backgroundColor: 'transparent',
                                    zIndex:998,
                             }}>
                        <View style={{
                            position: 'absolute',
                            width:responsiveWidth(100),
                            height:responsiveHeight(100),
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            }}>
                        </View>
                        <View style={{
                            width:responsiveWidth(80),
                            height:responsiveWidth(85),
                            flexDirection:'column'
                        }}>
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                    this.setState({
                                    isImageViewVisible: false})}}>
                                <View style={{
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
                            <View style={{
                                marginTop:28,
                                flex:1,
                            }}>
                                <Image
                                    style={{
                                        width:responsiveWidth(80),
                                        height:responsiveWidth(80),
                                        resizeMode: 'cover'}}
                                    //source={require('../../assets/images/hunt_dummy.png')}
                                    source={{uri:selectedImage.image}}
                                />
                            </View>
                        </View>
                    </View>
                    : null}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    bottomnavigator: state.bottomnavigator,
    session: state.session,
    user: state.user,
    hunt: state.hunt,
    social: state.social
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HuntImagesScreen);
