const initialPostState = {
    socialImages: {},
    reportAbuseCategory:{},
    reportAbuseStatus:{},
    reportAbuse:{}
};

export default function social(state = initialPostState, action) {
    switch (action.type) {
        case 'SET_SOCIAL_IMAGES':
            console.log(state.socialImages);
            //return {...state, socialImages: action.socialImages};
            if (action.socialImages) {
                let social = state.socialImages;
                social.count = action.socialImages.count;
                social.next = action.socialImages.next;
                social.previous = action.socialImages.previous;
                social.results = action.append ? social.results.concat(action.socialImages.results) : action.socialImages.results;
                return {...state, socialImages: social};
            } else {
                return {...state, socialImages: {}};
            }
        case 'SET_REPORT_ABUSE_CATEGORY':
            return {...state, reportAbuseCategory: action.reportAbuseCategory};
        case 'REPORT_ABUSE_STATUS':
            return {...state, reportAbuseStatus: action.reportAbuseStatus};
        case 'REPORT_ABUSE':
            return {...state, reportAbuse: action.reportAbuse};
        default:
            return state;
    }
}
