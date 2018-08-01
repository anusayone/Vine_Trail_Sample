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
    Switch,
    ProgressBarAndroid,
    ActivityIndicator,
    Slider,
    Alert,


} from "react-native";
import Video from "react-native-video";

import {BASE_PATH, TRAIL_TOUR_SWITCH, TRAIL_TOUR_LIST} from "../constants/common";
import * as Progress from 'react-native-progress';
import {ActionCreators} from "../actions/index";
import {PermissionsAndroid} from 'react-native';
import * as Types from "../constants/types";
import Toast from "react-native-simple-toast";
import {responsiveHeight, responsiveFontSize, responsiveWidth} from "../helpers/Responsive";
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import RNFetchBlob from 'react-native-fetch-blob';
import {Dialog} from 'react-native-simple-dialogs';

// import PropTypes from 'prop-types'
// import { withNavigationFocus } from 'react-navigation-is-focused-hoc'
var RNFS = require('react-native-fs');
var PushNotification = require('react-native-push-notification');
var playb = require('../../assets/images/play.png');
var pauseb = require('../../assets/images/Pausebutton.png');
var Sound = require('react-native-sound');
var dirPath = (Platform.OS == 'android')
    ? RNFetchBlob.fs.dirs.DownloadDir + '/vinetrail/'
    : RNFetchBlob.fs.dirs.DocumentDir + '/vinetrail/'
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
        // borderColor: '#dd0000', borderWidth: 2
    },
    toolbarNapaIconView: {
        flex: 1
    },
    toolbarNapaIcon: {
        width: responsiveWidth(25),
        height: responsiveFontSize(5),
        resizeMode: 'contain',
        //marginLeft: responsiveWidth(4)
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
        // borderColor: '#dd0000', borderWidth: 2
    },
    toolbarHeading: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Roboto-Medium'
    }
});
class TrailTourScreen extends Component {

    static navigationOptions = {
        gesturesEnabled: false,

        header: null,
        tabBarLabel: () => (
            <Text style={{fontSize: responsiveFontSize(1.6)}}>Trail Tours</Text>
        ),
        tabBarIcon: () => (<View style={{alignItems: 'center', padding: responsiveWidth(2), justifyContent: 'center'}}>
            <Image
                style={{width:responsiveHeight(2.7),height:responsiveHeight(2.7),resizeMode: 'contain'}}
                source={require('../../assets/images/dashboard_trial_tour_icon2.png')}
                resizeMode={'contain'}/>
        </View>),
        onTabChange: () => {
            (newTabIndex) => alert(`New Tab at position ${newTabIndex}`)
        }
    }

    constructor(props) {
        super(props);
        this.currentLatitude = '';
        this.currentLongitude = '';
        //this.title=null;
        //this.url=null;
        //this.message=null;
        //this.type=null;
        this.state = {
            locationError: null,
            locationTimeOut: 1000 * 60 * 60,
            audioTours: [],
            isSettingsSectionVisible: false,
            progress: [],
            isDownloadedArray: [],
            downloadedCheckComplete: false,
            flag: [],
            fullList: [],
            showActivityIndicator: false,
            audioUrl: null,
            SliderValue: 0.0,
            duration: 0.0,
            currentTime: 0.0,
            paused: true,
            playbuttonsource: playb,
            playButtonPressed: [],
            showLoading: false,
            noSpace: false,
            notificationBody: {},
            audioName: null,
            dialogVisible: false,
            audioItem: null,
            isPlaying: false,
            message: null,
            title: null,
            type: null,
            url: null,
            isInitialScreenVisible:false
        }
        video: Video;
    }

    switch = (val, b) => {
        this.setState({
            showActivityIndicator: true,
            audioUrl: null
        });

        if (!this.state.paused) {
            this.playPauseButton();
        }
        this.props.getTrailTour(val, b).then(() => {
            this.setState({
                showActivityIndicator: false
            });
            this.fetchCall();
        });
    }

    renderAcitivityIndicator() {
        if (this.state.showActivityIndicator) {
            return (
                <View style={{
                        backgroundColor:'transparent',
                        width:responsiveWidth(90),
                        height:responsiveHeight(90),
                        alignItems:'center',
                        justifyContent:'center',
                        position:'absolute'
                        }}>
                    <ActivityIndicator size="large" color="#000"/>
                </View>
            );
        }
    }

    async fetchCall() {
        this.setState({
            showActivityIndicator: true
        });
        this.props.getSwitchList().then(() => {
            this.setState({audioTours: this.props.trailTour.trailTourSwitchList});
            this.setState({
                showActivityIndicator: false
            });
            let array = [];
            let fullarray = [];
            array = this.state.audioTours;
            for (i = 0; i < array.length; i++) {
                if (!array[i].sound_enabled)
                    continue;
                let array2 = array[i].category.poi;
                for (j = 0; j < array2.length; j++) {
                    fullarray.push(array2[j]);
                }
            }
            this.setState({fullList: fullarray});
            this.downloadAudio2();
            if (this.state.fullList.length > 0) {
                let audioTours = this.state.fullList;
                audioTours.map((item, index) => {
                    if (item.audio_url != null) {
                        //console.log("kkkkkk");
                        let url = item.audio_url.split('/');
                        let audioTitle = url[url.length - 1];
                        RNFetchBlob.fs.exists(dirPath + audioTitle)
                            .then((exist) => {
                                if (exist) {
                                    console.log("e");
                                    let existArray = this.state.isDownloadedArray;
                                    existArray[index] = true;
                                    this.setState({
                                        isDownloadedArray: existArray
                                    });
                                } else {
                                    console.log("n");
                                    // this.downloadAudio(index,item);
                                    // this.downLoadSingleAudio(index, item);
                                    let existArray = this.state.isDownloadedArray;
                                    existArray[index] = false;
                                    this.setState({
                                        isDownloadedArray: existArray
                                    });
                                }
                            })
                            .catch(() => {
                            })
                    }
                });
            }

        })
    }

    async downLoadSingleAudio(index, item) {
        //console.log(item);
        if (item.audio_url !== null) {
            let url = item.audio_url.split('/');
            let audioTitle = url[url.length - 1];
            console.log("ggggg")
            const ret = await RNFS.downloadFile({
                fromUrl: item.audio_url,
                toFile: dirPath + audioTitle,
                connectionTimeout: 1000 * 10,
                background: true,
                discretionary: true,
                progressDivider: 1,
                resumable: (res) => {
                    console.log("# resumable :", res);
                },
                begin: (res) => {
                    // start event
                },
                progress: (data) => {
                    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
                    // let array = [];
                    // array = this.state.progress;
                    // array[index] = percentage;
                    // this.setState({
                    //     progress: array
                    // });
                    // let flagArray = this.state.flag
                    // flagArray[index] = true
                    // this.setState({
                    //     flag: flagArray
                    // });

                },
            });

            jobId = ret.jobId;

            ret.promise.then((res) => {
                console.log("comp[leeeetesd")
                // this.setState({
                //     showActivityIndicator: false
                // });
                //
                // let array2 = [];
                // array2 = this.state.progress;
                // array2[index] = 1;
                // this.setState({
                //     progress: array2
                // });
                // let flagArray2 = this.state.flag
                // flagArray2[index] = false
                // this.setState({
                //     flag: flagArray2
                // });
                // console.log(this.state.isDownloadedArray);
                // //   Toast.show("Audio downloaded");
                //    // the path should be dirs.DocumentDir + 'path-to-file.anything'
                console.log('The file saved to ', res.path())

                let a = this.state.isDownloadedArray;
                a[index] = true;
                this.setState({
                    isDownloadedArray: a
                });
                console.log('Download finished.');
                RNFS.completeHandlerIOS(jobId);
                jobId = -1;

            }).catch(err => {
                console.log('error');
                jobId = -1;
            });


        }
    }

