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
    FlatList,
    ActivityIndicator,
    NetInfo
} from "react-native";
import GridView from "react-native-super-grid";
import ImageLoad from 'react-native-image-placeholder';
import * as Types from "../constants/types";
import {ActionCreators} from "../actions/index";
import {responsiveFontSize, responsiveWidth, responsiveHeight} from "../helpers/Responsive";
import Carousel, {Pagination} from 'react-native-snap-carousel';
const styles = StyleSheet.create({
    toolbarView: {
        width: '100%',
        height: 68,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 22.7,
        paddingRight: 22.7,
        //backgroundColor: this.state.changeToolbarColor ? '#dfdfdf' : '#f2f2f2'
        //borderWidth:1,borderColor:'#dd0000',
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
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});

class ScavengerHuntDetailScreen extends Component {
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
            huntDetails: [],
            changeToolbarColor: false,
            activeSlide: 0,
            slider1Ref: false,
            huntImages: [],
            huntImagesFirst: [],
            isAnyTaskStarted: true,
            netstatus: true,
            errortext: "No internet"
        }
    }

    onBackPress = () => {
        //this.props.navigation.goBack();
        this.props.navigation.navigate(Types.SCAVENGER_HUNT, this.state.huntDetails);
        //this.props.navigation.goBack();
        return true;
    };
    getData(){
        let i = 0;
        console.log(this.props.navigation.state.params);
        let id = this.props.navigation.state.params;
        this.props.getHuntDetails(id).then(() => {
                this.setState({
                    huntDetails: this.props.hunt.huntDetails
                });
            });
    }
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.getNetinfo();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
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
    startTask(item) {
        this.props.startTask(item.id).then(() => {
            console.log(this.props.hunt.startTask.success);
            if (this.props.hunt.startTask.success === "already_opened" || this.props.hunt.startTask.success === "already_explored" || this.props.hunt.startTask.success === "created") {
                this.props.navigation.navigate(Types.SCAVENGER_HUNT_CLUE_SCREEN, item);
            }
        });
    }

    handleScroll(event) {
        console.log(event.nativeEvent.contentOffset.y);
        if (event.nativeEvent.contentOffset.y > 114) {
            console.log("do changes");
            this.setState({
                changeToolbarColor: true
            });
            //console.log(this.state.changeToolbarColor);
        } else {
            this.setState({
                changeToolbarColor: false
            });
        }
    }

    get pagination() {
        //const {slider1Ref} = this.state;
        return (
            <Pagination
                dotsLength={this.props.hunt.huntImages.length>5
                                    ?5
                                    :this.props.hunt.huntImages.length}
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
                      //borderRadius:
                        // (this.state.activeSlide)?10
                         //:1

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

    renderHuntImages(item, index) {
        if (item.index < 5) {
            if ((item.index == 4 && this.state.huntImages.length !== 5)) {
                return (
                    <TouchableOpacity
                        onPress={() => {
                                this.props.navigation.navigate(Types.HUNT_IMAGES_SCREEN);
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
                                   width:responsiveWidth(44),
                                    resizeMode: 'cover'}}
                                source={{uri:String(item.item)}}
                                //source={require('../../assets/images/hunt_dummy.png')}
                            />
                            <Image
                                style={{
                                  height:responsiveWidth(44),
                                   width:responsiveWidth(44),
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
                                    {this.props.hunt.huntImages.length - 5}
                                    {'\n' + "more photos"}

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
                               width:responsiveWidth(44),
                               resizeMode: 'cover'}}
                            source={{uri:item.item}}
                            //source={require('../../assets/images/hunt_dummy.png')}
                        />
                    </View>
                )
        }
    }

    render() {
        let selectedHunt = this.props.hunt.huntDetails;
        let tasks = this.props.hunt.huntDetails.tasks;
        if (this.props.hunt.huntDetails.tasks) {
            let count = 0;
            let i = 0;
            for (i = 0; i < tasks.length; i++) {
                tasks[i].level = i + 1;
                if (tasks[i].status_completed_by_user === true) {
                    count++;
                }
            }
            let progressPercentage = parseInt((count / selectedHunt.no_of_tasks) * 100);
            console.log(progressPercentage);
            selectedHunt.progressPercentage = progressPercentage;
        }
        let welcomeText = String(this.props.hunt.huntDetails.welcome_text);
        let welcomeTextArray = welcomeText.split('\r\n\r\n');
        welcomeTextArray.splice(welcomeTextArray.length - 1, 1);
        // console.log(tasks);
        return (
        (this.state.netstatus)?
            <View style={{
                alignItems: 'center',
                flex: 1,
                flexDirection: 'column',
                backgroundColor: '#fff'
            }}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0)'} barStyle={'light-content'}/>
                {
                    (this.props.hunt.huntDetails.tasks)
                        ? <View style={{
                            height:responsiveHeight(37),
                            width:'100%',
                            position:'absolute',
                        }}>

                            <ImageLoad
                                style={{
                                    height:responsiveHeight(37),
                                    width:'100%',
                                    resizeMode: 'cover'}}
                                placeholderStyle={{
                                    height:responsiveHeight(37),
                                    width:'100%',
                                    resizeMode: 'cover'}}
                                placeholderSource={require('../../assets/images/placeholder_image.png')}
                                source={{uri:selectedHunt.logo}}
                            />
                            <Image
                                style={{
                                    height:responsiveHeight(37),
                                    width:'100%',
                                    resizeMode: 'cover',
                                    position:'absolute'
                                   }}
                                source={require('../../assets/images/hunt_overlay.png')}/>
                            <View style={{
                                width: '100%',
                                height: 68,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                flexDirection: 'row',
                                paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingLeft: 22.7,
                                paddingRight: 22.7,
                                backgroundColor: this.state.changeToolbarColor ? '#252f39' : 'transparent'
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
                                    }}>Hunt Details</Text>
                            </View>
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
                {
                    (this.props.hunt.huntDetails)
                        ? <View style={{
                            marginTop:68,
                             width:responsiveWidth(100),

                    }}>
                            <ScrollView
                                scrollEnabled={true}
                                bounces={false}
                                onScroll={this.handleScroll.bind(this)}
                            >
                                <View>
                                    <View style={{
                                        height:responsiveHeight(37)-68,
                                        width:'100%',

                                    }}>
                                        <Text style={{
                                            paddingLeft:responsiveWidth(3),
                                            paddingTop:responsiveWidth(29),
                                            fontSize:responsiveFontSize(1.6),
                                            fontFamily:'Roboto-Regular',
                                            color:'#fff'}}>
                                            End Date: {selectedHunt.end_date_time}
                                        </Text>
                                        <Text style={{
                                            paddingLeft:responsiveWidth(3),
                                            fontSize:responsiveFontSize(2.5),
                                            fontFamily:'Roboto-Bold',
                                            color:'#fff'}}>
                                            {selectedHunt.name}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flex:1,
                                        width:responsiveWidth(100),
                                        backgroundColor: 'transparent',
                                        marginTop:-responsiveWidth(7.5),
                                        //borderWidth:2,borderColor:'#dd0000'
                                    }}>
                                        {
                                            (tasks)
                                                ? <View style={{
                                                    height:responsiveWidth(15),
                                                    width:responsiveWidth(100),
                                                    backgroundColor:'transparent',
                                                }}>
                                                    <View style={{
                                                        width:responsiveWidth(100),
                                                        height:responsiveWidth(7.5),
                                                        backgroundColor:'transparent'
                                                    }}>

                                                    </View>
                                                    <View style={{
                                                        borderTopColor:'#fe696f',borderTopWidth:1,
                                                        width:responsiveWidth(100),
                                                        height:responsiveWidth(7.5),
                                                        backgroundColor:'#fff'
                                                    }}>
                                                    </View>
                                                        {/*<View style={{*/}
                                                        {/*width: responsiveWidth(15),*/}
                                                        {/*height: responsiveWidth(15),*/}
                                                        {/*backgroundColor: '#54579f',*/}
                                                        {/*borderRadius: 30,*/}
                                                        {/*borderColor: '#fff',*/}
                                                        {/*borderWidth:0.5,*/}
                                                        {/*alignItems: 'center',*/}
                                                        {/*justifyContent: 'center',*/}
                                                        {/*position:'absolute',*/}
                                                        {/*right:responsiveWidth(15)+20+10,*/}
                                                        {/*//top:-responsiveWidth(7.5),*/}
                                                        {/*}}>*/}
                                                        {/*<Text style={{*/}
                                                        {/*color:'#fff',*/}
                                                        {/*fontSize:responsiveFontSize(2.4)}}>{selectedHunt.days_left}</Text>*/}
                                                        {/*<Text style={{*/}
                                                        {/*color:'#fff',*/}
                                                        {/*fontSize:responsiveFontSize(1.3)}}>days left</Text>*/}
                                                        {/*</View>*/}
                                                        {(this.state.isAnyTaskStarted&&selectedHunt.progressPercentage==100)
                                                        ?
                                                        <View style={{
                                                        width:responsiveWidth(15),
                                                        height:responsiveWidth(15),
                                                        backgroundColor: '#fe696f',
                                                        borderRadius: 30,
                                                        borderColor: '#fff',
                                                        borderWidth:0.5,
                                                        alignItems: 'center',
                                                        position:'absolute',
                                                        right:20,
                                                        justifyContent: 'center'
                                                        }}>
                                                        <Text style={{
                                                        color:'#fff',
                                                        fontSize:responsiveFontSize(2.4)}}>{selectedHunt.progressPercentage}%</Text>
                                                        <Text style={{
                                                        color:'#fff',
                                                        fontSize:responsiveFontSize(1.3)}}>progress</Text>
                                                        </View>
                                                        : null
                                                        }
                                                </View>
                                                : null
                                        }
                                        <View style={{
                                            backgroundColor:'#fff',
                                             //borderWidth:0,borderColor:'#dd0000'
                                        }}>
                                            <View style={{
                                                margin:responsiveWidth(4),
                                                //borderColor:'#dd0000',borderWidth:2,
                                                paddingRight:responsiveWidth(3),
                                                paddingLeft:responsiveWidth(3)
                                                }}>
                                                <FlatList
                                                    data={welcomeTextArray}
                                                    renderItem={({item,index}) =>
                                                        <View style={{
                                                    flexDirection:'row',
                                                    marginTop:10,
                                                    alignItems:'center',}}>
                                                <View style={{
                                                            height:10,
                                                            width:10,
                                                        }}>
                                                            <Image
                                                                style={{
                                                                    height: 10,
                                                                    width:10,
                                                                    position:'absolute',
                                                                    resizeMode: 'cover'
                                                                }}
                                                                source={require('../../assets/images/scavenger_hunt_arrow_icons.png')}/>
                                                        </View>
                                                <View style={{
                                                          alignItems:'center',
                                                          paddingLeft:responsiveHeight(1.7),
                                                          }}>
                                                          <Text style={{
                                                                fontFamily:'Roboto-Regular',
                                                                fontSize:responsiveFontSize(1.9),
                                                                color:'#252f39'
                                                                }}>
                                                                {welcomeTextArray[index]}
                                                          </Text>
                                                </View>
                                             </View>
                                                         }
                                                    keyExtractor={(item, index) => index.toString()}>
                                                </FlatList>
                                            </View>
                                        </View>
                                        {
                                            (tasks)
                                                ? <View
                                                    style={{
                                                        padding:responsiveWidth(3),
                                                        backgroundColor:'#fff',
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        marginTop:-5,
                                                        //borderColor:'#dd0000',borderWidth:2,
                                                        }}>
                                                    <GridView
                                                        style={{}}
                                                        items={tasks}
                                                        itemDimension={responsiveWidth(44)}
                                                        spacing={0}
                                                        renderItem={(item,index) => (
                                               <TouchableOpacity
                                                 onPress={() => {
                                                     this.startTask(item);
                                                 }}>
                                            <View
                                                style={{
                                                    paddingLeft:responsiveWidth(2),
                                                    height:responsiveWidth(31),
                                                    width:responsiveWidth(44),
                                                    marginTop:responsiveWidth(4),
                                                    overflow:'hidden'
                                                }}
                                                removeClippedSubviews={true}>
                                                <ImageLoad
                                                    style={{
                                                        height:responsiveWidth(31),
                                                        width:responsiveWidth(44),
                                                        resizeMode: 'cover'}}
                                                    placeholderStyle={{
                                                        height:responsiveWidth(31),
                                                        width:responsiveWidth(44),
                                                        resizeMode: 'cover'}}
                                                    placeholderSource={require('../../assets/images/placeholder_image.png')}
                                                    source={{uri:item.image}}
                                                />
                                                <Image
                                                style={{
                                                    height:responsiveWidth(31),
                                                        width:responsiveWidth(44),
                                                        resizeMode: 'cover',
                                                        position:'absolute'
                                                   }}
                                                source={require('../../assets/images/background.png')}/>
                                                <View style={{
                                                            position:'absolute',
                                                            backgroundColor:(item.status_completed_by_user)?'#0fbb37'
                                                            :(item.status_started_by_user)?
                                                            '#3694dc'
                                                            :'#ff0000',
                                                            right:-responsiveWidth(6),
                                                            top:responsiveWidth(5),
                                                            width:responsiveWidth(27),
                                                           transform: [{ rotate: '45deg'}],
                                                          overflow:'hidden'
                                                        }}
                                                       >
                                                            <Text style={{
                                                                paddingTop:3,
                                                                paddingBottom:3,
                                                                textAlign:'center',
                                                                fontFamily:'Roboto-Medium',
                                                                color:'#fff',
                                                                fontSize:responsiveFontSize(1.3),
                                                            }}>{(item.status_completed_by_user)?"Completed"
                                                            :(item.status_started_by_user)
                                                            ?"In Progress"
                                                            :"Open"}
                                                            </Text>
                                                        </View>
                                                <View style={{
                                                    alignItems:'center',
                                                    justifyContent:'center',
                                                    height:responsiveWidth(31),
                                                    width:responsiveWidth(44),
                                                    position:'absolute'
                                                    }}>
                                                    <Image
                                                    style={{
                                                        height:responsiveWidth(8),
                                                        width:responsiveWidth(8),
                                                        resizeMode: 'cover',
                                                        }}
                                                    source={require('../../assets/images/hunt_level_arrow.png')}/>
                                                        <Text style={{
                                                            fontFamily:'Roboto-Medium',
                                                            color:'#fff',
                                                            fontSize:responsiveFontSize(1.9),
                                                            position:'absolute',
                                                            bottom:responsiveHeight(2.5)
                                                        }}>Task  {item.level}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        )}/>
                                                </View>
                                                : null
                                        }
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        : null
                }
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
                           }}>Scavenger Hunt Detail</Text>

                                     </View>
                      <TouchableOpacity
                          onPress={() => {
                          if(this.state.netstatus){
                            this.getData();
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
    hunt: state.hunt
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScavengerHuntDetailScreen);
