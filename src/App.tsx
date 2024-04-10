import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Main } from "./Components/Main/Main.tsx";
import { Admin } from "./Components/Admin/Admin.tsx";

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