    onBackPress = () => {
        if (global.value == 0) {
            BackHandler.exitApp();
        } else {
            this.setState({paused: true})
            this.props.navigation.navigate(Types.DASHBOARD);
        }
        return true;
    };

    componentWillMount() {
    AsyncStorage.getItem("firstTime", (err, result) => {
                if (err) {
                console.log(err);
                } else {
                    if (result == null) {
                     console.log("first time in trail tour page")
                        this.setState({isInitialScreenVisible: true})
                       // AsyncStorage.setItem("trail_tour_first_time","true");
                    } else {
                    this.setState({isInitialScreenVisible: false})
                        console.log("not first time in trail tour page")
                         this.checklocation()
                    }
                }
            });

            //navigator.geolocation.clearWatch(this.watchId);





        PushNotification.popInitialNotification(notification => {
            //  var obj = JSON.parse("{audio_url:http://www.largesound.com/ashborytour/sound/brobob.mp3}");
            //  console.log(notification);
            not = notification.audio_url + "";
            //  Toast.show(not);

            global.noturl = notification.audio_url;
            //  props1=this.props;
            if (not != 'null') {
                //this.props.navigation.navigate('TrailTourScreen');
                this.props.navigation.navigate('TrailTourScreen', notification);
            }
        })
    }

    componentWillReceiveProps(nextProps) {

        if (!this.props.isFocused && nextProps.isFocused) {
            // screen enter (refresh data, update ui ...)

            // Toast.show("hello");
        }
        // console.log("componentWillReceiveProps");
    }

    componentDidUpdate() {
        //  console.log("didupdate");


        if (this.props.navigation.state.params != undefined) {
            if (global.notnew) {
                global.notnew = false;
                audiopath = global.noturl;
                if (audiopath == null) {

                    global.notnew = true;
                }
                var myObject = {};
                myObject.title = global.notname;
                myObject.audio_url = global.noturl;
                //     Toast.show(global.noturl+"");
                this.setState({audioUrl: global.noturl});
                this.setState({audioItem: myObject})
                //this.setState({currentTime: 0});
                //this.playPause();
                // if(this.state.audioUrl==null)
                // {
                //   global.notnew=true;
                // }
                //this.setState({paused:false})
                const sound = new Sound(
                    audiopath,
                    undefined,
                    (error) => {
                        if (error) {
                            // console.log(error);
                            this.setState({showLoading: false});

                        } else {
                            this.setState({duration: sound.getDuration()});
                        }
                    }
                );
                this.setState({
                    paused: false,
                    playbuttonsource: pauseb
                });
            }
        }
    }

    registerDevice(token) {
        if (Platform.OS === 'android') {
            this.props.registerDeviceAndroid(token).then(() => {
                //  console.log("androiddd");
            });
        } else {
            this.props.registerDeviceIOS(token).then(() => {
                //  console.log("iosss");
            });
        }
    }

