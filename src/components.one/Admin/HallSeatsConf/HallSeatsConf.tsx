import "./HallSeatsConf.css";
import "../../../css/Buttons.css";
import "../../../css/Seats.css";
import { useEffect, useState } from "react";
import { BackendAPI } from "../../../BackendAPI/BackendAPI.tsx";
import { HallChooser } from "../../../components/HallChooser/HallChooser.tsx";

export function HallSeatsConf() {
    const [backend] = useState(BackendAPI.getInstance());
    const [halls, setHalls] = useState(backend.getHalls());
    const [chosenHall, setChosenHall] = useState(0);

    useEffect(() => {
        backend.setUpdateF("halls", updateHalls);
    }, []);
    function updateHalls() {
        setHalls(backend.getHalls());
    }

    function chooseHall(hall: number) {
        setChosenHall(hall);
    }

    function HallSeats() {
        if (halls.length === 0) return null;
        const hallConfig: [] = halls[chosenHall]["hall_config"];
        return (
            <>
                {hallConfig.map((row: []) => (
                    <div key={crypto.randomUUID()} className="admin-hallseats_conf_seats_row">
                        {row.map((item) => (
                            <div
                                key={crypto.randomUUID()}
                                className={
                                    "admin-hallseats_conf_aloneseat admin-hallseats_conf_aloneseat_" +
                                    item
                                }
                            ></div>
                        ))}
                    </div>
                ))}
            </>
        );
    }

    return (
        <>
            <div className="admin-hall_container">
                <header className="admin-hall_title admin-hall_title_linedecorator_both">
                    <div>КОНФИГУРАЦИЯ ЗАЛОВ</div>
                    <div className="admin-hall_title_close"></div>
                </header>
                <section className="admin-hall_container_body admin-hall_container_body_linedecorator">
                    <div className="hall-seats__choose-hall-title">
                        Выберите зал для концигурации:
                    </div>
                    <HallChooser chooseHallF={chooseHall} />

                    <div className="hall-seats__choose-seats-title">
                        Укажите количество рядов и максимальное количество кресел в ряду:
                    </div>
                    <div className="hall-seats__rows-seats">
                        <label>
                            Рядов, шт.
                            <input type="number" placeholder="10" />
                        </label>
                        <div>x</div>
                        <label>
                            Мест, шт.
                            <input type="number" placeholder="8" />
                        </label>
                    </div>
                    <div className="hall-seats__choose-seats-type-title">
                        Теперь вы можете указать типы кресел на схеме зала:
                    </div>
                    <div className="hall-seats__seats-info-container">
                        <div className="admin-hallseats_conf_aloneseat admin-hallseats_conf_aloneseat_standart"></div>
                        <div>— обычные кресла </div>
                        <div className="admin-hallseats_conf_aloneseat admin-hallseats_conf_aloneseat_vip"></div>
                        <div> — VIP кресла </div>
                        <div className="admin-hallseats_conf_aloneseat admin-hallseats_conf_aloneseat_disabled"></div>
                        <div> — заблокированные (нет кресла)</div>
                    </div>
                    <div className="hall-seats__choose-seats-change-type-title">
                        Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
                    </div>

                    <div className="admin-hallseats_conf_main_container">
                        <div className="admin-hallseats_conf_seats_container">
                            <HallSeats />
                        </div>
                    </div>

                    <div className="admin-yes-no__buttons-container">
                        <input type="submit" value="Отмена" className="cancel-button" />
                        <input type="submit" value="Сохранить" className="standart-button" />
                    </div>
                </section>
            </div>
        </>
    );
}
