import {BASE_PATH, GET_HUNTS, GET_HUNT_DETAILS, START_TASK, COMPLETE_TASK, GET_HUNT_IMAGES} from "../constants/common";
import {AsyncStorage} from "react-native";
import * as Types from "../constants/types";

export function getHunts() {
    return (dispatch, getState) => {
        let url = BASE_PATH + GET_HUNTS;
        let user = getState().session.user;
        console.log(url);
        console.log("Token " + user.token);
        
        return fetch(
            url,
            {
                 method: 'GET',
                 headers: {
                 'Authorization': 'Token ' + user.token
                 }
            })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.results) {
                    dispatch({type: Types.SET_HUNTS, hunts: responseJson.results});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function getHuntDetails(itemId) {
    return (dispatch, getState) => {
        let url = BASE_PATH + GET_HUNT_DETAILS +itemId+"/";
        let user = getState().session.user;
        console.log(url)
        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + user.token,
                }
            })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson) {
                    dispatch({type: Types.SET_HUNT_DETAILS, huntDetails: responseJson});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export function getHuntImages(huntId) {
    return (dispatch, getState) => {
        let params ='hunt=' + huntId
        console.log(params);
        let url = BASE_PATH + GET_HUNT_IMAGES + '?' + params;
        console.log(url);
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
                //console.log(response);
                return response.json();
            })
            .then(responseJson => {
                //console.log(responseJson);
                if (responseJson) {
                    dispatch({type: Types.SET_HUNT_IMAGES, huntImages: responseJson});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}


export function startTask(taskid) {

    return (dispatch, getState) => {

        let url = BASE_PATH + START_TASK;
        let user = getState().session.user;
        let huntid = getState().hunt.huntDetails.id;
        let data = new FormData();
        data.append("taskid", taskid);
        data.append("huntid", huntid);
        return fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Token " + user.token,
                },
                body: data
            })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson) {
                    dispatch({type: Types.START_TASK, startTask: responseJson});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function completeTask(taskId,comment, image, latitude, longitude) {
    return (dispatch, getState) => {
        console.log(longitude);
        console.log(latitude);
        let url = BASE_PATH + COMPLETE_TASK;
        let user = getState().session.user;
        let huntId = getState().hunt.huntDetails.id;
        let data = new FormData();
        data.append("taskid", taskId);
        data.append("comment", comment);
        data.append('image', {
            uri: image,
            type: 'image/jpeg',
            name: 'verifyImage.jpeg'
        });
        data.append("huntid", huntId);
        // data.append("latitude", 38.6116286);
        // data.append("longitude", -122.5924858);
        data.append("latitude", latitude);
        data.append("longitude", longitude);
        return fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Token " + user.token,
                },
                body: data
            })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson) {
                    dispatch({type: Types.COMPLETE_TASK, completeTask: responseJson});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}
