import "./HallOpenCloseConf.css";
import { HallChooser } from "../../../components/HallChooser/HallChooser";
import { BackendAPI } from "../../../BackendAPI/BackendAPI";
import { useEffect, useLayoutEffect, useState } from "react";

export function HallOpenCloseConf() {

    const [backend] = useState(BackendAPI.getInstance());
    const [halls, setHalls] = useState(backend.getHalls());
    const [chosenHall, setChosenHall] = useState(0);

    useEffect(() => {
        backend.subscribeHallsUpdate(updateHalls);
        return () => {
            backend.unsubscribeHallsUpdate(updateHalls);
        };
    }, [backend]);
    function updateHalls(hallsData: []) {
        setHalls(() => hallsData);
    }
    function chooseHall(hall: number) {
        setChosenHall(hall);
    }
    function getHallStatus() {
        return halls[chosenHall]?.hall_open === 1 ?  "Открыт" : "Закрыт";
    }
    function openCloseHall() {
        backend.openCloseHall(halls[chosenHall].id, Number(halls[chosenHall].hall_open) === 1 ? 0 : 1);
    }

    return (
        <>
            <div className="admin-hall_container">
                <header className="admin-hall_title admin-hall_title_linedecorator_upper">
                    <div>ОТКРЫТЬ ПРОДАЖИ</div>
                    <div className="admin-hall_title_close"></div>
                </header>
                <section className="admin-hall_container_body">
                    
                    <div className="hall-openclose__choose-hall-title">Выберите залл для открытия/закрытия продаж:</div>
                    <HallChooser chooseHallF={chooseHall}/>
                    <div className="hall-openclose__ready-title">Зал: {getHallStatus()}</div>
                    <button className="standart-button hall-openclose__apply-button" onClick={openCloseHall}>Открыть продажу билетов</button>
                </section>
            </div>
        </>
    );
}