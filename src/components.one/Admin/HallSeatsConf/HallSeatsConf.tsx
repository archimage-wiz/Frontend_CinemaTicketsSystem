import "./HallSeatsConf.css";
import "../../../css/Buttons.css";
import { useEffect, useState } from "react";
import { BackendAPI } from "../../../BackendAPI/BackendAPI.tsx";
import { HallChooser } from "../../../components/HallChooser/HallChooser.tsx";
import { HallConfigType, HallType } from "../../../Types/Hall.ts";

export function HallSeatsConf() {
    const [backend] = useState(BackendAPI.getInstance());
    const [halls, setHalls] = useState(backend.getHalls());
    const [chosenHall, setChosenHall] = useState<number>(0);
    const [chosenHallConfig, setChosenHallConfig] = useState<HallConfigType[]>([]);
    const [hallRows, setHallRows] = useState(1);
    const [hallCols, setHallCols] = useState(1);
    const [sendButtonDisabled, setSendButtonDisabled] = useState(false);
    const [visible, setVisible] = useState(true);
    const [buttonsVisible, setButtonsVisible] = useState(false);

    useEffect(() => {
        backend.subscribeHallsUpdate(updateHalls);
    }, []);
    function updateHalls(hallsData: HallType[]) {
        setHalls(hallsData);
        if (hallsData[chosenHall]) {
            setChosenHallConfig(() => copyHallConfig(hallsData[chosenHall]));
        }
        setHallRows(hallsData[chosenHall]?.["hall_config"]?.["length"]);
        setHallCols(hallsData[chosenHall]?.["hall_config"][0]?.["length"]);
    }
    function copyHallConfig(oldHallData: HallType) {
        if (Array.isArray(oldHallData["hall_config"])) {
            const newChosenHallConfig: HallConfigType[] = [];
            oldHallData["hall_config"].forEach((hallData) => {
                newChosenHallConfig.push([...hallData]);
            });
            return newChosenHallConfig;
        }
        return [];
    }

    function chooseHall(hall: number) {
        setChosenHall(hall);
        setChosenHallConfig(() => copyHallConfig(halls[hall]));
        setHallRows(halls[hall]?.["hall_config"]?.["length"]);
        setHallCols(halls[hall]?.["hall_config"]?.[0]?.["length"]);
    }

    function hadleRowsChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newTarget = Number(event.target.value);
        if (newTarget < 1 || newTarget > 50) return;
        setHallRows(Number(event.target.value));
        let newHallConfig: HallConfigType[] = [];
        if (chosenHallConfig.length > newTarget) {
            newHallConfig = chosenHallConfig.slice(0, newTarget);
        }
        if (chosenHallConfig.length < newTarget) {
            const newLine = new Array(hallCols).fill("disabled");
            newHallConfig = [...chosenHallConfig, ...new Array(newTarget - chosenHallConfig.length).fill(newLine)];
        }
        setChosenHallConfig(newHallConfig);
        setButtonsVisible(true);
    }
    function handleColsChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newTarget = Number(event.target.value);
        if (newTarget < 1 || newTarget > 50) return;
        setHallCols(Number(event.target.value));
        const newChosenHallConfig: HallConfigType[] = [];
        chosenHallConfig.forEach((row) => {
            if (newTarget < row.length) newChosenHallConfig.push(row.slice(0, newTarget));
            if (newTarget > row.length)
                newChosenHallConfig.push([...row, ...new Array(newTarget - row.length).fill("disabled")]);
        });
        setChosenHallConfig(newChosenHallConfig);
        setButtonsVisible(true);
    }
    function changeSeatState(row: number, col: number) {
        if (!chosenHallConfig[row][col]) return;
        const newChosenHallConfig: HallConfigType[] = [...chosenHallConfig];
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
        setButtonsVisible(true);
    }
    function restoreHallConfig() {
        setButtonsVisible(false);
        setChosenHallConfig(() => copyHallConfig(halls[chosenHall]));
        setHallRows(halls[chosenHall]?.["hall_config"]?.["length"]);
        setHallCols(halls[chosenHall]?.["hall_config"][0]?.["length"]);
    }
    function saveHallConfig() {
        setSendButtonDisabled(true);
        setButtonsVisible(false);
        const res = backend.saveHallConfig(
            halls[chosenHall]?.["id"],
            chosenHallConfig.length,
            chosenHallConfig[0].length,
            chosenHallConfig
        );
        res.then(() => {
            setSendButtonDisabled(false);
        });
    }
    function toggleVisibility() {
        setVisible(!visible);
    }

    function getButtons() {
        return buttonsVisible ? (
            <>
                <div className="HallSeatsConf__buttons-container">
                    <input type="button" value="Отмена" className="cancel-button" onClick={() => restoreHallConfig()} />
                    <input
                        type="button"
                        value="Сохранить"
                        className="standart-button"
                        onClick={saveHallConfig}
                        disabled={sendButtonDisabled}
                    />
                </div>
            </>
        ) : null;
    }

    function HallSeats() {
        if (chosenHallConfig?.length === 0) return null;
        return (
            <>
                {chosenHallConfig?.map((row: HallConfigType, indexRow) => (
                    <div key={crypto.randomUUID()} className="HallSeatsConf__conf_seats_row">
                        {row.map((item, indexCol) => (
                            <div
                                key={crypto.randomUUID()}
                                className={"HallSeatsConf__conf_aloneseat HallSeatsConf__conf_aloneseat_" + item}
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
            <div className="AdminSection__container">
                <header className="AdminSection__header AdminSection__header-linedecorator_both">
                    <div>КОНФИГУРАЦИЯ ЗАЛОВ</div>
                    <div className="AdminSection__header-close-button" onClick={toggleVisibility}></div>
                </header>
                <section
                    className={`AdminSection__body-container AdminSection__body-container_linedecorator
                ${visible === true ? "" : "AdminSection__body-container_hidden"}`}
                >
                    <div className="HallSeatsConf__choose-hall-title">Выберите зал для концигурации:</div>
                    <HallChooser chooseHallF={chooseHall} />

                    <div className="HallSeatsConf__choose-seats-title">
                        Укажите количество рядов и максимальное количество кресел в ряду:
                    </div>
                    <div className="HallSeatsConf__rows-seats">
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
                    <div className="HallSeatsConf__choose-seats-type-title">
                        Теперь вы можете указать типы кресел на схеме зала:
                    </div>
                    <div className="HallSeatsConf__seats-info-container">
                        <div className="HallSeatsConf__seats-info-row">
                            <div className="HallSeatsConf__conf_aloneseat HallSeatsConf__conf_aloneseat_standart"></div>
                            <div>— обычные кресла </div>
                        </div>
                        <div className="HallSeatsConf__seats-info-row">
                            <div className="HallSeatsConf__conf_aloneseat HallSeatsConf__conf_aloneseat_vip"></div>
                            <div> — VIP кресла </div>
                        </div>
                        <div className="HallSeatsConf__seats-info-row">
                            <div className="HallSeatsConf__conf_aloneseat HallSeatsConf__conf_aloneseat_disabled"></div>
                            <div> — заблокированные (нет кресла)</div>
                        </div>
                    </div>
                    <div className="HallSeatsConf__choose-seats-change-type-title">
                        Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
                    </div>

                    <div className="HallSeatsConf__conf_main_container">
                        <div className="HallSeatsConf__conf_seats_container">
                            <HallSeats />
                        </div>
                    </div>
                    {getButtons()}
                </section>
            </div>
        </>
    );
}
