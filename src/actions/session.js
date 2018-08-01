import {BASE_PATH, FACEBOOK_LOGIN, FORGOT_PASSWORD, GOOGLE_LOGIN, LOGIN, LOGOUT} from "../constants/common";
import {AsyncStorage, Platform} from "react-native";
import * as Types from "../constants/types";

export function login(username, password) {
    return (dispatch, getState) => {
        //Clear existing error message or user
        dispatch({type: Types.CLEAR_LOGIN_ERROR});
        dispatch({type: Types.CLEAR_USER});

        let url = BASE_PATH + LOGIN;

        let data = new FormData();
        data.append("username", username);
        data.append("password", password);
        data.append("device_type", Platform.OS);

        // console.log(data);

        return fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: data
            })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.error) {
                    dispatch({type: Types.SET_LOGIN_ERROR, loginError: responseJson.error});
                } else {
                    AsyncStorage.setItem('user', JSON.stringify(responseJson));
                    console.log(responseJson);
                    dispatch({type: Types.SET_USER, user: responseJson});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export function googleLogin(access_token) {
    return (dispatch, getState) => {
        //Clear existing error message or token
        dispatch({type: Types.CLEAR_LOGIN_ERROR});
        dispatch({type: Types.CLEAR_USER});

        let url = BASE_PATH + GOOGLE_LOGIN;

        let data = new FormData();
        data.append("access_token", access_token);
        data.append("device_type", Platform.OS);

        return fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: data
            })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.error) {
                    dispatch({type: Types.SET_LOGIN_ERROR, loginError: responseJson.error});
                } else {
                    AsyncStorage.setItem('user', JSON.stringify(responseJson));
                    dispatch({type: Types.SET_USER, user: responseJson});
                    console.log(responseJson);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export function facebookLogin(access_token) {
    return (dispatch, getState) => {
        //Clear existing error message or token
        dispatch({type: Types.CLEAR_LOGIN_ERROR});
        dispatch({type: Types.CLEAR_USER});

        let url = BASE_PATH + FACEBOOK_LOGIN;

        let data = new FormData();
        data.append("access_token", access_token);
        data.append("device_type", Platform.OS);

        return fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: data
            })
            .then(response => {
                console.log(response)
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.error) {
                    dispatch({type: Types.SET_LOGIN_ERROR, loginError: responseJson.error});
                } else {
                    AsyncStorage.setItem('user', JSON.stringify(responseJson));
                    dispatch({type: Types.SET_USER, user: responseJson});
                    console.log(responseJson);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export function restoreUser(user) {
    return (dispatch, getState) => {
        dispatch({type: Types.SET_USER, user: user});
    }
}

export function resetPassword(email) {
    console.log(email);
    return (dispatch, getState) => {
        let url = BASE_PATH + FORGOT_PASSWORD;
        let data = new FormData();
        data.append("email", email);
        return fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: data
            })
            .then(response => {
                console.log(response)
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                dispatch({type: Types.SET_SUCCESS_STATUS, setSuccessStatus: responseJson});
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export function logout() {
    return (dispatch, getState) => {
        let url = BASE_PATH + LOGOUT;

        // AsyncStorage.getItem('user').then((user) => {
        //     userData = JSON.parse(user);
        //
        //     return fetch(
        //         url,
        //         {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'multipart/form-data',
        //             },
        //             body: data
        //         })
        //         .then(response => {
        //             return response.json();
        //         })
        //         .then(responseJson => {
        //             console.log(responseJson);
        //             if (responseJson.error) {
        //                 dispatch({type: 'SET_LOGOUT_ERROR', loginError: responseJson.error});
        //             } else {
        //                 AsyncStorage.removeItem('user').then(() => {
        //                     dispatch({type: 'CLEAR_USER'});
        //                 });
        //             }
        //         })
        //         .catch(error => {
        //             console.error(error);
        //         });
        // });

        AsyncStorage.removeItem('user', () => {
            dispatch({type: Types.CLEAR_USER});
        });
    }
}

