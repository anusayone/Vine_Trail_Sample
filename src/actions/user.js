import {BASE_PATH, SIGN_UP, TERMS_AND_CONDITIONS} from "../constants/common";
import * as Types from "../constants/types";

export function signUp(firstName, lastName, username, email, password) {
    return (dispatch, getState) => {
        //Clear existing error message or user
        dispatch({type: Types.CLEAR_SIGNUP_RESULT});
        dispatch({type: Types.CLEAR_SIGNUP_ERROR});

        let url = BASE_PATH + SIGN_UP;

        let data = new FormData();
        data.append("first_name", firstName);
        data.append("last_name", lastName);
        data.append("username", username);
        data.append("email", email);
        data.append("password", password);

        let status = null;

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
                status = response.status;
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson) {
                    if (status >= 200 && status <= 300) {
                        dispatch({type: Types.SET_SIGNUP_RESULT, signUpResult: responseJson});
                    } else {
                        dispatch({type: Types.SET_SIGNUP_ERROR, signUpError: responseJson});
                    }
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export function getTermsAndConditions() {
    return (dispatch, getState) => {

        let url = BASE_PATH + TERMS_AND_CONDITIONS;

        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                if (responseJson) {
                    dispatch({type: Types.SET_TERMS_AND_CONDITIONS, termsAndConditions: responseJson.results});
                }
                //console.log(responseJson.results["0"].terms_text);
            })
            .catch(error => {
                console.error(error);
            });
    }
}