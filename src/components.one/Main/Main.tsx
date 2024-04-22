import "./Main.css";
import { Route, Routes } from "react-router-dom";
import { Start } from "./Start/Start";
import { HallSeatsChooser } from "./HallSeatsChooser/HallSeatsChooser";


export function Main() {

    // const { pathname } = useLocation();

    return (
        <>
            <div className="main-body_bg">
                <div className="main-content_container">
                    <Routes>
                        <Route path="/hall/:seanceId" element={<HallSeatsChooser />} />
                        <Route path="/" element={<Start />} />
                        <Route path="*" element={<div>404 Hot found</div>} />
                    </Routes>
                </div>
            </div>
        </>
    );
}
