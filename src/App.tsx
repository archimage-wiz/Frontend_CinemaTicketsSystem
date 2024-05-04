import "./css/global.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Main } from "./components.one/Main/Main.tsx";
import { Admin } from "./components.one/Admin/Admin.tsx";

function App() {
    return (
        <>
            <HashRouter>
                <Routes>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Main />} />
                </Routes>
            </HashRouter>
        </>
    );
}

export default App;
