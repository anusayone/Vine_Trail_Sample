import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {addNavigationHelpers, StackNavigator, NavigationActions,TabNavigator} from "react-navigation";
import {createReactNavigationReduxMiddleware, createReduxBoundAddListener} from "react-navigation-redux-helpers";
import SplashScreen from "../containers/SplashScreen";
import LoginScreen from "../containers/LoginScreen";
import SignupScreen from "../containers/SignupScreen";
import PasswordResetScreen from "../containers/PasswordResetScreen";
import JoinUsScreen from "../containers/JoinUsScreen";
import Dashboard from "../containers/Dashboard";
import Report from "../containers/Report";
import TrailTourScreen from "../containers/TrailTourScreen";
import Nearby from "../containers/Nearby";
import Map from "../containers/Map";
import MapPointerDetailScreen from "../containers/MapPointerDetailScreen";
import MapDirectionScreen from "../containers/MapDirectionScreen";
import {NavigationComponent} from "react-native-material-bottom-navigation";
import ScavengerHunt from "../containers/ScavengerHunt";
import ScavengerHuntInstructionScreen from "../containers/ScavengerHuntInstructionScreen";
import ScavengerHuntDetailScreen from "../containers/ScavengerHuntDetailScreen";
import ScavengerHuntClueScreen from "../containers/ScavengerHuntClueScreen";
import ScavengerHuntCongratulationScreen from "../containers/ScavengerHuntCongratulationScreen";
import ScavengerHuntTryAgainScreen from "../containers/ScavengerHuntTryAgainScreen";
import ScavengerHuntVerificationScreen from "../containers/ScavengerHuntVerificationScreen";
import Social from "../containers/Social";
import Restaurants from "../containers/Restaurants";
import HuntImagesScreen from "../containers/HuntImagesScreen";
import LodgeScreen from "../containers/LodgeScreen";
import RestaurantsDetail from "../containers/RestaurantsDetail";
import WineriesScreen from "../containers/WineriesScreen";
import ExploreScreen from "../containers/ExploreScreen";
import POIMapDirectionScreen from "../containers/POIMapDirectionScreen";
import SettingsScreen from "../containers/SettingsScreen";
import TutorialScreen from "../containers/TutorialScreen";
import AboutUsScreen from "../containers/AboutUsScreen";
import HelpScreen from "../containers/HelpScreen";
import TermsAndConditionsScreen from "../containers/TermsAndConditionsScreen";
import FAQScreen from "../containers/FAQScreen";
import SectionMap from "../containers/SectionMap";
import SVGImageScreen from "../containers/SVGImageScreen";
import NearByDetailScreen from "../containers/NearByDetailScreen";
import NearByDirectionScreen from "../containers/NearByDirectionScreen";
import NearByRestaurants from "../containers/NearByRestaurants";
import NearByWineries from "../containers/NearByWineries";
import NearByLodges from "../containers/NearByLodges";
import NotificationScreen from "../containers/NotificationScreen";
import VideoScreen from "../containers/VideoScreen";
import PlayVideoScreen from "../containers/PlayVideoScreen";
const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);

const addListener = createReduxBoundAddListener("root");

