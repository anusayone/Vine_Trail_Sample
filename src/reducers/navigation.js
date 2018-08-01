import {NavigationActions} from "react-navigation";
import {AppNavigator} from "../navigators/AppNavigator";
import * as Types from "../constants/types";

const firstAction = AppNavigator.router.getActionForPathAndParams('SplashScreen');
const initialNavState = AppNavigator.router.getStateForAction(firstAction);

let previousNavigationAction = '';
export default function nav(state = initialNavState, action) {
//console.log(state);
//console.log(action);
if (action.routeName) {
        if (previousNavigationAction === action.routeName)
            return state;
        previousNavigationAction = action.routeName;
    }
    if (action.type === 'Navigation/BACK') {
        previousNavigationAction = '';
    }

    let nextState;
    switch (action.routeName) {
        case Types.SPLASH_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'SplashScreen',
                params: action.params
            }));
            break;
        case Types.LOGIN_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'LoginScreen',
                params: action.params
            }));
            break;
        case Types.SIGNUP_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'SignupScreen',
                params: action.params
            }), state);
            break;
        case Types.PASSWORD_RESET_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'PasswordResetScreen',
                params: action.params
            }), state);
            break;
        case Types.JOIN_US_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'JoinUsScreen',
                params: action.params
            }), state);
            break;
        case Types.BOTTOM_NAVIGATOR:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'BottomNavigator',
                params: action.params
            }));
            break;
        case Types.DASHBOARD:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'Dashboard',
                params: action.params
            }), state);
            break;
        case Types.MAP:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'Map',
                params: action.params
            }), state);
            break;
        case Types.NEARBY:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'Nearby',
                params: action.params
            }), state);
            break;
        case Types.REPORT:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'Report',
                params: action.params
            }), state);
            break;
        case Types.TRIAL_TOUR:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'TrailTourScreen',
                params: action.params
            }), state);
            break;
        case Types.MAP_DETAIL_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'MapDetailScreen',
                params: action.params
            }), state);
            break;
        case Types.MAP_POINTER_DETAIL_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'MapPointerDetailScreen',
                params: action.params
            }), state);
            break;
        case Types.MAP_DIRECTION_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'MapDirectionScreen',
                params: action.params
            }), state);
            break;
        case Types.SCAVENGER_HUNT:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'ScavengerHunt',
                params: action.params
            }), state);
            break;
        case Types.SCAVENGER_HUNT_INSTRUCTION_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'ScavengerHuntInstructionScreen',
                params: action.params
            }), state);
            break;
        case Types.SCAVENGER_HUNT_DETAILS_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'ScavengerHuntDetailScreen',
                params: action.params
            }), state);
        break;
        case Types.SCAVENGER_HUNT_CLUE_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'ScavengerHuntClueScreen',
                params: action.params
            }), state);
            break;
        case Types.SCAVENGER_HUNT_CONGRATULATION_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'ScavengerHuntCongratulationScreen',
                params: action.params
            }), state);
            break;
        case Types.SCAVENGER_HUNT_TRY_AGAIN_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'ScavengerHuntTryAgainScreen',
                params: action.params
            }), state);
            break;
        case Types.SCAVENGER_HUNT_VERIFICATION_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'ScavengerHuntVerificationScreen',
                params: action.params
            }), state);
            break;
        case Types.SOCIAL:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'Social',
                params: action.params
            }), state);
            break;
        case Types.HUNT_IMAGES_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'HuntImagesScreen',
                params: action.params
            }), state);
            break;
        case Types.RESTAURANTS:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'Restaurants',
                params: action.params
            }), state);
            break;
        case Types.RESTAURANTS_DETAIL:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'RestaurantsDetail',
                params: action.params
            }), state);
            break;
        case Types.LODGE_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'LodgeScreen',
                params: action.params
            }), state);
            break;
        case Types.WINERIES_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'WineriesScreen',
                params: action.params
            }), state);
            break;
        case Types.EXPLORE_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'ExploreScreen',
                params: action.params
            }), state);
            break;
        case Types.POI_MAP_DIRECTION_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'POIMapDirectionScreen',
                params: action.params
            }), state);
            break;
        case Types.SETTINGS_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'SettingsScreen',
                params: action.params
            }), state);
            break;
        case Types.TUTORIAL_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'TutorialScreen',
                params: action.params
            }), state);
            break;
        case Types.FAQ_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'FAQScreen',
                params: action.params
            }), state);
            break;
        case Types.ABOUT_US_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'AboutUsScreen',
                params: action.params
            }), state);
            break;
        case Types.TERMS_AND_CONDITION_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'TermsAndConditionsScreen',
                params: action.params
            }), state);
            break;
        case Types.HELP_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'HelpScreen',
                params: action.params
            }), state);
            break;
        case Types.SECTION_MAP:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'SectionMap',
                params: action.params
            }), state);
            break;
        case Types.SVG_IMAGE_SCREEN:
            nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'SVGImageScreen',
                params: action.params
            }), state);
            break;
        case Types.NEARBY_DETAIL_SCREEN:
                nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'NearByDetailScreen',
                params: action.params
                }), state);
                break;
        case Types.NEARBY_DIRECTION_SCREEN:
                    nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                    routeName: 'NearByDirectionScreen',
                    params: action.params
                    }), state);
                    break;
        case Types.NEARBY_RESTAURANTS:
                    nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                    routeName: 'NearByRestaurants',
                    params: action.params
                    }), state);
                    break;
        case Types.NEARBY_WINERIES:
                nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'NearByWineries',
                params: action.params
                }), state);
                break;
        case Types.NEARBY_LODGES:
                nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'NearByLodges',
                params: action.params
                }), state);
                break;
        case Types.NOTIFICATION_SCREEN:
                nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'NotificationScreen',
                params: action.params
                }), state);
                break;
        case Types.VIDEO_SCREEN:
                nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                routeName: 'VideoScreen',
                params: action.params
                }), state);
                break;
        case Types.PLAY_VIDEO_SCREEN:
                nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
                    routeName: 'PlayVideoScreen',
                    params: action.params
                }), state);
            break;
        default:
            nextState = AppNavigator.router.getStateForAction(action, state);
    }
    return nextState || state;
};
