import {BASE_PATH,TRAIL_TOUR_SWITCH,TRAIL_TOUR_LIST,POST_LOCATION, POST_DEVICE_TOKEN,
    REGISTER_DEVICE_ANDROID,REGISTER_DEVICE_IOS,GET_NOTIFICATION_LIST} from "../constants/common";
import {AsyncStorage} from "react-native";
import * as Types from "../constants/types";
import {DEFAULT_LATITUDE, DEFAULT_LONGITUDE} from "../constants/location";

export function getTrailTour(category,sound_enabled) {
    return (dispatch, getState) => {
        let url = BASE_PATH + TRAIL_TOUR_SWITCH;
        let user = getState().session.user;
        let data = new FormData();
        data.append("category",category);
        data.append("sound_enabled",sound_enabled);
        return fetch(
            url,
            {
                method: 'POST',
                headers: {
                    "Authorization": "Token " + user.token,
                },
                body: data
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                if (responseJson) {
                   // console.log();
                    dispatch({type: Types.TRAIL_SWITCH, switchResult: responseJson});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export function getSwitchList() {
    return (dispatch, getState) => {
        let user = getState().session.user;
        let url = BASE_PATH + TRAIL_TOUR_LIST;
       // console.log(url);
        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + user.token
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                if (responseJson) {
                    //console.log(responseJson);//
                    dispatch({type: Types.TRAIL_SWITCH_LIST, trailTourSwitchList:responseJson.results});
                }
            })
            .catch(error => {
                // console.error(error);
            });


    }
}

export function postLocation(latitude,longitude) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        let url = BASE_PATH + POST_LOCATION + '?' +'location=' +latitude+','+longitude;
        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + user.token
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
               // console.log(responseJson);
                if (responseJson) {
                    dispatch({type: Types.POST_LOCATION_RESULT, postLocationResult:responseJson});
                }
            })
            .catch(error => {
                // console.error(error);
            });
        //

    }
}

export function postDeviceToken(deviceToken) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        let url = BASE_PATH + POST_DEVICE_TOKEN ;
        let data = new FormData();
        data.append("AToken",deviceToken);
        return fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + user.token
                },
                body: data

            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
              //  console.log(responseJson);
                // if (responseJson) {
                //     dispatch({type: Types.POST_DEVICE_TOKEN, postDeviceToken:responseJson});
                // }
            })
            .catch(error => {
                // console.error(error);
            });


    }
}

export function registerDeviceAndroid(token) {
    return (dispatch, getState) => {
       // console.log(token.token);
        let user = getState().session.user;
        let url = BASE_PATH + REGISTER_DEVICE_ANDROID ;
        //console.log(url);
        let data = new FormData();
        data.append("GCMToken",token.token);
       // console.log(data);
        return fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + user.token,
                   // 'Content-Type': 'multipart/form-data',
                    "Cache-Control": "no-cache",
                },
                body: data

            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
              //  console.log(responseJson);
                // if (responseJson) {
                //     dispatch({type: Types.POST_DEVICE_TOKEN, postDeviceToken:responseJson});
                // }
            })
            .catch(error => {
                // console.error(error);
            });
    }
}

export function registerDeviceIOS(token) {

    if(token!=null) {

        return (dispatch, getState) => {
            let user = getState().session.user;
            let url = BASE_PATH + REGISTER_DEVICE_IOS;
            let data = new FormData();
            data.append("AToken", token.token);
            return fetch(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Token ' + user.token,
                        "Cache-Control": "no-cache",
                    },
                    body: data
                })
                .then(response => {
                    return response.json();
                })
                .then(responseJson => {
                   // console.log(responseJson);
                    // if (responseJson) {
                    //     dispatch({type: Types.POST_DEVICE_TOKEN, postDeviceToken:responseJson});
                    // }
                })
                .catch(error => {
                    // console.error(error);
                });


        }

    }

}

export function getNotificationList(append=false) {
    return (dispatch, getState) => {
        let notificationList=getState().trailTour.notificationList.next;
       // console.log(notificationList);
        let url = (append && notificationList)
            ? notificationList
            : BASE_PATH + GET_NOTIFICATION_LIST;

        let user = getState().session.user;
       // console.log(url);
        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + user.token,
                },
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                //console.log(responseJson);
                if (responseJson) {
                    dispatch({type: Types.SET_NOTIFICATION_LIST, notificationList:responseJson,append: append});
                }
            })
            .catch(error => {
                // console.error(error);
            });
    }
}

export function readNotification(id) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        let url = BASE_PATH + GET_NOTIFICATION_LIST+id+"/";
       // console.log(url);
        let data = new FormData();
        data.append("read",true);
        return fetch(
            url,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Token ' + user.token,
                },
                body: data
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
               // console.log(responseJson);
                // if (responseJson) {
                //     dispatch({type: Types.SET_NOTIFICATION_LIST, notificationList:responseJson.results});
                // }
            })
            .catch(error => {
                // console.error(error);
            });


    }
}