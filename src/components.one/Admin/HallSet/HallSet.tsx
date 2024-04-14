import "../../../css/AdminHallConf.css";
import "./HallSet.css";
import { BackendAPI } from "../../../BackendAPI/BackendAPI.tsx";
import { useEffect, useState } from "react";
import { HallAddPopup } from "./HallAddPopup/HallAddPopup";

export function HallSet() {
    const [backend] = useState(BackendAPI.getInstance());
    const [showAdd, setShowAdd] = useState(false);
    const [halls, setHalls] = useState(backend.getHalls());
    const [visible, setVisible] = useState(true);

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

    function deleteHall(hall: number) {
        backend.deleteHall(hall);
    }

    function toggleVisibility() {
        setVisible(!visible);
    }

    return (
        <>
            <div className="admin-hall_container">
                <header className="admin-hall_title admin-hall_title_linedecorator">
                    <div>УПРАВЛЕНИЕ ЗАЛАМИ</div>
                    <div className="admin-hall_title_close" onClick={toggleVisibility}></div>
                </header>
                <section
                    className={`admin-hall_container_body admin-hall_container_body_linedecorator
                ${visible === true ? "" : "admin-hall_container_body_hidden"}`}
                >
                    <div>Доступные залы:</div>
                    <div className="hall-set">
                        {halls?.map((hall: { hall_name: string }, index) => (
                            <div className="admin-hallset_list_item" key={crypto.randomUUID()}>
                                <div>–</div>
                                <div>{hall.hall_name}</div>
                                <div className="admin-hall_delete_button" onClick={() => deleteHall(index)}></div>
                            </div>
                        ))}
                    </div>
                    <button onClick={showAddHall}>СОЗДАТЬ ЗАЛ</button>
                </section>
            </div>
            {showAdd ? <HallAddPopup closeFunc={hideAddHall} /> : null}
        </>
    );
}
