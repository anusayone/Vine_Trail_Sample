import {BASE_PATH,GET_SOCIAL_IMAGES,GET_REPORT_ABUSE_CATEGORY,REPORT_ABUSE} from "../constants/common";
import {AsyncStorage} from "react-native";
import * as Types from "../constants/types";

export function getSocialImages(append = false) {
    return (dispatch, getState) => {
    console.log(getState().social.socialImages.next);
        let socialImages=getState().social.socialImages.next;
        console.log(socialImages);
        let url = (append && socialImages)
            ? socialImages
            : BASE_PATH + GET_SOCIAL_IMAGES;
        //let url = BASE_PATH + GET_SOCIAL_IMAGES;
        let user = getState().session.user;
        console.log(url);
        console.log(user.token);
        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + user.token,
                }
            })
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson) {
                    dispatch({type: Types.SET_SOCIAL_IMAGES, socialImages: responseJson,append: append});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

//export function getMoreRestaurants(category,latitude,longitude,append = false) {
//    return (dispatch, getState) => {
//        let user = getState().session.user;
//        let restaurants=getState().social.socialImages.results
//        if (user) {
//            let url = (append && restaurants)
//                ? restaurants
//                : BASE_PATH + FILTER + '?category_id='+category+'&latitude='+latitude+'&longitude='+longitude;
//            // let url = BASE_PATH + FILTER + '?category_id='+category;
//            return fetch(
//                url,
//                {
//                    method: 'GET',
//                    headers: {
//                        'Authorization': 'Token ' + user.token
//                    }
//                })
//                .then(response => {
//                    return response.json();
//                })
//                .then(responseJson => {
//                    console.log(responseJson);
//                    if (responseJson) {
//                        dispatch({type: Types.SET_RESTAURANTS, restaurants: responseJson,append: append});
//                    }
//                })
//                .catch(error => {
//                    // console.error(error);
//                });
//
//        } else {
//            return null;
//        }
//    }
//}

export function reportAbuseCategories() {
    return (dispatch, getState) => {
        //Clear existing error message or user
        let user = getState().session.user;
        let url = BASE_PATH + GET_REPORT_ABUSE_CATEGORY;
        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + user.token,
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                if (responseJson) {
                    dispatch({type: Types.SET_REPORT_ABUSE_CATEGORY, reportAbuseCategory: responseJson.results});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export function reportAbuse(selectedImage, selectedProblem) {
    return (dispatch, getState) => {
        let url = BASE_PATH + REPORT_ABUSE;
        let user = getState().session.user;
        let data = new FormData();
        data.append("imageId", selectedImage);
        data.append("report_category", selectedProblem);
        return fetch(
            url,
            {
                method: 'POST',
                headers: {
                    //'Content-Type': 'multipart/form-data',
                    "Authorization": "Token " + user.token,
                },
                body: data
            })
            .then(response => {
                // console.log(response);
                dispatch({type:Types.REPORT_ABUSE_STATUS, reportAbuseStatus: response.status});
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson) {
                    dispatch({type: Types.REPORT_ABUSE, reportAbuse: responseJson});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}