const initialPostState = {
    switchResult: {},
    trailTourSwitchList: {},
    postLocationResult: {},
    postDeviceToken: {},
    notificationList:{}
};

export default function trailtour(state = initialPostState, action) {
    switch (action.type) {
        case 'TRAIL_SWITCH':
            return {...state, switchResult: action.switchResult};
        case 'TRAIL_SWITCH_LIST':
            return {...state, trailTourSwitchList: action.trailTourSwitchList};
        case 'POST_LOCATION_RESULT':
            return {...state, postLocationResult: action.postLocationResult};
        case 'POST_DEVICE_TOKEN':
            return {...state, postDeviceToken: action.postDeviceToken};
        // case 'SET_NOTIFICATION_LIST':
        //     return {...state, notificationList: action.notificationList};

        case 'SET_NOTIFICATION_LIST':
            console.log(state.notificationList);
            //return {...state, socialImages: action.socialImages};
            if (action.notificationList) {
                let notification = state.notificationList;
                notification.count = action.notificationList.count;
                notification.next = action.notificationList.next;
                notification.previous = action.notificationList.previous;
                notification.results = action.append ? notification.results.concat(action.notificationList.results) : action.notificationList.results;
                return {...state, notificationList: notification};
            } else {
                return {...state, notificationList: {}};
            }
        default:
            return state;
    }
}