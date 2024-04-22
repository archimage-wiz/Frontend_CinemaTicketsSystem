import "./HallOpenCloseConf.css";
import { HallChooser } from "../../../components/HallChooser/HallChooser";

export function HallOpenCloseConf() {

    function chooseHall(hall: number) {

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
                    <div className="hall-openclose__ready-title">Всё готово к открытию</div>
                    <button className="standart-button hall-openclose__apply-button">Открыть продажу билетов</button>
                </section>
            </div>
        </>
    );
}