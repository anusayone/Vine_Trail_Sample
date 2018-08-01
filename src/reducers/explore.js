import * as Types from "../constants/types";
const initialPostState = {
    pointsOfInterest: {},
    categories: {},
    distance:{},
    coordinates:{},
    markerDistance:{},
    wineriesDistance:{},
    lodgesDistance:{}
    // searchResult: {},
    // filteredPointOfInterest: {}
};

export default function explore(state = initialPostState, action) {
    switch (action.type) {
        case Types.SET_POIS:
            return {...state, pointsOfInterest: action.pointsOfInterest};
        case Types.SET_CATEGORY:
            return {...state, categories: action.categories};
        case Types.CLEAR_POIS:
            return {...state, pointsOfInterest: null};
        case Types.SET_COORDINATES:
            return {...state, coordinates: action.coordinates};
        case Types.SET_MARKER_DISTANCE:
            return {...state, markerDistance: action.markerDistance};
        case Types.SET_DISTANCE:
            let newList={...state.distance,[action.distance.id]:action.distance.result};
            //console.log(newList);
            return {...state,distance:newList};

        case Types.SET_LODGES_DISTANCE:
            let newListLodges={...state.lodgesDistance,[action.lodgesDistance.id]:action.lodgesDistance.result};
            //console.log(newListLodges);
            return {...state,lodgesDistance:newListLodges};

        case Types.SET_WINERIES_DISTANCE:
            let newListWineries={...state.wineriesDistance,[action.wineriesDistance.id]:action.wineriesDistance.result};
            //console.log(newListWineries);
            return {...state,wineriesDistance:newListWineries};
           // return {...state, distance: action.distance};
        // case Types.SEARCH_RESULT:
        //     return {...state, searchResult: action.searchResult};
        // case Types.FILTERED_POI:
        //     return {...state, filteredPointOfInterest: action.filteredPointOfInterest};
        default:
            return state;
    }
}
