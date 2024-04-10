import { Header } from "../Header/Header";
import { CinemaDateNavigator } from "./CinemaDateNavigator/CinemaDateNavigator";

export function Start() {
    return (
        <>
            <Header />
            <CinemaDateNavigator /> 
            <div>cinema list element</div>
        </>
    );
}
