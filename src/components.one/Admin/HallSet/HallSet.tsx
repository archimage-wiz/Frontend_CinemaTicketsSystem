import "./HallSet.css";
import { BackendAPI } from "../../../BackendAPI/BackendAPI.tsx";
import { useEffect, useState } from "react";
import { HallAddPopup } from "./HallAddPopup/HallAddPopup";
import { HallType } from "../../../Types/Hall.ts";

export function HallSet() {
    const [backend] = useState(BackendAPI.getInstance());
    const [showAdd, setShowAdd] = useState(false);
    const [halls, setHalls] = useState(backend.getHalls());
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        backend.subscribeHallsUpdate(updateHalls);
    }, []);
    function updateHalls(halls: HallType[]) {
        setHalls(halls);
    }

    function showAddHall() {
        setShowAdd(true);
    }
    function hideAddHall() {
        setShowAdd(false);
    }

    function deleteHall(hallId: number) {
        backend.deleteHall(hallId);
    }

    function toggleVisibility() {
        setVisible(!visible);
    }

    return (
        <>
            <div className="AdminSection__container">
                <header className="AdminSection__header AdminSection__header-linedecorator">
                    <div>УПРАВЛЕНИЕ ЗАЛАМИ</div>
                    <div className="AdminSection__header-close-button" onClick={toggleVisibility}></div>
                </header>
                <section
                    className={`AdminSection__body-container AdminSection__body-container_linedecorator
                ${visible === true ? "" : "AdminSection__body-container_hidden"}`}
                >
                    <div>Доступные залы:</div>
                    <div className="HallSet__list-container">
                        {halls?.map((hall: {id:number, hall_name: string }) => (
                            <div className="HallSet__list-item" key={crypto.randomUUID()}>
                                <div>–</div>
                                <div>{hall.hall_name}</div>
                                <div className="HallSet__delete-button" onClick={() => deleteHall(hall.id)}></div>
                            </div>
                        ))}
                    </div>
                    <button onClick={showAddHall} className="standart-button">СОЗДАТЬ ЗАЛ</button>
                </section>
            </div>
            {showAdd ? <HallAddPopup closeFunc={hideAddHall} /> : null}
        </>
    );
}
