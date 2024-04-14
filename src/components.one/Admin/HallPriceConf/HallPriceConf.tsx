import { useState } from "react";
import { HallChooser } from "../../../components/HallChooser/HallChooser";

export function HallPriceConf() {

    const [chosenHall, setChosenHall] = useState(0);

    function chooseHall(hall: number) {
        setChosenHall(hall);
    }

    return (
        <>
            <div className="admin-hall_container">
                <header className="admin-hall_title admin-hall_title_linedecorator_both">
                    <div>КОНФИГУРАЦИЯ ЦЕН</div>
                    <div className="admin-hall_title_close"></div>
                </header>
                <section className="admin-hall_container_body admin-hall_container_body_linedecorator">
                    
                    <div>Выберите зал для концигурации:</div>

                    <HallChooser chooseHallF={chooseHall}/>

                </section>
            </div>
        </>
    );
}