import {BASE_PATH, GET_POI_CATEGORIES, LIST_POI, FILTER, SEARCH, GET_DISTANCE, MAP_API_KEY,GET_COORDINATES} from "../constants/common";
import {AsyncStorage} from "react-native";
import * as Types from "../constants/types";
import {DEFAULT_LATITUDE, DEFAULT_LONGITUDE} from "../constants/location";

export function getPointsOfInterest(categories = [], latitude = DEFAULT_LATITUDE, longitude = DEFAULT_LONGITUDE, search = '') {
    return (dispatch, getState) => {
        dispatch({type: Types.CLEAR_POIS});

        let user = getState().session.user;
        let category = categories.length > 0 ? categories.join(',') : '';

        if (user) {
            let params = [
                'category=' + category,
                'location=',
                'search=' + search
            ].join('&');
            console.log(params);
            let url = BASE_PATH + LIST_POI + '?' + params;

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
                        dispatch({type: Types.SET_POIS, pointsOfInterest: responseJson});
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

export function getPoiCategories() {
    return (dispatch, getState) => {

        let url = BASE_PATH + GET_POI_CATEGORIES;
        let user = getState().session.user;

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
                    dispatch({type: Types.SET_CATEGORY, categories: responseJson});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export function getFilteredPoi(categories,nopaginate=nopaginate) {
    return (dispatch, getState) => {
        dispatch({type: Types.CLEAR_POIS});

        let user = getState().session.user;
        //let category = categories.length > 0 ? categories.join(',') : '';
            let url;
        if (user) {
            // let params = [
            //     'category_id=' + category
            // ].join('&');
            if(categories===undefined){
                url = BASE_PATH + FILTER + '?' + 'category_id=&nopaginate=+nopaginate';
            }else
                url = BASE_PATH + FILTER + '?' + 'category_id=' + categories+'&nopaginate=+nopaginate';
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
                    console.log(responseJson)
                    if (responseJson) {
                        dispatch({type: Types.SET_POIS, pointsOfInterest: responseJson});
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

export function getSearchResults(term) {
    return (dispatch, getState) => {
        dispatch({type: Types.CLEAR_POIS});

        let user = getState().session.user;

        if (user) {
            let params = [
                'place=' + term
            ].join('&');
            console.log(params);
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
                    console.log(responseJson)
                    if (responseJson) {
                        dispatch({type: Types.SET_POIS, pointsOfInterest: responseJson});
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

export function getRestaurantsDistance(coordinates,clatitude,clongitude,item) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        if (user) {
            let params = [
                'units=' + 'imperial',
                'origins=' + parseFloat(coordinates[0]) + ',' + parseFloat(coordinates[1]),
                'destinations=' + clatitude+ ',' + clongitude,
                'key=' + MAP_API_KEY
            ].join('&');
            let url = GET_DISTANCE + '?' + params;

            return fetch(
                url,
                {
                    method: 'GET'
                })
                .then(response => {
                    return response.json();
                })
                .then(responseJson => {
                    if (responseJson) {
                        dispatch({type: Types.SET_DISTANCE, distance:{id:item.id,
                            result:responseJson.rows}});
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

export function getLodgesDistance(coordinates,clatitude,clongitude,item) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        if (user) {
            let params = [
                'units=' + 'imperial',
                'origins=' + parseFloat(coordinates[0]) + ',' + parseFloat(coordinates[1]),
                'destinations=' + clatitude+ ',' + clongitude,
                'key=' + MAP_API_KEY
            ].join('&');
            let url = GET_DISTANCE + '?' + params;

            return fetch(
                url,
                {
                    method: 'GET'
                })
                .then(response => {
                    return response.json();
                })
                .then(responseJson => {
                    if (responseJson) {
                        dispatch({type: Types.SET_LODGES_DISTANCE, lodgesDistance:{id:item.id,
                            result:responseJson.rows}});
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
export function getWineriesDistance(coordinates,clatitude,clongitude,item) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        if (user) {
            let params = [
                'units=' + 'imperial',
                'origins=' + parseFloat(coordinates[0]) + ',' + parseFloat(coordinates[1]),
                'destinations=' + clatitude+ ',' + clongitude,
                'key=' + MAP_API_KEY
            ].join('&');
            let url = GET_DISTANCE + '?' + params;

            return fetch(
                url,
                {
                    method: 'GET'
                })
                .then(response => {
                    return response.json();
                })
                .then(responseJson => {
                    if (responseJson) {
                        dispatch({type: Types.SET_WINERIES_DISTANCE, wineriesDistance:{id:item.id,
                            result:responseJson.rows}});
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





export function getCoordinates() {
    return (dispatch, getState) => {
        dispatch({type: Types.CLEAR_POIS});

        let user = getState().session.user;

        if (user) {
            let url = BASE_PATH + GET_COORDINATES;

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
                        dispatch({type: Types.SET_COORDINATES, coordinates: responseJson["0"].subsection});
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

export function getPOI(latitude,longitude) {
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
                        dispatch({type: Types.SET_POIS, pointsOfInterest: responseJson.results});
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

export function getMarkerDistance(coordinates,clatitude,clongitude,) {
    return (dispatch, getState) => {
        let user = getState().session.user;
        if (user) {
            let params = [
                'units=' + 'imperial',
                'origins=' + parseFloat(coordinates[0]) + ',' + parseFloat(coordinates[1]),
                'destinations=' + clatitude+ ',' + clongitude,
                'key=' + MAP_API_KEY
            ].join('&');
            let url = GET_DISTANCE + '?' + params;

            return fetch(
                url,
                {
                    method: 'GET'
                })
                .then(response => {
                    return response.json();
                })
                .then(responseJson => {
                    if (responseJson) {
                        dispatch({type:Types.SET_MARKER_DISTANCE,markerDistance:responseJson.rows});
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
