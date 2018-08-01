const initialPostState = {
    poi: {},
    restaurants: {},
    categorySearchResult:{}
};

export default function restaurants(state = initialPostState, action) {
    switch (action.type) {
        case 'SET_RESTAURANTS':
            if (action.restaurants) {
                let restaurant = state.restaurants;
                restaurant.count = action.restaurants.count;
                restaurant.next = action.restaurants.next;
                restaurant.previous = action.restaurants.previous;
                restaurant.results = action.append ? restaurant.results.concat(action.restaurants.results) : action.restaurants.results;
                return {...state, restaurants: restaurant};
            } else {
                return {...state, restaurants: {}};
            }
        case 'SET_POI':
            return {...state, poi: action.poi};
        case 'SET_CATEGORY_SEARCH_RESULT':
            return {...state, categorySearchResult: action.categorySearchResult};
        case 'CLEAR_RESTAURANTS':
            return {...state, restaurants: null};
        default:
            return state;
    }
}
