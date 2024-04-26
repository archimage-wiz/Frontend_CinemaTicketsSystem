import "../../css/Admin.css";
import "../../css/PopUp.css";
import { BackendAPI } from "../../BackendAPI/BackendAPI.tsx";
import { Login } from "./Login/Login";
import { Header } from "./Header/Header";
import { useState } from "react";
import { HallSet } from "./HallSet/HallSet";
import { HallSeatsConf } from "./HallSeatsConf/HallSeatsConf";
import { HallPriceConf } from "./HallPriceConf/HallPriceConf";
import { FilmScheduler } from "./FilmScheduler/FilmScheduler";
import { HallOpenCloseConf } from "./HallOpenCloseConf/HallOpenCloseConf";

export function Admin() {
    const [backend] = useState(BackendAPI.getInstance());
    const [isAuth, setAuth] = useState(backend.isAuth);

    return (
        <>
            <div className="admin-main-bg">
                <div className="admin-main">
                    <Header />
                    {isAuth ? (
                        <>
                            <HallSet />
                            <HallSeatsConf />
                            {/* <HallPriceConf />
                            <FilmScheduler />
                            <HallOpenCloseConf /> */}
                        </>
                    ) : (
                        <Login setAuth={setAuth} />
                    )}
                </div>
            </div>
        </>
    );
}