export const MapNavigator = StackNavigator({
    //Map: {screen: Map},
    ExploreScreen: {screen: ExploreScreen},
    MapPointerDetailScreen: {screen: MapPointerDetailScreen},
    MapDirectionScreen: {screen: MapDirectionScreen},

});
export const ScavengerNavigator = StackNavigator({
    Dashboard: {screen: Dashboard},
    ScavengerHunt: {screen: ScavengerHunt},
    ScavengerHuntInstructionScreen: {screen: ScavengerHuntInstructionScreen},
    ScavengerHuntDetailScreen:{screen:ScavengerHuntDetailScreen},
    ScavengerHuntClueScreen:{screen:ScavengerHuntClueScreen},
    ScavengerHuntCongratulationScreen:{screen:ScavengerHuntCongratulationScreen},
    ScavengerHuntTryAgainScreen:{screen:ScavengerHuntTryAgainScreen},
    ScavengerHuntVerificationScreen:{screen:ScavengerHuntVerificationScreen},
    HuntImagesScreen:{screen:HuntImagesScreen}
});
export const SectionMapNavigator = StackNavigator({
    Dashboard: {screen: Dashboard},
    SectionMap: {screen: SectionMap},
    SVGImageScreen: {screen: SVGImageScreen},
});
export const SocialNavigator = StackNavigator({
    Dashboard: {screen: Dashboard},
    Social: {screen: Social},
});
export const RestaurantNavigator = StackNavigator({
    Dashboard: {screen: Dashboard},
    Restaurants: {screen: Restaurants},
    RestaurantsDetail: {screen: RestaurantsDetail},
    POIMapDirectionScreen: {screen: POIMapDirectionScreen}
});
export const LodgeNavigator = StackNavigator({
    Dashboard: {screen: Dashboard},
    LodgeScreen: {screen: LodgeScreen},
    RestaurantsDetail: {screen: RestaurantsDetail},
    POIMapDirectionScreen: {screen: POIMapDirectionScreen}
});
export const WineryNavigator = StackNavigator({
    Dashboard: {screen: Dashboard},
    WineriesScreen: {screen: WineriesScreen},
    RestaurantsDetail: {screen: RestaurantsDetail},
    POIMapDirectionScreen: {screen: POIMapDirectionScreen}
});
export const DashboardNavigator = StackNavigator({
    Dashboard: {screen: Dashboard},
    //ScavengerNavigator: {screen: ScavengerNavigator},
    //SectionMapNavigator:{screen:SectionMapNavigator},
    //SocialNavigator: {screen: SocialNavigator},
    //RestaurantNavigator:{screen:RestaurantNavigator},
    //LodgeNavigator:{screen:LodgeNavigator},
   // WineryNavigator:{screen:WineryNavigator},
    //SettingsNavigator:{screen:SettingsNavigator},

    ScavengerHunt: {screen: ScavengerHunt},
    ScavengerHuntInstructionScreen: {screen: ScavengerHuntInstructionScreen},
    ScavengerHuntDetailScreen:{screen:ScavengerHuntDetailScreen},
    ScavengerHuntClueScreen:{screen:ScavengerHuntClueScreen},
    ScavengerHuntCongratulationScreen:{screen:ScavengerHuntCongratulationScreen},
    ScavengerHuntTryAgainScreen:{screen:ScavengerHuntTryAgainScreen},
    ScavengerHuntVerificationScreen:{screen:ScavengerHuntVerificationScreen},
    HuntImagesScreen:{screen:HuntImagesScreen},

    SectionMap: {screen: SectionMap},
    SVGImageScreen: {screen: SVGImageScreen},

    Social: {screen: Social},

    Restaurants: {screen: Restaurants},
    RestaurantsDetail: {screen: RestaurantsDetail},
    POIMapDirectionScreen: {screen: POIMapDirectionScreen},

    WineriesScreen: {screen: WineriesScreen},

    LodgeScreen: {screen: LodgeScreen},

    NotificationScreen:{screen:NotificationScreen},

    VideoScreen:{screen:VideoScreen},
    PlayVideoScreen:{screen:PlayVideoScreen,navigationOptions: {
            tabBarVisible: false
        }},
});
export const NearbyNavigator = StackNavigator({
    Nearby: {screen: Nearby},
    NearByDetailScreen: {screen: NearByDetailScreen},
    NearByRestaurants: {screen: NearByRestaurants},
    NearByWineries: {screen: NearByWineries},
    NearByLodges: {screen: NearByLodges},
    //RestaurantsDetail: {screen: RestaurantsDetail},
    //POIMapDirectionScreen: {screen: POIMapDirectionScreen}
    NearByDirectionScreen: {screen: NearByDirectionScreen},

});

