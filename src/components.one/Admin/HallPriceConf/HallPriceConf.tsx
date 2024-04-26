import "./HallPriceConf.css";
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
                    <div className="hall-price__choose-hall-title">
                        Выберите зал для концигурации:
                    </div>
                    <HallChooser chooseHallF={chooseHall} />
                    <div className="hall-price__price-set-title">
                        Установите цены для типов кресел:
                    </div>
                    <label className="hall-price__set-price-label-container">
                        Цена, рублей
                        <div className="hall-price__set-price_container">
                            <input type="number" />
                            <div>за</div>
                            <div className="admin-hallseats_conf_aloneseat admin-hallseats_conf_aloneseat_standart"></div>
                            <div>обычные кресла</div>
                        </div>
                    </label>
                    <label className="hall-price__set-price-label-container">
                        Цена, рублей
                        <div className="hall-price__set-price_container">
                            <input type="number" />
                            <div>за</div>
                            <div className="admin-hallseats_conf_aloneseat admin-hallseats_conf_aloneseat_vip"></div>
                            <div> VIP кресла</div>
                        </div>
                    </label>
                    <div className="admin-yes-no__buttons-container">
                        <input type="submit" value="Отмена" className="cancel-button" />
                        <input type="submit" value="Сохранить" className="standart-button" />
                    </div>
                </section>
            </div>
        </>
    );
}
