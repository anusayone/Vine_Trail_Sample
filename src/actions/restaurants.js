import {BASE_PATH, FILTER,SEARCH,CATEGORY_SEARCH} from "../constants/common";
import {AsyncStorage} from "react-native";
import * as Types from "../constants/types";
export function clearRestaurants(restaurants) {
    return (dispatch, getState) => {
        dispatch({type: Types.CLEAR_RESTAURANTS, restaurants: restaurants});
    }
}
export function getPOIDetails(latitude,longitude) {
    return (dispatch, getState) => {
        dispatch({type: Types.CLEAR_POIS});
        let user = getState().session.user;
        if (user) {
            let params = [
                'latitude=' +latitude ,
                'longitude='+longitude,
            ].join('&');
            let url = BASE_PATH + SEARCH + '?' + params;
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
                        dispatch({type: Types.SET_POI, poi: responseJson.results});
                    }
                })
                .catch(error => {
                    console.error(error);
                });

        } else {
            return null;
        }
    }
}
export function getRestaurants(category) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        if (user) {
            let url = BASE_PATH + FILTER + '?category_id='+category;
                console.log(url);
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
                        dispatch({type: Types.SET_RESTAURANTS, restaurants: responseJson});
                    }
                })
                .catch(error => {
                    // console.error(error);
                });

        } else {
            return null;
        }
    }
}
export function getMoreRestaurants(category,latitude,longitude,append = false) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        let restaurants=getState().restaurants.restaurants.next;
        if (user) {
            let url = (append && restaurants)
                ? restaurants
                : BASE_PATH + FILTER + '?category_id='+category+'&latitude='+latitude+'&longitude='+longitude;
           // let url = BASE_PATH + FILTER + '?category_id='+category;
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
                    console.log(responseJson);
                    if (responseJson) {
                        dispatch({type: Types.SET_RESTAURANTS, restaurants: responseJson,append: append});
                    }
                })
                .catch(error => {
                    // console.error(error);
                });

        } else {
            return null;
        }
    }
}
export function getCategorySearchResults(category,term) {
    return (dispatch, getState) => {
        dispatch({type: Types.CLEAR_POIS});
        let user = getState().session.user;
        if (user) {
            let url = BASE_PATH + CATEGORY_SEARCH + '?category_id='+category+'&term='+term;
            console.log(url)
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
                    console.log(responseJson)
                    if (responseJson) {
                        dispatch({type: Types.SET_CATEGORY_SEARCH_RESULT, categorySearchResult: responseJson.results});
                    }
                })
                .catch(error => {
                    console.error(error);
                });

        } else {
            return null;
        }
    }
}
