import "./HallOpenCloseConf.css";
import { HallChooser } from "../../../components/HallChooser/HallChooser";
import { BackendAPI } from "../../../BackendAPI/BackendAPI";
import { useEffect, useState } from "react";
import { HallType } from "../../../Types/Hall";

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
    function updateHalls(hallsData: HallType[]) {
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
            <div className="AdminSection__container">
                <header className="AdminSection__header AdminSection__header-linedecorator_upper">
                    <div>ОТКРЫТЬ ПРОДАЖИ</div>
                    <div className="AdminSection__header-close-button"></div>
                </header>
                <section className="AdminSection__body-container">
                    
                    <div className="HallOpenClose__choose-hall-title">Выберите залл для открытия/закрытия продаж:</div>
                    <HallChooser chooseHallF={chooseHall}/>
                    <div className="HallOpenClose__ready-title">Зал: {getHallStatus()}</div>
                    <button className="standart-button HallOpenClose__apply-button" onClick={openCloseHall}>Открыть продажу билетов</button>
                </section>
            </div>
        </>
    );
}