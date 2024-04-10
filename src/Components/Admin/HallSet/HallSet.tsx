import { useState } from "react";
import "../HallContainer.css";
import { HallAddPopup } from "./HallAddPopup/HallAddPopup";

export function HallSet() {
    const [showAdd, setShowAdd] = useState(false);

    function addHall() {
        setShowAdd(true);
    }

    return (
        <>
            <div className="admin-hall_container">
                <header className="admin-hall_title">
                    <div>УПРАВЛЕНИЕ ЗАЛАМИ</div>
                    <div className="admin-hall_title_close"></div>
                </header>
                <section className="admin-hall_container_body">
                    
                    <div>Доступные залы:</div>

                    <div>ЗАЛ 1 <div className="admin-hall_delete_button"></div></div>
                    <div>ЗАЛ 2</div>

                    <button onClick={addHall}>СОЗДАТЬ ЗАЛ</button>
                </section>
            </div>
            {showAdd ? <HallAddPopup /> : null}
        </>
    );
}
