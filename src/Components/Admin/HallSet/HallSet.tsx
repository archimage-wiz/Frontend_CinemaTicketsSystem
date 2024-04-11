import "../HallContainer.css";
import "./HallSet.css";
import { useEffect, useState } from "react";
import { HallAddPopup } from "./HallAddPopup/HallAddPopup";
import { BackendAPI } from "../../../BackendAPI";

export function HallSet() {
    const [backend] = useState(BackendAPI.getInstance());
    const [showAdd, setShowAdd] = useState(false);
    const [halls, setHalls] = useState(backend.getHalls());

    useEffect(() => {
        backend.setUpdateF("halls", updateHalls);
    }, []);
    function updateHalls() {
        setHalls(backend.getHalls());
    }

    function showAddHall() {
        setShowAdd(true);
    }
    function hideAddHall() {
        setShowAdd(false);
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
                    {halls?.map((hall: { hall_name: string }) => (
                        <div className="admin-hallset_list_item" key={crypto.randomUUID()}>
                            <div>-</div>
                            <div>{hall.hall_name}</div>
                            <div className="admin-hall_delete_button"></div>
                        </div>
                    ))}
                    <button onClick={showAddHall}>СОЗДАТЬ ЗАЛ</button>
                </section>
            </div>
            {showAdd ? <HallAddPopup closeFunc={hideAddHall} /> : null}
        </>
    );
}
