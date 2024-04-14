import "./css/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Main } from "./components.one/Main/Main.tsx";
import { Admin } from "./components.one/Admin/Admin.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Main />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