    componentDidMount() {

        this.props.navigation.addListener('willFocus', (route) => {
            //Toast.show("changed");
        });

        //  console.log("didupdate");
        this.props.navigation.addListener('willBlur', (route) => {

            if (!this.state.pause) {

                this.setState({paused: true});
            }

            //Toast.show("changedtab");


        });
        const props1 = this.props;
        let that = this;
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: (token) => {
                console.log('TOKEN:', token);
                if (token !== null) {
                    this.registerDevice(token);
                }
            }
            //console.log(props1);

            // console.log('TOKEN:', token);
            ,
            // (required) Called when a remote or local notification is opened or received
            onNotification: function (notification) {
                //  console.log(notification);
                that.setState({notification: notification})


                if (Platform.OS == 'ios') {
                    if (notification.data.title != undefined)
                        that.setState({title: notification.data.title});
                    if (notification.data.audioUrl != undefined)
                        that.setState({url: notification.data.audioUrl});
                    if (notification.data.message != undefined)
                        that.setState({message: notification.data.message});
                    if (notification.data.category != undefined)
                        that.setState({type: notification.data.category});
                }
                else {
                    if (notification.title != undefined)
                        that.setState({title: notification.title});
                    if (notification.audioUrl != undefined)
                        that.setState({url: notification.audioUrl});
                    if (notification.message != undefined)
                        that.setState({message: notification.message});
                    if (notification.category != undefined)
                        that.setState({type: notification.category});
                }
                //   console.log(that.state.message);
                that.setState({audioItem: notification});
                global.noturl = that.state.url;
                // console.log(notification);
                //var obj = JSON.parse(notification.audio_url);
                that.setState({
                    //notificationBody:
                });
                // that.setState({
                //     //  audioUrl: that.state.notificationBody.audio_url
                // });
                //  that.playPause();
                that.setState({dialogVisible: true});
                // Alert.alert(
                //     "New Notification",
                //     message,
                //     [
                //         {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                //         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                //         {
                //             text: 'OK', onPress: () => {
                //             //if(that.state.notificationBody.length>0){
                //             if(type==="audioTour"&&url!==null)
                //             {
                //                 props1.navigation.navigate('TrailTourScreen', notification);
                //               //  console.log("to true");
                //                 global.notnew = true;
                //                 global.notname=title;
                //                 global.noturl=url;
                //
                //             }
                //             else if(message==="New Scavenger hunt posted")
                //             {
                //                 props1.navigation.navigate('ScavengerHunt', notification);
                //
                //             }
                //         }
                //         },
                //     ],
                //     {cancelable: false}
                // )


                // process the notification
                // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
                //notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: "848471920696",
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,
            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true,
        });

        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: 'Background tracking',
            notificationText: 'enabled',
            debug: false,
            startOnBoot: false,
            stopOnTerminate: false,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 200000,
            fastestInterval: 500000,
            activitiesInterval: 300000,
            stopOnStillActivity: true,
            url: 'http://192.168.81.15:3000/location',
            // httpHeaders: {
            //     'X-FOO': 'bar'
            // },
            // // customize post properties
            // postTemplate: {
            //     lat: '@latitude',
            //     lon: '@longitude',
            //     foo: 'bar' // you can also add your own properties
            // }
        });

        BackgroundGeolocation.on('location', (location) => {
            // handle your locations here
            // to perform long running operation on iOS
            // you need to create background task
            BackgroundGeolocation.startTask(taskKey => {
                // execute long running task
                // eg. ajax post location
                //Toast.show(location.latitude);
                this.props.postLocation(location.latitude, location.longitude).then(() => {
                    // console.log(this.props)
                });
                // IMPORTANT: task has to bex ended by endTask
                BackgroundGeolocation.endTask(taskKey);
            });
        });

        BackgroundGeolocation.on('stationary', (stationaryLocation) => {
            // handle stationary locations here
            //  Actions.sendLocation(stationaryLocation);
        });

        BackgroundGeolocation.on('error', (error) => {
            // console.log('[ERROR] BackgroundGeolocation error:', error);
        });

        BackgroundGeolocation.on('start', () => {
            // console.log('[INFO] BackgroundGeolocation service has been started');
        });

        BackgroundGeolocation.on('stop', () => {
            //console.log('[INFO] BackgroundGeolocation service has been stopped');
        });

        BackgroundGeolocation.on('authorization', (status) => {
             console.log(status);
             console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
            if (status !== BackgroundGeolocation.AUTHORIZED && status==0) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(() =>
                    Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
                        {text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings()},
                        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}
                    ]), 1000);
            }
        });

        BackgroundGeolocation.on('background', () => {
            //  console.log('[INFO] App is in background');
        });

        BackgroundGeolocation.on('foreground', () => {
            // console.log('[INFO] App is in foreground');
        });

        BackgroundGeolocation.checkStatus(status => {
            // console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            //console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
            //console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
            // you don't need to check status before start (this is just the example)
            if (!status.isRunning) {
                AsyncStorage.getItem("notificationOn", (err, result) => {
                    if (result) {
                        if (result == 'true') {
                            BackgroundGeolocation.start(); //triggers start on start event
                        }
                    } else {

                        //this.setState({notificationSwitch:result})
                    }
                });

            }
        });
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        this.checklocation();

    }

    checklocation() {
        //Toast.show("hello");
        this.watchId = navigator.geolocation.getCurrentPosition(
            (position) => {
                //  this.currentLatitude = 38.267755;
                //  this.currentLongitude = -122.28342500000001;
                this.currentLatitude = position.coords.latitude;
                this.currentLongitude = position.coords.longitude;
                if (this.currentLatitude != '') {
                    this.fetchCall();
                } else {
                    Toast.show('Location not Available')
                }
            },
            (error) => {
                this.setState({locationError: error.message});
            },
            {
                enableHighAccuracy: false,
                timeout: this.state.locationTimeOut,
                maximumAge: 600000,
                distanceFilter: 10
            },
        );
    }

    componentWillUnmount() {
        BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        navigator.geolocation.clearWatch(this.watchId);
    }

    async requestDownloadPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': 'Access SD Card',
                    'message': 'Vine Trail will need to access your SD Card to function properly. Please click allow in the next prompt'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log("You can use the SD Card");
                return true;
            } else {
                //console.log("Permission denied");
                return false;
            }
        } catch (err) {
            //console.warn(err);
            return false;
        }
    }

    checkDownloadPermission() {
       this.requestDownloadPermission().then((downloadPermission) => {
                       // console.log("ddoooo")
                        if (downloadPermission) {
                            return true;
                        } else {
                            return false;
                        }
                    });

    }

    downloadAudio(index, item) {
     if (item.audio_url !== null) {
        let url = item.audio_url.split('/');
        let audioTitle = url[url.length - 1];
        RNFetchBlob.fs.exists(dirPath + audioTitle)
            .then((exist) => {
                if (exist) {
                    let a = this.state.isDownloadedArray;
                    a[index] = true;
                    this.setState({
                        isDownloadedArray: a
                    });
                    console.log("already existt");
                } else {
                        let dirs = RNFetchBlob.fs.dirs;
                        let url = item.audio_url.split('/');
                        let audioTitle = url[url.length - 1];
                        RNFS.getFSInfo()
                            .then((info) => {
                                // console.log("Free Space is" + info.freeSpace + "Bytes");
                                console.log("Free Space is" + info.freeSpace / 1024 + "KB");
                                //if (info.freeSpace < 476499970) {
                                //if (true) {
                                if (info.freeSpace < 35000000) {
                                    //console.log("fff")
                                    this.setState({noSpace: true});
                                } else {
                                    RNFetchBlob
                                        .config({
                                            // response data will be saved to this path if it has access right.
                                            // path: RNFetchBlob.fs.dirs.DocumentDir + '/vinetrail/' + audioTitle
                                            path: dirPath + audioTitle
                                        })
                                        .fetch('GET', item.audio_url, {
                                            //some headers ..
                                        })
                                        .progress((received, total) => {
                                            let array = [];
                                            array = this.state.progress;
                                            array[index] = received / total;
                                            this.setState({
                                                progress: array
                                            });
                                            let flagArray = this.state.flag
                                            flagArray[index] = true
                                            this.setState({
                                                flag: flagArray
                                            });
                                        })
                                        .then((res) => {

                                            let array2 = [];
                                            array2 = this.state.progress;
                                            array2[index] = 1;
                                            this.setState({
                                                progress: array2
                                            });
                                            let flagArray2 = this.state.flag
                                            flagArray2[index] = false
                                            this.setState({
                                                flag: flagArray2
                                            });
                                            let a = this.state.isDownloadedArray;
                                            a[index] = true;
                                            this.setState({
                                                isDownloadedArray: a
                                            });
                                            //   Toast.show("Audio downloaded");
                                            // the path should be dirs.DocumentDir + 'path-to-file.anything'
                                            console.log('The file saved to ', res.path())
                                        })
                                }
                            })
                }
            });
            }else{
            Toast.show("No Audio")}
        this.checkDownloadPermission();
    }

    deleteAudio(index, item) {
        //  console.log("deleteee")
        if (item.audio_url !== null) {
            let dirs = RNFetchBlob.fs.dirs;
            let url = item.audio_url.split('/');
            let audioTitle = url[url.length - 1];
            RNFetchBlob.fs.exists(dirPath + audioTitle)
                .then((result) => {
                    console.log("file exists: ", result);

                    if (result) {
                        return RNFS.unlink(dirPath + audioTitle)
                            .then(() => {
                                let existArray2 = this.state.isDownloadedArray;
                                existArray2[index] = false;
                                this.setState({
                                    isDownloadedArray: existArray2
                                });
                            })
                            // `unlink` will throw an error, if the item to unlink does not exist
                            .catch((err) => {
                                console.log(err.message);
                            });
                    }

                })
                .catch((err) => {
                    console.log(err.message);
                });

        } else {
            Toast.show("No Audio")
        }
       // this.checkDownloadPermission();

    }

    async downloadAudio2() {
        console.log("insiddeee download 2")
        // this.requestDownloadPermission().then((downloadPermission) => {
        // if (true) {
        let dirs = RNFetchBlob.fs.dirs;
        // this.setState({
        //     showActivityIndicator: true
        // });
        let audioTours = this.state.fullList;
        //     for (i = 0; i < audioTours.length; i++) {
        //         if(audioTours[i].audio_url!==null){
        //             let url = audioTours[i].audio_url.split('/');
        //             let audioTitle = url[url.length - 1];
        //             console.log("Downlaoding" + audioTours[i].audio_url);
        //             RNFetchBlob
        //                 .config({
        //                     // response data will be saved to this path if it has access right.
        //                     useDownloadManager: true,
        //                     fileCache: true,
        //                     overwrite: false,
        //                     // path: RNFetchBlob.fs.dirs.DocumentDir + '/vinetrail/' + audioTours[i].title,
        //                     path: RNFetchBlob.fs.dirs.DocumentDir + '/vinetrail/' + audioTitle,
        //
        //
        //                     // setting it to true will use the device's native download manager and will be shown in the notification bar.
        //                     notification: true,
        //
        //                     description: 'Downloading image.'
        //
        //                     //path: dirs.DownloadDir + '/vinetrail/' + audioTitle
        //                 })
        //                 .fetch('GET', audioTours[i].audio_url, {
        //                     //some headers ..
        //                 })
        //                 .progress((received, total) => {
        //                      // let array = [];
        //                      // array = this.state.progress;
        //                      // array[i] = received / total;
        //                      // this.setState({
        //                      //     progress: array
        //                      // });
        //                      // let flagArray = this.state.flag
        //                      // flagArray[i] = true
        //                      // this.setState({
        //                      //     flag: flagArray
        //                      // });
        //                     // console.log(received/total+"");total
        //                 })
        //                 .then((res) => {
        //                     // this.setState({
        //                     //     showActivityIndicator: false
        //                     // });
        //
        //                         let array2 = [];
        //                         array2 = this.state.progress;
        //                         array2[i] = 1;
        //                         this.setState({
        //                             //progress: array2
        //                         });
        //                     let flagArray2 = this.state.flag
        //                     flagArray2[i] = false
        //                     this.setState({
        //                         flag: flagArray2
        //                     });
        //                     let a = this.state.isDownloadedArray;
        //                     a[i] = true;
        //                     this.setState({
        //                         //isDownloadedArray: a
        //                     });
        //                    // console.log(this.state.isDownloadedArray);
        //                     // //   Toast.show("Audio downloaded");
        //                     //    // the path should be dirs.DocumentDir + 'path-to-file.anything'
        //                     console.log('The file saved to ', res.path())
        //
        //                 })
        //             console.log(this.state.isDownloadedArray);
        //             // this.setState({
        //             //   //  showActivityIndicator: false
        //             // });
        //         }
        //
        //     }
        //     return true;
        // } else {
        //     return false;
        // }
        // });
        console.log(audioTours.length);
        for (i = 0; i < audioTours.length; i++) {
            let url = audioTours[i].audio_url.split('/');
            let audioTitle = url[url.length - 1];
            let audio = audioTours[i];
            RNFetchBlob.fs.exists(dirPath + audioTitle)
                .then((exist) => {
                    if (exist) {
                        console.log("skippp");
                        let ax = this.state.isDownloadedArray;
                        ax[i] = true;
                        this.setState({
                            isDownloadedArray: ax
                        });
                        console.log(isDownloadedArray);
                    } else {
                    let ax = this.state.isDownloadedArray;
                    ax[i] = false;
                    ///console.log(this.state.isDownloadedArray);
                    this.setState({
                        isDownloadedArray: ax
                        });
                        if (audio.audio_url != null) {
                            const ret = RNFS.downloadFile({
                                fromUrl: audio.audio_url,
                                toFile: dirPath + audioTitle,
                                //connectionTimeout: 1000 * 10,
                                background: true,
                                discretionary: true,
                                progressDivider: 1,
                                resumable: (res) => {
                                    console.log("# resumable :", res);
                                },
                                begin: (res) => {
                                    // start event
                                },
                                progress: (data) => {
                                //console.log("e")
//                                    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
//                                     let array = [];
//                                     array = this.state.progress;
//                                     array[i] = percentage;
//                                     this.setState({
//                                         progress: array
//                                     });
//                                     let flagArray = this.state.flag
//                                     flagArray[i] = true
//                                     this.setState({
//                                         flag: flagArray
//                                     });

                                },
                            });

                            jobId = ret.jobId;

                            ret.promise.then((res) => {
                                console.log("compleeeetesd")
                               // console.log(this.state.isDownloadedArray);
                                //console.log(res)
                                 this.setState({
                                     showActivityIndicator: false
                                 });

//                                 let array2 = [];
//                                 array2 = this.state.progress;
//                                 array2[i] = 1;
//                                 this.setState({
//                                     progress: array2
//                                 });
//                                 let flagArray2 = this.state.flag
//                                 flagArray2[i] = false
//                                 this.setState({
//                                     flag: flagArray2
//                                 });
                                // console.log(this.state.isDownloadedArray);
                                // //   Toast.show("Audio downloaded");
                                //    // the path should be dirs.DocumentDir + 'path-to-file.anything'

                                let a = this.state.isDownloadedArray;
                                a[i] = true;
                                this.setState({
                                    isDownloadedArray: a
                                });
                                console.log('Download finished.');
                                //RNFS.completeHandlerIOS(jobId);
                                //jobId = -1;

                            }).catch(err => {
                                console.log(err);
                                jobId = -1;
                            });

                        } else {
                            console.log("no audio");
                        }
                    }
                  // console.log(this.state.isDownloadedArray);

                })
        }
    }

    onLoadStart = () => {
           this.setState({showLoading: true});
       }

    onLoad = (data) => {
        //  this.video.seek(0);
        this.setState({showLoading: false});
        // this.setState({duration: data.duration});
    };

    skip = (data) => {
        this.video.seek(this.state.currentTime + data);
        //  Toast.show("skipping");
    };

    onProgress = (data) => {
        this.setState({currentTime: data.currentTime});
        this.setState({SliderValue: this.getCurrentTimePercentage()})
    };

    getCurrentTimePercentage = () => {
        if (this.state.currentTime > 0) {
            return ( parseFloat(this.state.currentTime) / parseFloat(this.state.duration) * 100);
        }
        return 0;
    };

    seektotime = (value) => {
        this.video.seek(parseFloat(this.state.duration / 100 * value));
    }

    onEnd = () => {
    //Toast.show("end");
        if (Platform.OS == 'ios') {
        Toast.show("end");
       // this.setState({SliderValue:0});
        this.setState({paused:true})
        //this.video.seek(2);
            var turl = this.state.audioUrl;
            this.setState({audioUrl: turl});
            this.setState({
                paused: true,
                playbuttonsource: playb,
               SliderValue: 0
            });
        }
        else {
            this.video.seek(0);
            var turl = this.state.audioUrl;
            this.setState({audioUrl: turl});
            this.setState({paused: true});
            this.setState({
                paused: true,
                playbuttonsource: playb,
                SliderValue: 0
            });
            //  this.video.seek(2);

            //     this.setState({paused:true});
        }
    };

    playPauseButton() {
    var diff = Math.abs( this.state.currentTime - this.state.duration );

  // console.log(this.state.duration) ;
   //console.log(this.state.currentTime) ;
   if(this.video&&diff<=1){
          console.log("this.video.seek(0);")
          this.video.seek(0);
          }
        if (this.state.fullList.length > 0) {
            if (this.state.audioUrl == null && this.state.fullList[0].audio_url !== null) {
                // console.log(">0");
                this.setState({audioItem: this.state.fullList[0]});
                this.setState({
                    audioName: this.state.fullList[0].title,
                    audioUrl: this.state.fullList[0].audio_url
                });
                const sound = new Sound(
                    this.state.fullList[0].audio_url,
                    undefined,
                    (error) => {
                        if (error) {
                            //  console.log(error);
                        } else {
                            this.setState({duration: sound.getDuration()});
                        }
                    }
                );
            }
            this.setState({paused: !this.state.paused});
            if (this.state.paused) {
                this.setState({playbuttonsource: pauseb})
            }
            else {
                this.setState({playbuttonsource: playb})
            }
        } else {
            this.setState({
                audioName: null
            });
            Toast.show("No Audio");
        }
    }

    audioItemPressed(item, index) {
        //  console.log("k");
       if(this.video){
       //console.log("this.video.seek(0);")
       this.video.seek(0);
       }
        if (item.audio_url != null) {
            //   console.log(item);
            let a = this.state.playButtonPressed;
            for (i = 0; i < this.state.fullList.length; i++) {
                if (i == index) {
                    a[index] = true;
                } else {
                    a[i] = false
                }
            }
            this.setState({playButtonPressed: a});
            this.setState({audioItem: item});
            const sound = new Sound(
                item.audio_url,
                undefined,
                (error) => {
                    if (error) {
                        // console.log(error);
                    } else {
                        this.setState({duration: sound.getDuration()});
                    }
                }
            );
            this.setState({
                paused: false,
                playbuttonsource: pauseb
            });
            let url = item.audio_url.split('/');
            let audioTitle = url[url.length - 1];
            RNFetchBlob.fs.exists(dirPath + audioTitle)
                .then((exist) => {
                    if (exist) {
                    console.log("existttt");
                        let existArray = this.state.isDownloadedArray;
                        existArray[index] = true;
                        this.setState({
                            isDownloadedArray: existArray
                        });
                        RNFetchBlob.fs.readStream(dirPath + audioTitle, 'uri')
                            .then((data) => {
                                // this.video.seek(0);
                                this.setState({audioUrl: data.path});
                                 console.log(data)
                            })
                    } else {
                        this.setState({audioUrl: item.audio_url});
                    }
                })
            return true;

        }
        else {
            Toast.show("No Audio");
        }
    }

    render() {
        return (
            <View style={styles.containerView}>
                <StatusBar translucent={true}
                           backgroundColor={'rgba(0,0,0,0.4)'}
                           barStyle={'light-content'}/>
                <View style={styles.toolbarView}>
                    <View style={styles.toolbarNapaIconView}>
                        <Image
                            style={styles.toolbarNapaIcon}
                            source={require('../../assets/images/napa_valley_logo.png')}/>
                    </View>
                    {(!this.state.isInitialScreenVisible)
                    ?<TouchableOpacity
                         onPress={()=>{
                             if(this.state.isSettingsSectionVisible){
                                  this.setState({isSettingsSectionVisible: false});
                             }else{
                                 this.setState({isSettingsSectionVisible: true});
                             }
                         }}>
                         <Image
                             style={(this.state.isSettingsSectionVisible)
                             ?{
                                 width: 17,
                                 height: 15,
                                 resizeMode: 'contain',
                                 marginRight: 0,
                             }
                             :styles.toolbarNotificationIcon}
                             source={(this.state.isSettingsSectionVisible)
                             ?require('../../assets/images/close_image_icon.png')
                             :require('../../assets/images/dashboard_settings.png')}/>
                     </TouchableOpacity>
                     :null}
                </View>
                {(this.state.isInitialScreenVisible)
                ?<View style={{...StyleSheet.absoluteFillObject,
                                       marginTop: 68,
                                       alignItems: 'center',
                                       backgroundColor: '#fff',
                                       justifyContent:'center',
                                        //borderColor: '#dd0000', borderWidth: 2
                                        }}>
                                        <View style={{width:responsiveWidth(70)}}>
                                        <Text style={{fontSize:responsiveFontSize(2),
                                        fontFamily:'Roboto-Bold',textAlign:'center'}}>Welcome to the Vine Trail Audio Tours</Text>
                                                <Text style={{fontSize:responsiveFontSize(1.8),
                                                             fontFamily:'Roboto-Regular',
                                                             marginTop:responsiveWidth(4),textAlign:'center',}}>
                                                In order to proceed, please select a “cluster” from top right settings menu which will automatically download sound files for the tour you selected.
                                                      </Text>
                                                      <Text style={{fontSize:responsiveFontSize(1.8),
                                                     fontFamily:'Roboto-Regular',
                                                     marginTop:responsiveWidth(4),textAlign:'center',}}>
                                                      When you pass a specific point of interest that is associated with your downloaded audio files, the sound will automatically play information based on your GPS coordinates and the audio tours you selected.
                                                      </Text>
                                                      </View>
                                            <TouchableOpacity
                                                        onPress={()=>{
                                                         AsyncStorage.setItem("firstTime", JSON.stringify({"value":"true"}), (err,result) => {
                                                         console.log(result)
                                                     });
                                                      this.checklocation();
                                                       this.setState({isInitialScreenVisible: false});
                                                            }}>
                                                    <View style={{
                                                         //borderColor:'#dd0000',borderWidth:2,
                                                        backgroundColor: '#34d043',
                                                        width:responsiveWidth(50),
                                                        borderRadius:responsiveWidth(10),
                                                        flexDirection: 'row',
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        marginBottom:responsiveHeight(7),
                                                        marginTop:responsiveHeight(7)
                                                        }}>

                                                        <Text style={{
                                                       fontSize:responsiveFontSize(1.9),
                                                        color: '#fff',
                                                        padding:responsiveWidth(3.9),
                                                        textAlign: 'center',
                                                        fontFamily:'Roboto-Regular'
                                                    }}>{"OK"}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                        </View>
                :<View style={styles.contentView}>
                                     {(this.state.isSettingsSectionVisible)
                                         ? <View style={{
                                                 width:responsiveWidth(100),
                                                // borderColor:'#dd0000',borderWidth:2,
                                                 backgroundColor:'#252f39',
                                                 position:'absolute',
                                                 zIndex:999
                                             }}>
                                                {(this.state.audioTours.length>0)
                                                ?<FlatList
                                                  data={this.state.audioTours}
                                                  renderItem={({item,index}) =>{
                                                      return(
                                                          <View style={{
                                                              width:responsiveWidth(100),
                                                              //height:responsiveHeight(10),
                                                              borderColor:'#000',
                                                              borderWidth:0.7,
                                                              flexDirection:'row',
                                                              alignItems:'center',}}>
                                                              <View style={{
                                                                 // borderColor:'#dd0000',borderWidth:2,
                                                                  flex:1}}>
                                                              <Text style={{
                                                                      color:'#fff',
                                                                      fontFamily:'Roboto-Regular',
                                                                      fontSize:responsiveFontSize(1.8),
                                                                      padding:responsiveWidth(3.4)
                                                                      }}>
                                                                      {item.category.category}
                                                              </Text>
                                                              </View>
                                                              <Switch
                                                                  style={{marginRight:responsiveWidth(5)}}
                                                                  onValueChange={(value) => {
                                                                      this.switch (item.category.id,value)} }
                                                                  onTintColor={'#fff'}
                                                                  tintColor={'#949494'}
                                                                  thumbTintColor={'#000'}
                                                                  value = {item.sound_enabled}
                                                              />
                                                          </View>
                                                      )
                                                  }}
                                                  onEndReached={()=>{
                                                  }}
                                                  onEndReachedThreshold={0.6}
                                              />
                                              :<View style={{
                                                 width:responsiveWidth(100),
                                                 borderColor:'#000',
                                                 borderWidth:0.7,
                                                 flexDirection:'row',
                                                 alignItems:'center',}}>
                                                 <Text style={{
                                                       color:'#fff',
                                                       fontFamily:'Roboto-Regular',
                                                       fontSize:responsiveFontSize(1.8),
                                                       padding:responsiveWidth(3.4)
                                                       }}>
                                                       {"Empty"}
                                               </Text>
                                                 </View>
                                                }
                                         </View>
                                         : null
                                     }
                                     {this.renderAcitivityIndicator()}
                                     <TouchableWithoutFeedback
                                         onPress={()=>{
                                         if(this.state.isSettingsSectionVisible){
                                                  this.setState({isSettingsSectionVisible: false});
                                             }
                                         }}
                                         style={{
                                         borderColor:'#dd0000',borderWidth:2,
                                         }}>
                                     <View style={{
                                      //...StyleSheet.absoluteFillObject,
                                         height:(this.state.audioItem!==null)?responsiveHeight(72)-56-68:null,
                                         alignItems:'center',
                                         justifyContent:'center',
                                         //borderColor:'#DD0000',borderWidth:2
                                     }}>
                                         {
                                             (this.state.fullList.length > 0)
                                                 ? <FlatList
                                                     data={this.state.fullList}
                                                     onScroll={()=>{
                                                     if(this.state.isSettingsSectionVisible){
                                                              this.setState({isSettingsSectionVisible: false});
                                                         }
                                                     }}
                                                     renderItem={({item,index}) =>{
                                             return(
                                                 <View style={{
                                                     width:responsiveWidth(100),
                                                     borderBottomColor:'#c4c4c4',
                                                     borderBottomWidth:1}}>
                                                     <View style={{
                                                         flexDirection:'row',
                                                         alignItems:'center',
                                                         //borderColor:'#DD0000',borderWidth:2
                                                         }}>
                                                         <View style={{
                                                         alignItems:'center',
                                                         //borderColor:'#dd0000',borderWidth:1,
                                                         margin:responsiveWidth(5),
                                                         borderRadius:responsiveWidth(2),
                                                         backgroundColor:'#434586'
                                                         }}>
                                                         <Image
                                                         style={{
                                                               height:responsiveHeight(4),
                                                               width:responsiveHeight(4),
                                                               resizeMode: 'contain',
                                                                 margin:responsiveWidth(2)
                                                               }}
                                                         source={{uri:item.category_image_url}}
                                                         //source={require('../../assets/images/trail_tour_music_icon2.png')}
                                                             />
                                                         </View>
                                                     <View style={{
                                                         flex:1,
                                                         //borderColor:'#dd0000',borderWidth:2,

                                                     }}>
                                                     <TouchableOpacity
                                                         onPress={()=>{
                                                                 this.audioItemPressed(item,index);
                                                         }}
                                                         style={{
                                                         paddingTop:responsiveWidth(5),
                                                         paddingBottom:responsiveWidth(5),
                                                         //borderColor:'#dd0000',borderWidth:2,
                                                         }}>
                                                         <Text style={{
                                                              color:'#1c232b',
                                                             fontFamily:'Roboto-Regular',
                                                             fontSize:responsiveFontSize(1.8),
                                                             }}>
                                                             {item.title}
                                                         </Text>
                                                     </TouchableOpacity>
                                                     </View>
                                                     {(this.state.flag[index])
                                                         ? <View style={{ padding:responsiveWidth(5),}}>
                                                         <Progress.Circle
                                                             showsText={true}
                                                             progress={this.state.progress[index]}
                                                             strokeCap={"square"}
                                                             color={"#da7c3c"}
                                                             //width={responsiveHeight(20)}
                                                         />
                                                         </View>
                                                         :(this.state.isDownloadedArray[index])
                                                         ?<TouchableOpacity
                                                         onPress={()=>{
                                                                 //console.log("inside")
                                                                  this.deleteAudio(index,item);
                                                             }}>
                                                         <View style={{
                                                             //borderColor:'#dd0000',borderWidth:2,
                                                             padding:responsiveWidth(5),
                                                             }}>
                                                                <Image
                                                                 style={{
                                                                       height:responsiveHeight(5),
                                                                       width:responsiveHeight(5),
                                                                       resizeMode: 'contain',
                                                                       //marginRight:responsiveWidth(5)
                                                                       }}
                                                                 source={require('../../assets/images/delete.png')}
                                                                 />
                                                          </View>
                                                         </TouchableOpacity>
                                                         :<TouchableOpacity
                                                             onPress={()=>{
                                                                 //console.log("inside")
                                                                  this.downloadAudio(index,item);
                                                             }}>
                                                         <View style={{
                                                            // borderColor:'#dd0000',borderWidth:2,
                                                             padding:responsiveWidth(5),
                                                         }}>
                                                            <Image
                                                             style={{
                                                                   height:responsiveHeight(5),
                                                                   width:responsiveHeight(5),
                                                                   resizeMode: 'contain',
                                                                   //marginRight:responsiveWidth(5)
                                                                   }}
                                                             source={require('../../assets/images/trail_tour_download_arrow.png')}/>
                                                         </View>
                                                     </TouchableOpacity>
                                                     }
                                                     <TouchableOpacity
                                                         onPress={()=>{
                                                             this.audioItemPressed(item,index);
                                                         }}>
                                                         <View style={{
                                                             paddingTop:responsiveWidth(5),
                                                             paddingBottom:responsiveWidth(5),
                                                             paddingRight:responsiveWidth(5),
                                                         }}>
                                                            <Image
                                                             style={{
                                                                   height:responsiveHeight(5),
                                                                   width:responsiveHeight(5),
                                                                   resizeMode: 'contain',
                                                                   }}
                                                             source={(this.state.audioItem!==null&&this.state.audioItem.title===item.title)
                                                             ?require('../../assets/images/play_pressed.png')
                                                             :require('../../assets/images/trail_tour_play_button.png')}
                                                             />
                                                         </View>
                                                     </TouchableOpacity>

                                                  </View>
                                                 </View>
                                                 )}}
                                                     //keyExtractor={(item, index) => item.id.toString()}
                                                     onEndReached={()=>{
                                                    // this.fetchMoreRestaurants();
                                                 }}
                                                     onEndReachedThreshold={0.6}/>
                                                 :
                                                 <View style={{
                                                 //...StyleSheet.absoluteFillObject,
                                                             //marginTop: 68,
                                                             width:responsiveWidth(100),
                                                             height:responsiveHeight(100),
                                                             //alignItems: 'center',
                                                             backgroundColor: '#fff',
                                                             justifyContent:'center',
                                                             // borderColor: '#dd0000', borderWidth: 2
                                                              }}>
                                                 <TouchableOpacity
                                                     onPress={()=>{
                                                         //console.log("inside")
                                                         this.checklocation();

                                                     }}>
                                                     <View style={{flexDirection:'column',alignItems:'center'}}>
                                                         <Text style={{
                                                 fontSize:responsiveFontSize(2),
                                                 color:'#000'}}>
                                                             No Audio Available
                                                         </Text>
                                                         <Text style={{
                                                   alignItems:'center',
                                                 fontSize:responsiveFontSize(1.5),
                                                 color:'#000'}}>
                                                             Tap to Retry or select any section
                                                         </Text>
                                                     </View>
                                                 </TouchableOpacity>
                                                 </View>
                                         }
                                 </View>
                                 </TouchableWithoutFeedback>
                                     {(this.state.audioItem!==null)?
                                     <View style={{
                                        width:responsiveWidth(100),
                                         height:responsiveHeight(28),
                                        position:'absolute',
                                        //borderColor:"#dd0000",borderWidth:2,
                                        bottom:0,
                                        backgroundColor:"#434586",
                                     }}>

                                     {(this.state.audioUrl !== null)
                                         ? <Video
                                             style={{

                                                 }}
                                             progressUpdateInterval={250}
                                             onEnd={this.onEnd}
                                             repeat={false}
                                             resizeMode={"contain"}
                                             onLoad={this.onLoad}
                                             onLoadStart={this.onLoadStart}
                                             source={{uri: this.state.audioUrl}}
                                             posterResizeMode={"contain"}
                                             paused={this.state.paused}
                                             onProgress={this.onProgress}
                                             ref={(ref: Video) => { this.video = ref }}
                                         />
                                         : null}
                                     <View style={{
                                         alignItems:'center',
                                         justifyContent:'center',
                                         //borderColor:"#dd0000",borderWidth:2,
                                         padding:responsiveWidth(5),
                                         flexDirection:'row'
                                     }}>
                                         <View style={{flex:1,
                                         flexDirection:'row',
                                         //borderColor:"#fff",borderWidth:0.7,
                                         }}>
                                             <View style={{
                                                   borderColor:"#fff",borderWidth:0.7,
                                                   alignItems:'center',
                                                   justifyContent:'center',
                                                   //height:responsiveHeight(7),
                                                   //width:responsiveHeight(7),
                                                   }}>
                                                 <Image
                                                     style={{
                                                           height:responsiveHeight(5),
                                                           width:responsiveHeight(5),
                                                           resizeMode: 'contain',
                                                           margin:responsiveWidth(2)
                                                           }}
                                                     source={(this.state.audioItem !== null)?
                                                     {uri:this.state.audioItem.category_image_url}
                                                     :require('../../assets/images/play.png')}
                                                     //source={require('../../assets/images/play.png')}
                                                 />
                                             </View>
                                             <View >
                                                 <Text style={{
                                                     color:'#fff',
                                                     fontSize:responsiveFontSize(1.5),
                                                     marginLeft:responsiveWidth(5)
                                                 }}
                                                       ellipsizeMode='tail'
                                                       numberOfLines={2}>{(this.state.audioItem !== null)
                                                     ? this.state.audioItem.title
                                                     : null}</Text>
                                                 <Text style={{
                                                     color:'#fff',
                                                     fontSize:responsiveFontSize(1.3),
                                                     marginLeft:responsiveWidth(5),
                                                     fontFamily:'Roboto-Light'
                                                 }}>{(this.state.duration).toFixed(2)}</Text>
                                             </View>


                                         </View>

                                         <View style={{flex:1}}>

                                         </View>

                                     </View>
                                     <View style={{
                                        flexDirection:'row',
                                        //position:'absolute',
                                        //borderColor:"#dd0000",borderWidth:2,
                                        //paddingTop:responsiveWidth(4),
                                        //paddingBottom:responsiveWidth(4),
                                        alignItems:'center',
                                        justifyContent:'center'
                                     }}>
                                         <Slider
                                             step={ 1 }
                                             minimumValue={ 0 }
                                             maximumValue={ 100 }
                                             minimumTrackTintColor="#fff"
                                             maximumTrackTintColor="#fff"
                                             thumbTintColor="#fff"
                                             value={this.state.SliderValue}
                                             onSlidingComplete={this.seektotime}
                                             style={{
                                                  flex:1,
                                             }}/>
                                     </View>
                                     <View style={{
                                        // borderColor:'#dd0000',borderWidth:2,
                                           alignItems:'center',
                                           flexDirection:'row',
                                           justifyContent:'center',
                                           //marginBottom:responsiveWidth(6)
                                     }}>
                                             <TouchableOpacity
                                                 onPress={()=>{
                                                      if (this.state.audioUrl !== null) {
                                                       this.video.seek(0);
                                                       }
                                                 }}
                                                 style={{
                                                   //borderColor:"#dd0000",borderWidth:2,
                                                   position:'absolute',
                                                   left:responsiveWidth(5)
                                                 }}>
                                                 <Image
                                                     style={{
                                                          height:responsiveHeight(5),
                                                          width:responsiveHeight(5),
                                                          resizeMode: 'contain',
                                                          //marginRight:responsiveWidth(5)
                                                          }}
                                                     source={require('../../assets/images/refresh.png')}
                                                 />
                                             </TouchableOpacity>
                                             <TouchableOpacity
                                                 onPress={()=>{
                                                     if (this.state.audioUrl !== null) {
                                                     this.skip(-10);
                                                     }
                                                 }}
                                                 style={{
                                                   //borderColor:"#dd0000",borderWidth:2,
                                                 }}>
                                                 <Image
                                                     style={{
                                                          height:responsiveHeight(5),
                                                          width:responsiveHeight(5),
                                                          resizeMode: 'contain',
                                                          //marginRight:responsiveWidth(5)
                                                          }}
                                                     source={require('../../assets/images/backward.png')}
                                                 />
                                             </TouchableOpacity>
                                             <TouchableOpacity
                                                 onPress={()=>{
                                                     if(this.state.audioUrl == null&&this.state.fullList[0].audio_url==null){
                                                          Toast.show("No Audio");
                                                     }else{
                                                         this.playPauseButton();
                                                     }

                                                  }}>
                                                 {(!this.state.showLoading)
                                                     ? <Image
                                                         style={{
                                                           height:responsiveHeight(8),
                                                           width:responsiveHeight(8),
                                                           resizeMode: 'contain',
                                                           marginRight:responsiveWidth(5),
                                                           marginLeft:responsiveWidth(5)
                                                           }}
                                                         source={this.state.playbuttonsource}
                                                     />
                                                     : <View style={{
                                                         marginRight:responsiveWidth(5),
                                                         marginLeft:responsiveWidth(5)
                                                     }}>
                                                         <ActivityIndicator size="large" color="#fff"/>
                                                     </View>
                                                 }
                                             </TouchableOpacity>
                                             <TouchableOpacity
                                                 onPress={()=>{
                                                     if (this.state.audioUrl !== null) {
                                                      this.skip(10)
                                                      }
                                                 }}>
                                                 <Image
                                                     style={{
                                                       height:responsiveHeight(5),
                                                       width:responsiveHeight(5),
                                                       resizeMode: 'contain',
                                                       //marginRight:responsiveWidth(5)
                                                       }}
                                                     source={require('../../assets/images/forward.png')}
                                                 />
                                             </TouchableOpacity>
                                     </View>
                                 </View>
                                 :null
                                 }
                </View>
                }
                {(this.state.noSpace)
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
                            backgroundColor: 'rgba(0,0,0,0.1)'}}>
                        </View>
                        <View
                            style={{
                                width:responsiveWidth(85),
                                height:responsiveWidth(78),
                                //flexDirection:'column',
                                backgroundColor:'#fff',
                                borderRadius:responsiveWidth(2),
                                alignItems:'center',
                                justifyContent:'center'
                                //borderColor:'#dd0000',borderWidth:2
                            }}>
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                    this.setState({
                                        noSpace: false})
                                }}>
                                <View
                                    style={{
                                        position:'absolute',
                                        right:responsiveWidth(5),
                                        top:responsiveWidth(5),
                                        width:responsiveWidth(5),
                                        height:responsiveWidth(5),
                                        //borderColor:'#dd0000',borderWidth:2,
                                        alignItems:'center',
                                        justifyContent:'center'
                                    }}>
                                    <Image
                                        style={{
                                            width:responsiveWidth(3),
                                            height:responsiveWidth(3),
                                            resizeMode: 'contain'}}
                                        source={require('../../assets/images/exit.png')}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={{
                                //:'#DD0000',borderWidth:2,
                                // height:responsiveHeight(20),
                                //width:responsiveWidth(80),
                                alignItems:'center',
                                justifyContent:'center',
                                marginBottom:responsiveWidth(5)
                            }}>
                                <View style={{
                                    // borderColor:'#DD0000',borderWidth:2,
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'center'
                                }}>
                                    <Image
                                        style={{
                                            width:responsiveWidth(6),
                                            height:responsiveWidth(6),
                                            resizeMode: 'contain'}}
                                        source={require('../../assets/images/no_space_pop_up.png')}/>

                                    <Text style={{
                                        color:'#f58e08',
                                        fontFamily:'Roboto-Medium',
                                        fontSize:responsiveFontSize(2.9),
                                        marginLeft:responsiveWidth(2)}}>Sorry</Text>
                                </View>
                                <Text style={{
                                    color:'#252f39',
                                    fontFamily:'Roboto-Medium',
                                    fontSize:responsiveFontSize(1.5),
                                    textAlign:'center',
                                    marginTop:responsiveWidth(3),
                                    lineHeight:responsiveWidth(6),
                                    marginLeft:responsiveWidth(5),
                                    marginRight:responsiveWidth(5)
                                }}>
                                    You don’t have enough space on phone memory.Please delete some items and try again
                                </Text>
                            </View>
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                     this.setState({noSpace: false})
                                }}>
                                <View
                                    style={{
                                        position:'absolute',
                                        bottom:responsiveWidth(5),
                                        width:responsiveWidth(16),
                                        height:responsiveWidth(16),
                                        //borderColor:'#dd0000',borderWidth:2,
                                        alignItems:'center',
                                        justifyContent:'center'
                                    }}>
                                    <Image
                                        style={{
                                            width:responsiveWidth(16),
                                            height:responsiveWidth(16),
                                            resizeMode: 'contain'}}
                                        source={require('../../assets/images/no_space_pop_up_arrow.png')}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    : null
                }
                {(this.state.dialogVisible)
                    ? <Dialog
                        visible={this.state.dialogVisible}
                        //title="Custom Dialog"
                        onTouchOutside={() => {
                           // console.log(this.state.dialogVisible);
                            this.setState({dialogVisible: false})
                        }}
                        style={{ borderRadius:responsiveWidth(2),
                         //borderColor:'#dd0000',borderWidth:2
                        }}
                        contentStyle={{ justifyContent: 'center', alignItems: 'center',
                     backgroundColor: 'transparent',
                     //borderRadius:responsiveWidth(2),
                         //borderColor:'#dd0000',borderWidth:2
                        }}
                        animationType="fade">
                        <View
                            style={{
                                width:responsiveWidth(85),
                                height:responsiveWidth(72),
                                //flexDirection:'column',
                                backgroundColor:'transparent',
                                borderRadius:responsiveWidth(2),
                                alignItems:'center',
                                justifyContent:'center',
                                //borderColor:'#dd0000',borderWidth:2
                            }}>
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                    this.setState({dialogVisible: false})
                                }}>
                                <View
                                    style={{
                                        position:'absolute',
                                        right:responsiveWidth(5),
                                        top:responsiveWidth(0),
                                        width:responsiveWidth(5),
                                        height:responsiveWidth(5),
                                        //borderColor:'#dd0000',borderWidth:2,
                                        alignItems:'center',
                                        justifyContent:'center'
                                    }}>
                                    <Image
                                        style={{
                                            width:responsiveWidth(3),
                                            height:responsiveWidth(3),
                                            resizeMode: 'contain'}}
                                        source={require('../../assets/images/exit.png')}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={{
                                //:'#DD0000',borderWidth:2,
                                // height:responsiveHeight(20),
                                //width:responsiveWidth(80),
                                alignItems:'center',
                                justifyContent:'center',
                                marginBottom:responsiveWidth(5)
                            }}>
                                <View style={{
                                    // borderColor:'#DD0000',borderWidth:2,
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'center'
                                }}>
                                    <Image
                                        style={{
                                            width:responsiveWidth(6),
                                            height:responsiveWidth(6),
                                            resizeMode: 'contain'}}
                                        source={require('../../assets/images/audio_assistance_notification_icon.png')}/>

                                    <Text style={{
                                        color:'#38d682',
                                        fontFamily:'Roboto-Medium',
                                        fontSize:responsiveFontSize(2.9),
                                        marginLeft:responsiveWidth(2)}}>Assistance</Text>
                                </View>
                                <Text style={{
                                    color:'#252f39',
                                    fontFamily:'Roboto-Medium',
                                    fontSize:responsiveFontSize(1.5),
                                    textAlign:'center',
                                    marginTop:responsiveWidth(3),
                                    lineHeight:responsiveWidth(6),
                                    marginLeft:responsiveWidth(5),
                                    marginRight:responsiveWidth(5)
                                }}>
                                    You are in Nappa Valley, for which there exist
                                    audio tracks for assistance.
                                    Click the button to view them.
                                    {this.state.message}
                                </Text>
                            </View>
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                   // console.log("touch");
                                    ////console.log(this.state.message);
                                   // console.log(this.state.title);
                                    //console.log(this.state.url);
                            if(this.state.type==="audioTour"&&this.state.url!==null){
                              //  console.log("trail");
                                this.props.navigation.navigate('TrailTourScreen', this.state.notification);
                              //  console.log("to true");
                                global.notnew = true;
                                global.notname=this.state.title;
                                global.noturl=this.state.url;
                                this.setState({dialogVisible: false})
                            }
                            else if(this.state.message==="New Scavenger hunt posted")
                            {
                                this.setState({dialogVisible: false})
                                this.props.navigation.navigate('ScavengerHunt', this.state.notification);

                            }else{
                              //  Toast.show("Sorry")
                            }
                                }}>
                                <View
                                    style={{
                                        position:'absolute',
                                        bottom:responsiveWidth(5),
                                        width:responsiveWidth(16),
                                        height:responsiveWidth(16),
                                        //borderColor:'#dd0000',borderWidth:2,
                                        alignItems:'center',
                                        justifyContent:'center'
                                    }}>
                                    <Image
                                        style={{
                                            width:responsiveWidth(16),
                                            height:responsiveWidth(16),
                                            resizeMode: 'contain'}}
                                        source={require('../../assets/images/no_space_pop_up_arrow.png')}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </Dialog>
                    : null
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
        session: state.session,
        user: state.user,
        explore: state.explore,
        restaurants: state.restaurants,
        trailTour: state.trailTour
    });
function

mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrailTourScreen);