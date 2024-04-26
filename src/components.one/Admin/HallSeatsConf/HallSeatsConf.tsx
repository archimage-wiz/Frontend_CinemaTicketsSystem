import "./HallSeatsConf.css";
import "../../../css/Buttons.css";
import { useEffect, useState } from "react";
import { BackendAPI } from "../../../BackendAPI/BackendAPI.tsx";
import { HallChooser } from "../../../components/HallChooser/HallChooser.tsx";

export function HallSeatsConf() {
    const [backend] = useState(BackendAPI.getInstance());
    const [halls, setHalls] = useState(backend.getHalls());
    const [chosenHall, setChosenHall] = useState<number>(0);
    const [chosenHallConfig, setChosenHallConfig] = useState<any[]>([]);
    const [hallRows, setHallRows] = useState(1);
    const [hallCols, setHallCols] = useState(1);
    const [sendButtonDisabled, setSendButtonDisabled] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        backend.subscribeHallsUpdate(updateHalls);
    }, []);
    function updateHalls(hallsData: []) {
        setHalls(hallsData);
        setChosenHallConfig(hallsData[chosenHall]?.["hall_config"]);
        setHallRows(hallsData[chosenHall]?.["hall_config"]?.["length"]);
        setHallCols(hallsData[chosenHall]?.["hall_config"][0]?.["length"]);
    }

    function chooseHall(hall: number) {
        setChosenHall(hall);
        setChosenHallConfig(halls[hall]?.["hall_config"]);
        setHallRows(halls[hall]?.["hall_config"]?.["length"]);
        setHallCols(halls[hall]?.["hall_config"]?.[0]?.["length"]);
    }

    function hadleRowsChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newTarget = Number(event.target.value);
        if (newTarget < 1 || newTarget > 50) return;
        setHallRows(Number(event.target.value));
        let newHallConfig: any[] = [];
        if (chosenHallConfig.length > newTarget) {
            newHallConfig = chosenHallConfig.slice(0, newTarget);
        }
        if (chosenHallConfig.length < newTarget) {
            const newLine = new Array(hallCols).fill("disabled");
            newHallConfig = [...chosenHallConfig, ...new Array(newTarget - chosenHallConfig.length).fill(newLine)];
        }
        setChosenHallConfig(newHallConfig);
    }
    function handleColsChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newTarget = Number(event.target.value);
        if (newTarget < 1 || newTarget > 50) return;
        setHallCols(Number(event.target.value));
        const newChosenHallConfig: any[] = [];
        chosenHallConfig.forEach((row) => {
            if (newTarget < row.length) newChosenHallConfig.push(row.slice(0, newTarget));
            if (newTarget > row.length)
                newChosenHallConfig.push([...row, ...new Array(newTarget - row.length).fill("disabled")]);
        });
        setChosenHallConfig(newChosenHallConfig);
    }
    function changeSeatState(row: number, col: number) {
        if (!chosenHallConfig[row][col]) return;
        const newChosenHallConfig = [...chosenHallConfig];
        switch (newChosenHallConfig[row][col]) {
            case "disabled":
                newChosenHallConfig[row][col] = "standart";
                break;
            case "standart":
                newChosenHallConfig[row][col] = "vip";
                break;
            case "vip":
                newChosenHallConfig[row][col] = "disabled";
                break;
            default:
                break;
        }
        setChosenHallConfig(newChosenHallConfig);
    }
    function restoreHallConfig() {
        setChosenHallConfig(halls[chosenHall]?.["hall_config"]);
        setHallRows(halls[chosenHall]?.["hall_config"]?.["length"]);
        setHallCols(halls[chosenHall]?.["hall_config"][0]?.["length"]);
    }
    function saveHallConfig() {
        setSendButtonDisabled(true);
        const res = backend.saveHallConfig(
            halls[chosenHall]?.["id"],
            chosenHallConfig.length,
            chosenHallConfig[0].length,
            chosenHallConfig
        );
        res.then((data) => {
            console.log(data);
            setSendButtonDisabled(false);
        });
    }
    function toggleVisibility() {
        setVisible(!visible);
    }

    function HallSeats() {
        if (chosenHallConfig?.length === 0) return null;
        return (
            <>
                {chosenHallConfig?.map((row: [], indexRow) => (
                    <div key={crypto.randomUUID()} className="admin-hallseats_conf_seats_row">
                        {row.map((item, indexCol) => (
                            <div
                                key={crypto.randomUUID()}
                                className={"admin-hallseats_conf_aloneseat admin-hallseats_conf_aloneseat_" + item}
                                onClick={() => {
                                    changeSeatState(indexRow, indexCol);
                                }}
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
                    <div className="admin-hall_title_close" onClick={toggleVisibility}></div>
                </header>
                <section
                    className={`admin-hall_container_body admin-hall_container_body_linedecorator
                ${visible === true ? "" : "admin-hall_container_body_hidden"}`}
                >
                    <div className="hall-seats__choose-hall-title">Выберите зал для концигурации:</div>
                    <HallChooser chooseHallF={chooseHall} />

                    <div className="hall-seats__choose-seats-title">
                        Укажите количество рядов и максимальное количество кресел в ряду:
                    </div>
                    <div className="hall-seats__rows-seats">
                        <label>
                            Рядов, шт.
                            <input
                                type="number"
                                required
                                min="1"
                                value={hallRows || 0}
                                onChange={(e) => hadleRowsChange(e)}
                            />
                        </label>
                        <div>x</div>
                        <label>
                            Мест, шт.
                            <input
                                type="number"
                                placeholder="8"
                                min="1"
                                required
                                value={hallCols || 0}
                                onChange={(e) => handleColsChange(e)}
                            />
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

                    <div className="HallSeatsConf__buttons-container">
                        <input
                            type="button"
                            value="Отмена"
                            className="cancel-button"
                            onClick={() => restoreHallConfig()}
                        />
                        <input
                            type="button"
                            value="Сохранить"
                            className="standart-button"
                            onClick={saveHallConfig}
                            disabled={sendButtonDisabled}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}
