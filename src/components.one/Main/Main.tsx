import "./Main.css";
import { Route, Routes } from "react-router-dom";
import { Start } from "./Start/Start";
import { HallSeatsChooser } from "./HallSeatsChooser/HallSeatsChooser";
import { PaymentProc } from "./PaymentProc/PaymentProc";
import { PaymentProcResult } from "./PaymentProcResult/PaymentProcResult";


export function Main() {

    // const { pathname } = useLocation();

    return (
        <>
            <div className="main-body_bg">
                <div className="main-content_container">
                    <Routes>
                        <Route path="/hall/:seanceId/:currentDate" element={<HallSeatsChooser />} />
                        <Route path="/payment/:seanceId/:hallId/:filmId/:currentDate" element={<PaymentProc />} />
                        <Route path="/tickets/:seanceId/:hallId/:filmId/:currentDate" element={<PaymentProcResult />} />
                        <Route path="/" element={<Start />} />
                        <Route path="*" element={<div>404 Hot found</div>} />
                    </Routes>
                </div>
            </div>
        </>
    );
}
