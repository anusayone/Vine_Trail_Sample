import * as Session from "./session";
import * as Explore from "./explore";
import * as User from "./user";
import * as Misc from "./misc";
import * as Hunt from "./hunt";
import * as Social from "./social";
import * as Restaurants from "./restaurants";
import * as NearBy from "./nearby";
import * as TrailTour from "./trailTour";

export const ActionCreators = Object.assign({},
    Session,
    Explore,
    User,
    Misc,
    Hunt,
    Social,
    Restaurants,
    NearBy,
    TrailTour
);
