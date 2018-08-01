import {BASE_PATH, GET_NEARBY_RESTAURANTS,GET_NEARBY_LODGES,GET_NEARBY_WINERIES} from "../constants/common";
import {AsyncStorage} from "react-native";
import * as Types from "../constants/types";

export function getNearByRestaurants(latitude,longitude) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        if (user) {
            let url = BASE_PATH + GET_NEARBY_RESTAURANTS+'&latitude='+latitude+'&longitude='+longitude
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
                        dispatch({type: Types.SET_NEARBY_RESTAURANTS, nearByRestaurant: responseJson});
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

export function getNearByLodges(latitude,longitude) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        if (user) {
            let url = BASE_PATH + GET_NEARBY_LODGES+'&latitude='+latitude+'&longitude='+longitude
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
                        dispatch({type: Types.SET_NEARBY_LODGES, nearByLodges: responseJson});
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

export function getNearByWineries(latitude,longitude) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        if (user) {
            let url = BASE_PATH + GET_NEARBY_WINERIES+'&latitude='+latitude+'&longitude='+longitude
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
                        dispatch({type: Types.SET_NEARBY_WINERIES, nearByWineries: responseJson});
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