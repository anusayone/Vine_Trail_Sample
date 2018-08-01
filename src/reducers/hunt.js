const initialPostState = {
    hunts: {},
    huntDetails:{},
    startTask:{},
    huntImages:{}
};

export default function hunt(state = initialPostState, action) {
    switch (action.type) {
        case 'SET_HUNTS':
            return {...state, hunts: action.hunts};
        case 'SET_HUNT_DETAILS':
            return {...state, huntDetails: action.huntDetails};
        case 'START_TASK':
            return {...state, startTask: action.startTask};
        case 'COMPLETE_TASK':
            return {...state, completeTask: action.completeTask};
        case 'SET_HUNT_IMAGES':
            return {...state, huntImages: action.huntImages};
        default:
            return state;
    }
}
