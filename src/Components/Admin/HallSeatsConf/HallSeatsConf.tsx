import "./HallSeatsConf.css";
import { useEffect, useState } from "react";
import { BackendAPI } from "../../../BackendAPI";

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
                                className={"admin-hallseats_conf_aloneseat admin-hallseats_conf_aloneseat_" + item}
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
                <header className="admin-hall_title">
                    <div>КОНФИГУРАЦИЯ ЗАЛОВ</div>
                    <div className="admin-hall_title_close"></div>
                </header>
                <section className="admin-hall_container_body">
                    <div>Выберите зал для концигурации:</div>
                    <div className="admin-hallseats_list_container">
                        {halls.map((hall: { hall_name: string }, index) => (
                            <div
                                key={crypto.randomUUID()}
                                className="admin-hallseats_list_item"
                                onClick={() => chooseHall(index)}
                            >
                                {hall.hall_name}
                            </div>
                        ))}
                    </div>
                    <br></br>
                    <div>Укажите количество рядов и максимальное количество кресел в ряду:</div>
                    <div>
                        <label>
                            Рядов шт.
                            <input type="number" />
                        </label>
                        <label>
                            Mest шт.
                            <input type="number" />
                        </label>
                    </div>
                    <br></br>
                    <div>Теперь вы можете указать типы кресел на схеме зала:</div>
                    <div>— обычные кресла </div>
                    <div> — VIP кресла </div>
                    <div> — заблокированные (нет кресла)</div>
                    <div className="admin-hallseats_conf_main_container">
                        <div className="admin-hallseats_conf_seats_container">
                            <HallSeats />
                        </div>
                    </div>
                    <div>Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</div>
                </section>
            </div>
        </>
    );
}
