import { Route, Routes, useLocation } from "react-router-dom";
import { Start } from "./Start/Start";
import "./Main.css";

export function Main() {
    const { pathname } = useLocation();
    console.log(pathname);

    return (
        <>
            <div className="main-body_bg">
                <div className="main-content_container">
                    <Routes>
                        <Route path="/hall" element={<div>hall</div>} />
                        <Route path="/" element={<Start />} />
                        <Route path="*" element={<div>404 Hot found</div>} />
                    </Routes>
                </div>
            </div>
        </>
    );
}
