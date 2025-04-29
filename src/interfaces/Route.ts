import { Airport } from "./Airport";

export interface Route {
    from: Airport;
    to: Airport;
    passengers: number;
}