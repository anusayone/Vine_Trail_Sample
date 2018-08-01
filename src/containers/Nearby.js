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
    NetInfo,
    FlatList,
    Alert
} from "react-native";
import Toast from "react-native-simple-toast";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import {ActionCreators} from "../actions/index";
import ImageLoad from 'react-native-image-placeholder';
import * as Types from "../constants/types";
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

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
       // marginLeft: responsiveWidth(3)
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
        backgroundColor: '#fff',
        // borderColor:'#dd0000',borderWidth:2,

    },
});

class Nearby extends Component {
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
        this.currentLatitude = '';
        this.currentLongitude = '';
        this.resArray=[];
        this.state = {
            nearByRestaurant: [],
            nearByLodges: [],
            nearByWineries: [],
            isRestaurantsAvailable: false,
            isLodgesAvailable: false,
            isWineriesAvailable: false,
            locationError: null,
            locationTimeOut: 1000 * 60 * 60,
            netstatus:true,
            errortext:"No internet",
        }
    }
    onBackPress = () => {
        this.props.navigation.navigate(Types.DASHBOARD);
        return true;
    };
    getData(){
        //this.setState({netstatus:true});
    this.getNetinfo();
      this.watchId = navigator.geolocation.getCurrentPosition(
          (position) => {
              /// this.currentLatitude = 38.267755;
              // this.currentLongitude = -122.28342500000001;
              this.currentLatitude= position.coords.latitude;
              this.currentLongitude= position.coords.longitude;
              if (this.currentLatitude != '') {
                  if(this.props.nearby.nearByRestaurant.results){
                    this.setState({
                        nearByRestaurant: this.props.nearby.nearByRestaurant.results,
                        isRestaurantsAvailable: true
                    });
                  }else{
                  this.props.getNearByRestaurants(this.currentLatitude, this.currentLongitude).then(() => {
                                       // console.log(this.props.nearby.nearByRestaurant);
                        this.setState({
                            nearByRestaurant: this.props.nearby.nearByRestaurant.results,
                            isRestaurantsAvailable: true
                        });
                        for(i=0;i<3;i++){
                        if(this.state.nearByRestaurant.length>0){
                        let rcoordinates = this.state.nearByRestaurant[i].position.split(',');
                            this.props.getRestaurantsDistance(rcoordinates, this.currentLatitude, this.currentLongitude,this.state.nearByRestaurant[i]).then(() => {

                              })
                        }
                        }

                    });
                  }

                  if(this.props.nearby.nearByLodges.results){
                    this.setState({
                        nearByLodges: this.props.nearby.nearByLodges.results,
                        isLodgesAvailable: true
                    });
                  }else{
                  this.props.getNearByLodges(this.currentLatitude, this.currentLongitude).then(() => {
                                       // console.log(this.props.nearby.nearByLodges);
                                        this.setState({
                                            nearByLodges: this.props.nearby.nearByLodges.results,
                                            isLodgesAvailable: true
                                        });
                                        for(j=0;j<3;j++){
                                          let lcoordinates = this.state.nearByLodges[j].position.split(',');
                                              this.props.getLodgesDistance(lcoordinates, this.currentLatitude, this.currentLongitude,this.state.nearByLodges[j]).then(() => {
                                                })
                                          }
                                    });
                  }
                  if(this.props.nearby.nearByWineries.results){
                    this.setState({
                      nearByWineries: this.props.nearby.nearByWineries.results,
                      isWineriesAvailable: true
                  });
                  }else{
                  this.props.getNearByWineries(this.currentLatitude, this.currentLongitude).then(() => {
                      //console.log(this.props.nearby.nearByWineries);
                      this.setState({
                          nearByWineries: this.props.nearby.nearByWineries.results,
                          isWineriesAvailable: true
                      });
                      for(k=0;k<3;k++){
                        let wcoordinates = this.state.nearByWineries[k].position.split(',');
                            this.props.getWineriesDistance(wcoordinates, this.currentLatitude, this.currentLongitude,this.state.nearByWineries[k]).then(() => {
                              })
                        }
                  });
                  }
              }
          },
          (error) => {this.setState({locationError: error.message})
              Toast.show('Location not Available')
            //    this.setState({errortext:"Turn on Location"})
          },
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
          (isConnected) => { this.setState({ netstatus: isConnected }); }
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
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);

        BackgroundGeolocation.checkStatus(status => {
              console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
              console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
              console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
        if(!status.locationServicesEnabled)
        {
            this.setState({netstatus:false});
        Alert.alert(
          'Location not available',
          'Please turn on location',
          [
            {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => BackgroundGeolocation.showLocationSettings()},
          ],
          { cancelable: false }
        )
        }
        else {
        }
              // you don't need to check status before start (this is just the example)
            });
     this.getData();
        }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
         NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }
    logout() {
        this.props.logout();
        this.props.navigation.navigate('LOGIN_SCREEN');
    }
    render() {
     let user=this.props.session.user;
     //console.log(this.props.explore);
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
                {
                  (this.state.netstatus)?
    <View style={styles.contentView}>
      {
      (user)?
          <View style={{
                  width:responsiveWidth(100),
                  backgroundColor:'#0c0f12',
                  justifyContent:'center'
                  }}>
              <Text style={{color:'#727b85',
               margin:responsiveWidth(5),
               fontSize:responsiveFontSize(2)}}>Welcome
                  <Text style={{color:'#fff',
                      fontSize:responsiveFontSize(2),}}> {user.name}</Text></Text>
          </View>
          :null
}
      <ScrollView
      bounces={false}
          style={{
              //height: responsiveHeight(83),
              marginBottom:responsiveWidth(5)
          }}
          keyboardShouldPersistTaps='handled'
          horizontal={false}
          scrollEnabled={true}>
          <View style={{
              width:responsiveWidth(100),
            // borderColor:'#dd0000',borderWidth:2,
              marginBottom:responsiveWidth(5),
             // borderBottomWidth:2,borderBottomColor:'#dd0000',
              backgroundColor:'#f6f6f6'
              }}>
              <View style={{
                 flexDirection:'row',
                 margin:responsiveWidth(5),
                 minHeight:responsiveHeight(6)
              }}>
                  <Text style={{color:'#252f39',
                          fontSize:responsiveFontSize(2.4),
                          fontFamily:'Roboto-Bold'}}>
                      RESTAURANTS
                  </Text>
                  <View style={{
                      position:'absolute',
                      right:responsiveWidth(0)
                      }}>
                      <TouchableOpacity
                          onPress={() => {
                                      this.props.navigation.navigate(Types.NEARBY_RESTAURANTS);
                                      }}>
                          <View style={{
                              backgroundColor:'#da7c3c',
                              borderRadius:responsiveWidth(2),
                              flexDirection:'row',
                              alignItems:'center'
                              }}>
                              <Text style={{
                                  color:'#fff',
                                  fontSize:responsiveFontSize(1.7),
                                  fontFamily:'Roboto-Light',
                                  margin:responsiveWidth(2)
                                  }}>
                                  View All
                              </Text>
                              <Image
                                  style={{
                                     height: responsiveHeight(2),
                                     width:responsiveHeight(2),
                                     resizeMode: 'cover',marginRight:responsiveWidth(2)
                                  }}
                                  source={require('../../assets/images/right_arrow.png')}/>
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>
              <View style={{
                       alignItems:'center',
                       justifyContent:'center',
                       marginLeft:responsiveWidth(0),
                       paddingRight:responsiveWidth(5),
                       paddingLeft:responsiveWidth(5)
                       }}>
                  <FlatList
                      data={this.state.nearByRestaurant}
                      horizontal={true}
                      renderItem={({item}) =>
                              <TouchableOpacity
                                   onPress={() => {
                                      item.isFromNearBy=true;
                                      this.props.navigation.navigate(Types.NEARBY_DETAIL_SCREEN, item);
                                      }}>
                                      <View
                                          style={{
                                              marginRight:responsiveWidth(5),
                                              width:responsiveWidth(33),
                                              alignItems:'center',
                                              justifyContent:'center',
                                          }}>
                                          <ImageLoad
                                              style={{
                                                  width:responsiveWidth(33),
                                                  height:responsiveWidth(33),
                                                  resizeMode: 'cover',
                                                  }}
                                                  placeholderStyle={{
                                                       width:responsiveWidth(33),
                                                       height:responsiveWidth(33),
                                                       position:'absolute',
                                                       resizeMode: 'cover'
                                                       }}
                                                  placeholderSource={require('../../assets/images/placeholder_image_restaurants.jpeg')}
                                                  source={(item.banner_url==null)
                                                  ?require('../../assets/images/placeholder_image_restaurants.jpeg')
                                                  :{uri:item.banner_url}}
                                                  //source={{uri:item.banner_url}}
                                                  />
                                          <View style={{
                                              backgroundColor:'#f6f6f6',
                                              alignItems:'center',
                                              width:responsiveWidth(33),
                                              minHeight:responsiveHeight(5)
                                           }}>
                                          {(this.props.explore.distance[item.id])
                                               ?<Text style={{
                                                   color:'#4a4a4a',
                                                   //margin:responsiveWidth(2),
                                                   fontSize:responsiveFontSize(1.6)}}
                                                   ellipsizeMode='tail'
                                                   numberOfLines={1}>
                                                   {(this.props.explore.distance[item.id]["0"].elements["0"].status=='OK')
                                                       ?this.props.explore.distance[item.id]["0"].elements["0"].distance.text
                                                       :this.props.explore.distance[item.id]["0"].elements["0"].status
                                                   }
                                               </Text>
                                                :(this.props.explore.distance[this.state.nearByRestaurant[2].id])
                                                ?<Text style={{
                                                      color:'#4a4a4a',
                                                      //margin:responsiveWidth(2),
                                                      fontSize:responsiveFontSize(1.6)}}
                                                      ellipsizeMode='tail'
                                                      numberOfLines={1}>
                                                      {
                                                      (this.props.explore.distance[this.state.nearByRestaurant[2].id]["0"].elements["0"].status=='OK')
                                                         ?"more than "+this.props.explore.distance[this.state.nearByRestaurant[2].id]["0"].elements["0"].distance.text
                                                         :this.props.explore.distance[this.state.nearByRestaurant[2].id]["0"].elements["0"].status
                                                     }
                                                </Text>
                                                :null
                                          }
                                          <Text style={{
                                              color:'#4a4a4a',
                                              margin:responsiveWidth(2),
                                              fontSize:responsiveFontSize(1.6)}}
                                              ellipsizeMode='tail'
                                              numberOfLines={1}
                                              >{item.title}
                                          </Text>

                                          </View>
                                      </View>
                                  </TouchableOpacity>
                          }
                      keyExtractor={(item, index) => index.toString()}/>
              </View>
          </View>
          <View style={{
              width:responsiveWidth(100),
              marginBottom:responsiveWidth(5),
             // borderBottomWidth:2,borderBottomColor:'#dd0000',
              backgroundColor:'#f6f6f6'
              }}>
              <View style={{
                 flexDirection:'row',
                 margin:responsiveWidth(5),
                 minHeight:responsiveHeight(6)
              }}>
                  <Text style={{color:'#252f39',
                          fontSize:responsiveFontSize(2.4),
                          fontFamily:'Roboto-Bold'}}>
                      LODGING</Text>
                  <View style={{
                      position:'absolute',
                      right:responsiveWidth(0)
                      }}>
                      <TouchableOpacity
                          onPress={() => {
                                      this.props.navigation.navigate(Types.NEARBY_LODGES);
                                      }}>
                          <View style={{
                          backgroundColor:'#da7c3c',
                          borderRadius:responsiveWidth(2),
                          flexDirection:'row',
                          alignItems:'center'
                          }}>
                              <Text style={{
                                  color:'#fff',
                                  fontSize:responsiveFontSize(1.7),
                                  fontFamily:'Roboto-Light',
                                  margin:responsiveWidth(2)
                                  }}>View All</Text>
                              <Image
                                  style={{
                                     height: responsiveHeight(2),
                                     width:responsiveHeight(2),
                                     resizeMode: 'cover',marginRight:responsiveWidth(2)
                                  }}
                                  source={require('../../assets/images/right_arrow.png')}/>
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>
              <View style={{
                      alignItems:'center',
                      justifyContent:'center',
                      marginLeft:responsiveWidth(0),
                      paddingRight:responsiveWidth(5),
                      paddingLeft:responsiveWidth(5)
                      }}>
                  <FlatList
                      data={this.state.nearByLodges}
                      horizontal={true}
                      renderItem={({item}) =>
                              <TouchableOpacity
                                   onPress={() => {
                                      item.isFromNearBy=true;
                                      this.props.navigation.navigate(Types.NEARBY_DETAIL_SCREEN, item);
                                      }}>
                                      <View
                                          style={{
                                              marginRight:responsiveWidth(5),
                                              width:responsiveWidth(33),
                                              alignItems:'center',
                                              justifyContent:'center',
                                          }}>
                                          <ImageLoad
                                              style={{
                                                  width:responsiveWidth(33),
                                                  height:responsiveWidth(33),
                                                  resizeMode: 'cover',
                                                  }}
                                                  placeholderStyle={{
                                                       width:responsiveWidth(33),
                                                       height:responsiveWidth(33),
                                                       position:'absolute',
                                                       resizeMode: 'cover'
                                                       }}
                                                  placeholderSource={require('../../assets/images/placeholder_image_lodging.png')}
                                                  source={(item.banner_url==null)
                                                  ?require('../../assets/images/placeholder_image_restaurants.jpeg')
                                                  :{uri:item.banner_url}}
                                                  //source={{uri:item.banner_url}}
                                                  />
                                          <View style={{
                                              backgroundColor:'#f6f6f6',
                                              alignItems:'center',
                                              width:responsiveWidth(33),
                                              minHeight:responsiveHeight(5)
                                           }}>
                                        {(this.props.explore.lodgesDistance[item.id])
                                               ?<Text style={{
                                                   color:'#4a4a4a',
                                                   //margin:responsiveWidth(2),
                                                   fontSize:responsiveFontSize(1.6)}}
                                                   ellipsizeMode='tail'
                                                   numberOfLines={1}>
                                                   {(this.props.explore.lodgesDistance[item.id]["0"].elements["0"].status=='OK')
                                                       ?this.props.explore.lodgesDistance[item.id]["0"].elements["0"].distance.text
                                                       :this.props.explore.lodgesDistance[item.id]["0"].elements["0"].status
                                                   }
                                               </Text>
                                                :(this.props.explore.lodgesDistance[this.state.nearByLodges[2].id])
                                                ?<Text style={{
                                                      color:'#4a4a4a',
                                                      //margin:responsiveWidth(2),
                                                      fontSize:responsiveFontSize(1.6)}}
                                                      ellipsizeMode='tail'
                                                      numberOfLines={1}>
                                                      {
                                                      (this.props.explore.lodgesDistance[this.state.nearByLodges[2].id]["0"].elements["0"].status=='OK')
                                                         ?"more than "+this.props.explore.lodgesDistance[this.state.nearByLodges[2].id]["0"].elements["0"].distance.text
                                                         :this.props.explore.lodgesDistance[this.state.nearByLodges[2].id]["0"].elements["0"].status
                                                     }
                                                </Text>
                                                :null
                                          }
                                          <Text style={{
                                              color:'#4a4a4a',
                                              margin:responsiveWidth(2),
                                              fontSize:responsiveFontSize(1.6)}}
                                              ellipsizeMode='tail'
                                              numberOfLines={1}>{item.title}</Text>

                                          </View>
                                      </View>
                              </TouchableOpacity>
                          }
                      keyExtractor={(item, index) => index.toString()}/>
              </View>
          </View>
          <View style={{
              width:responsiveWidth(100),
              marginBottom:responsiveWidth(5),
             // borderBottomWidth:2,borderBottomColor:'#dd0000',
              backgroundColor:'#f6f6f6'
              }}>
              <View style={{
                 flexDirection:'row',
                 margin:responsiveWidth(5),
                 minHeight:responsiveHeight(6)
              }}>
                  <Text style={{color:'#252f39',
                          fontSize:responsiveFontSize(2.4),
                          fontFamily:'Roboto-Bold'}}>
                      WINERIES
                  </Text>
                  <View style={{
                      position:'absolute',
                      right:responsiveWidth(0)
                      }}>
                      <TouchableOpacity
                          onPress={() => {
                                      this.props.navigation.navigate(Types.NEARBY_WINERIES);
                                      }}>
                          <View style={{
                                  backgroundColor:'#da7c3c',
                                  borderRadius:responsiveWidth(2),
                                  flexDirection:'row',
                                  alignItems:'center'
                              }}>
                              <Text style={{
                                  color:'#fff',
                                  fontSize:responsiveFontSize(1.7),
                                  fontFamily:'Roboto-Light',
                                  margin:responsiveWidth(2)
                                  }}>View All</Text>
                              <Image
                                  style={{
                                     height: responsiveHeight(2),
                                     width:responsiveHeight(2),
                                     resizeMode: 'cover',marginRight:responsiveWidth(2)
                                  }}
                                  source={require('../../assets/images/right_arrow.png')}/>
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>
              <View style={{
                      alignItems:'center',
                      justifyContent:'center',
                      marginLeft:responsiveWidth(0),
                      paddingRight:responsiveWidth(5),
                      paddingLeft:responsiveWidth(5)
                      }}>
                  <FlatList
                      data={this.state.nearByWineries}
                      horizontal={true}
                      renderItem={({item}) =>
                              <TouchableOpacity
                                   onPress={() => {
                                      item.isFromNearBy=true;
                                      this.props.navigation.navigate(Types.NEARBY_DETAIL_SCREEN, item);
                                      }}>
                                      <View
                                          style={{
                                              marginRight:responsiveWidth(5),
                                              width:responsiveWidth(33),
                                              alignItems:'center',
                                              justifyContent:'center',
                                          }}>
                                          <ImageLoad
                                              style={{
                                                  width:responsiveWidth(33),
                                                  height:responsiveWidth(33),
                                                  resizeMode: 'cover',
                                                  }}
                                                  placeholderStyle={{
                                                       width:responsiveWidth(33),
                                                       height:responsiveWidth(33),
                                                       position:'absolute',
                                                       resizeMode: 'cover'
                                                       }}
                                                  placeholderSource={require('../../assets/images/placeholder_image_wineries.png')}
                                                  source={(item.banner_url==null)
                                                   ?require('../../assets/images/placeholder_image_restaurants.jpeg')
                                                   :{uri:item.banner_url}}
                                                  //source={{uri:item.banner_url}}
                                                  />
                                          <View style={{
                                              backgroundColor:'#f6f6f6',
                                              alignItems:'center',
                                              width:responsiveWidth(33),
                                              minHeight:responsiveHeight(5)
                                           }}>
                                          {(this.props.explore.wineriesDistance[item.id])
                                               ?<Text style={{
                                                   color:'#4a4a4a',
                                                   //margin:responsiveWidth(2),
                                                   fontSize:responsiveFontSize(1.6)}}
                                                   ellipsizeMode='tail'
                                                   numberOfLines={1}>
                                                   {(this.props.explore.wineriesDistance[item.id]["0"].elements["0"].status=='OK')
                                                       ?this.props.explore.wineriesDistance[item.id]["0"].elements["0"].distance.text
                                                       :this.props.explore.wineriesDistance[item.id]["0"].elements["0"].status
                                                   }
                                               </Text>
                                                :(this.props.explore.wineriesDistance[this.state.nearByWineries[2].id])
                                                ?<Text style={{
                                                      color:'#4a4a4a',
                                                      //margin:responsiveWidth(2),
                                                      fontSize:responsiveFontSize(1.6)}}
                                                      ellipsizeMode='tail'
                                                      numberOfLines={1}>
                                                      {
                                                      (this.props.explore.wineriesDistance[this.state.nearByWineries[2].id]["0"].elements["0"].status=='OK')
                                                         ?"more than "+this.props.explore.wineriesDistance[this.state.nearByWineries[2].id]["0"].elements["0"].distance.text
                                                         :this.props.explore.wineriesDistance[this.state.nearByWineries[2].id]["0"].elements["0"].status
                                                     }
                                                </Text>
                                                :null
                                          }
                                          <Text style={{
                                              color:'#4a4a4a',
                                              margin:responsiveWidth(2),
                                              fontSize:responsiveFontSize(1.6)}}
                                              ellipsizeMode='tail'
                                              numberOfLines={1}>{item.title}</Text>

                                          </View>
                                      </View>
                              </TouchableOpacity>
                          }
                      keyExtractor={(item, index) => index.toString()}/>
              </View>
          </View>
      </ScrollView>
  </View>
  :
  <View style={{alignItems:"center"}}>
      <TouchableOpacity
          onPress={() => {
            this.getData();
              }}>

          <Text>
              {this.state.errortext}
          </Text>

      </TouchableOpacity>
  </View>
}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    bottomnavigator: state.bottomnavigator,
    session: state.session,
    user: state.user,
    nearby: state.nearby,
    explore:state.explore
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Nearby);
