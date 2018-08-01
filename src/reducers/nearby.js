const initialPostState = {
    nearByRestaurant: {},
    nearByLodges:{},
    nearByWineries:{}
};

export default function nearby(state = initialPostState, action) {
    switch (action.type) {
        case 'SET_NEARBY_RESTAURANTS':
            return {...state, nearByRestaurant: action.nearByRestaurant};
        case 'SET_NEARBY_LODGES':
            return {...state, nearByLodges: action.nearByLodges};
        case 'SET_NEARBY_WINERIES':
            return {...state, nearByWineries: action.nearByWineries};
        case 'CLEAR_RESTAURANTS':
            return {...state, restaurants: null};
        default:
            return state;
    }
}
