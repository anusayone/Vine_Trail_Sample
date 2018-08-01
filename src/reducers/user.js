import * as Types from "../constants/types";
const initialPostState = {
    signUpResult: {},
    signUpError: {},
    termsAndConditions:{}

};

export default function user(state = initialPostState, action) {
    switch (action.type) {
        case Types.SET_SIGNUP_RESULT:
            return {...state, signUpResult: action.signUpResult};
        case Types.CLEAR_SIGNUP_RESULT:
            return {...state, signUpResult: null};
        case Types.SET_SIGNUP_ERROR:
            return {...state, signUpError: action.signUpError};
        case Types.SET_TERMS_AND_CONDITIONS:
            return {...state, termsAndConditions: action.termsAndConditions};
        case Types.CLEAR_SIGNUP_ERROR:
            return {...state, signUpError: null};
        default:
            return state;
    }
}
