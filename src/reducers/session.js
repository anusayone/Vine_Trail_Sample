import * as Types from "../constants/types";
const initialPostState = {
    user: {},
    loginError: {},
    logoutError: {},
    setSuccessStatus:{}
};

export default function session(state = initialPostState, action) {
    switch (action.type) {
        case Types.SET_USER:
            return {...state, user: action.user};
        case Types.CLEAR_USER:
            return {...state, user: null};
        case Types.SET_LOGIN_ERROR:
            return {...state, loginError: action.loginError};
        case Types.CLEAR_LOGIN_ERROR:
            return {...state, loginError: null};
        case Types.SET_LOGOUT_ERROR:
            return {...state, logoutError: action.logoutError};
        case Types.CLEAR_LOGOUT_ERROR:
            return {...state, logoutError: null};
        case Types.SET_SUCCESS_STATUS:
            return {...state, setSuccessStatus: action.setSuccessStatus};
        default:
            return state;
    }
}
