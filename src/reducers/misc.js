const initialPostState = {
    aboutUs:{},
    help:{},
    faq:{},
    reportIssue:{},
    svg:{},
    issueCategory:{},
    reportStatus:{},
    videos:{}
};

export default function misc(state = initialPostState, action) {
    switch (action.type) {
        case 'SET_ABOUT_US':
            return {...state, aboutUs: action.aboutUs};
        case 'SET_HELP':
            return {...state, help: action.help};
        case 'SET_FAQ':
            return {...state, faq: action.faq};
        case 'REPORT_ISSUE':
            return {...state, reportIssue: action.reportIssue};
        case 'SET_SVG':
            return {...state, svg: action.svg};
        case 'SET_ISSUE_CATEGORY':
            return {...state, issueCategory: action.issueCategory};
        case 'REPORT_STATUS':
            return {...state, reportStatus: action.reportStatus};
        case 'SET_VIDEOS':
            return {...state, videos: action.videos};
        default:
            return state;
    }
}
