import {
    BASE_PATH,
    ABOUT_US,
    HELP,
    FAQ,
    LIST_LOCATION,
    USER_PROFILE,
    LIST_POI_CATEGORIES,
    HUNT_DETAILS,
    ACTIVE_HUNTS,
    GET_IMAGES,
    USER_CHECKINS,
    USER_PROFILE_UPDATE,
    REPORT_ISSUE,
    GET_SVG,
    GET_ISSUE_CATEGORIES,
    VIDEOS
} from "../constants/common";
import * as Types from "../constants/types";
export function aboutUs() {
    return (dispatch, getState) => {
        //Clear existing error message or user
        let url = BASE_PATH + ABOUT_US;
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
                // console.log(responseJson)
               // console.log(responseJson.results["0"].about_us_text);
                if (responseJson) {
                    dispatch({type: Types.SET_ABOUT_US, aboutUs: responseJson.results["0"].about_us_text});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function help() {
    return (dispatch, getState) => {
        //Clear existing error message or user

        let url = BASE_PATH + HELP;


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
                //console.log(responseJson.results["0"].help_text);
                if (responseJson) {
                    dispatch({type: Types.SET_HELP, help: responseJson.results});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function faq() {
    return (dispatch, getState) => {
        let url = BASE_PATH + FAQ;
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
                // console.log(responseJson)
                if (responseJson) {
                    dispatch({type: Types.SET_FAQ, faq: responseJson.results});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function termsAndConditions() {
    return (dispatch, getState) => {

        let url = BASE_PATH + FAQ;
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
                // console.log(responseJson)
                if (responseJson) {
                    dispatch({type: Types.SET_FAQ, faq: responseJson.results});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function listLocation(token) {
    return (dispatch, getState) => {
        let url = BASE_PATH + LIST_LOCATION;
        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + token,
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                // console.log(responseJson)
                console.log(responseJson.results);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function userProfile(token) {
    return (dispatch, getState) => {
        //Clear existing error message or user

        let url = BASE_PATH + USER_PROFILE;


        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + token,
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson)
                // console.log(responseJson.results);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function listPoiCategories(token) {
    return (dispatch, getState) => {
        //Clear existing error message or user

        let url = BASE_PATH + LIST_POI_CATEGORIES;


        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + token,
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                // console.log(responseJson)
                console.log(responseJson.results);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function listActiveHunts(token) {
    return (dispatch, getState) => {
        //Clear existing error message or user

        let url = BASE_PATH + ACTIVE_HUNTS


        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + token,
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson)
                // console.log(responseJson.results);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function listHuntDetails(token, id) {
    return (dispatch, getState) => {
        //Clear existing error message or user

        let url = BASE_PATH + HUNT_DETAILS + '/' + id


        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + token,
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson)
                // console.log(responseJson.results);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function getImages(token) {
    return (dispatch, getState) => {
        //Clear existing error message or user

        let url = BASE_PATH + GET_IMAGES


        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + token,
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson)
                // console.log(responseJson.results);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function userCheckin(token) {
    return (dispatch, getState) => {
        //Clear existing error message or user

        let url = BASE_PATH + USER_CHECKINS


        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Token " + token,
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson)
                // console.log(responseJson.results);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function updateUserProfile(token, first_name, last_name, email, gender, province, weight, image, phone1) {
    return (dispatch, getState) => {
        //Clear existing error message or user

        let url = BASE_PATH + USER_PROFILE_UPDATE

        let data = new FormData();
        data.append("first_name", first_name);
        data.append("last_name", last_name);
        data.append("email", email);
        data.append("gender", gender);
        data.append("province", province);
        data.append("weight", weight);
        data.append("image", image);
        data.append("phone1", phone1);
        return fetch(
            url,
            {
                method: 'PUT',
                headers: {
                    "Authorization": "Token " + token,
                },
                body: data
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson)
                // console.log(responseJson.results);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function reportIssue(type, message='',image,latitude=null,longitude=null) {
    return (dispatch, getState) => {
        let url = BASE_PATH + REPORT_ISSUE;
        let user = getState().session.user;
        let data = new FormData();
        data.append("contact_ids", type);
        data.append("other_complaint_text", message);
        data.append("location", latitude+','+longitude);
       // data.append("complaint_photo",array);
        if(image.length>0){
            image.map((item)=>{
                let name = item.split('/');
                console.log(item);
                data.append("complaint_photo",{
                    uri: item,
                    type: 'image/jpeg',
                    name: name[name.length-1]+'.jpeg'
                });
            });
        }
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
                dispatch({type:Types.REPORT_STATUS, reportStatus: response.status});
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson) {
                    dispatch({type: Types.REPORT_ISSUE, reportIssue: responseJson});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function getSVGImages() {
    return (dispatch, getState) => {
        let user = getState().session.user;
        let url = BASE_PATH + GET_SVG;
        return fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Token " + user.token,
                }
            })
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                // console.log(responseJson)
                if (responseJson) {
                    dispatch({type: Types.SET_SVG, svg: responseJson.results});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}
export function issueCategories() {
    return (dispatch, getState) => {
        //Clear existing error message or user
        let user = getState().session.user;
        let url = BASE_PATH + GET_ISSUE_CATEGORIES;
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
                    dispatch({type: Types.SET_ISSUE_CATEGORY, issueCategory: responseJson.results});
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export function getVideos() {
    return (dispatch, getState) => {
        let user = getState().session.user;
        if (user) {
            let url = BASE_PATH + VIDEOS;
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
                    console.log(responseJson);
                    if (responseJson) {
                        dispatch({type: Types.SET_VIDEOS, videos: responseJson});
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