let currentIndex,routeName;
let routeArray = [];
export const BottomNavigator = TabNavigator(
    {
        Dashboard: {screen: DashboardNavigator},
        Map: {screen: MapNavigator},
        Nearby: {screen: NearbyNavigator},
        Report: {screen: Report},
        TrailTourScreen: {screen: TrailTourScreen}
    },
    {
        //tabBarComponent:NavigationComponent,
        tabBarComponent:  ({ jumpToIndex, ...props }) => (
            <NavigationComponent
                {...props}
                jumpToIndex={index => {
                    if(index==0){
                        routeName='Dashboard';
                        global.value=0
                    }else if(index==1){
                         routeName='ExploreScreen';
                         global.value=1
                    }else if(index==2){
                         routeName='Nearby';
                         global.value=1
                    }else if(index==3){
                         routeName='Report';
                         global.value=1
                    }else if(index==4){
                         routeName='Hunt';
                         global.value=1
                    }
                    console.log(routeName+"....");
                    routeArray = props.navigation.state.routes[index].routes;
                        console.log(routeName);
                    if(routeName !== 'Hunt'&&routeName !== 'Report'){
                        //console.log("inside");
                    if(routeArray[routeArray.length-1].routeName !== routeName){
                                               currentIndex = index;
                                                             console.log(currentIndex);
                                                             console.log(index);
                                                 let resetTabAction = NavigationActions.navigate({
                                                   routeName: routeName,
                                                   action: NavigationActions.reset({
                                                     index: 0,
                                                     actions: [NavigationActions.navigate({ routeName: routeName })],
                                                   }),
                                                 });
                                                 props.navigation.dispatch(resetTabAction);

                                        } else {
                                         jumpToIndex(index);
                                        }
                    } else {
                       jumpToIndex(index);
                     }
        }}
            />),
        tabBarPosition: 'bottom',
        tabBarOptions: {
            bottomNavigationOptions: {
                rippleColor: '#DD0000',
                style: {
                    borderTopWidth: 0.7,
                    borderTopColor: '#e9e9e9',
                    zIndex:900,

                },
                shifting: false,
                activeLabelColor: '#454242',
                tabs: {
                    Dashboard: {
                        barBackgroundColor: '#fff',
                        labelColor: '#959595',
                    },
                    Map: {
                        barBackgroundColor: '#ffffff',
                        labelColor: '#959595',
                    },
                    Nearby: {
                        barBackgroundColor: '#ffffff',
                        labelColor: '#959595'
                    },
                    Report: {
                        barBackgroundColor: '#ffffff',
                        labelColor: '#959595'
                    },
                    Hunt: {
                        barBackgroundColor: '#ffffff',
                        labelColor: '#959595'
                    }

                }
            }
        },
        // navigationOptions: ({ navigation }) => ({
        //     tabBarOnPress: (scene, jumpToIndex) => {
        //         console.log('onPress:', scene.route);
        //             jumpToIndex(scene.index);
        //     },
        // }),

    }
);

export const AppNavigator = StackNavigator({
    SplashScreen: {screen: SplashScreen},
    LoginScreen: {screen: LoginScreen},
    SignupScreen: {screen: SignupScreen},
   // Dashboard: {screen: Dashboard},
    PasswordResetScreen: {screen: PasswordResetScreen},
    JoinUsScreen: {screen: JoinUsScreen},
    BottomNavigator: {screen: BottomNavigator},
    SettingsScreen: {screen: SettingsScreen},
    TutorialScreen:{screen:TutorialScreen},
    HelpScreen: {screen: HelpScreen},
    TermsAndConditionsScreen: {screen: TermsAndConditionsScreen},
    AboutUsScreen: {screen: AboutUsScreen},
    FAQScreen: {screen: FAQScreen},
});

const StackNavigationApp = ({dispatch, nav}) => (
    <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav, addListener})}/>
);

StackNavigationApp.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    nav: state.nav
});

export default connect(mapStateToProps)(StackNavigationApp);
