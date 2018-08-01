import {combineReducers} from "redux";
import nav from "./navigation";
// import bottomnavigation from './bottomnavigation'
import session from "./session";
import explore from "./explore";
import user from "./user";
import misc from "./misc";
import hunt from "./hunt";
import social from "./social";
import restaurants from "./restaurants"
import nearby from "./nearby"
import trailTour from "./trailTour"

const AppReducer = combineReducers({nav, session, explore, user, misc,hunt,social,restaurants,nearby,trailTour});

export default AppReducer;
