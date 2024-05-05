import "./HallPriceConf.css";
import { useEffect, useRef, useState } from "react";
import { HallChooser } from "../../../components/HallChooser/HallChooser";
import { BackendAPI } from "../../../BackendAPI/BackendAPI";
import { HallType } from "../../../Types/Hall";

export function HallPriceConf() {
    const backend = BackendAPI.getInstance();
    const chosenHall = useRef<number>(0);
    const [halls, setHalls] = useState(backend.getHalls());
    const [standartSeatPrice, setStandartSeatPrice] = useState(0);
    const [vipSeatPrice, setVipSeatPrice] = useState(0);
    const sendButton = useRef<HTMLInputElement | null>(null);
    const [buttonsVisible, setButtonsVisible] = useState(false);

    useEffect(() => {
        backend.subscribeHallsUpdate(updateHalls);
        return () => {
            backend.unsubscribeHallsUpdate(updateHalls);
        };
    }, [backend]);
    function updateHalls(hallsData: HallType[]) {
        setHalls(() => hallsData);
        setStandartSeatPrice(() => {
            return Number(hallsData[chosenHall.current]?.["hall_price_standart"]);
        });
        setVipSeatPrice(() => {
            return Number(hallsData[chosenHall.current]?.["hall_price_vip"]);
        });
    }

    function chooseHall(hall: number) {
        chosenHall.current = hall;
        setStandartSeatPrice(() => {
            return Number(halls[hall]?.["hall_price_standart"]);
        });
        setVipSeatPrice(() => {
            return Number(halls[hall]?.["hall_price_vip"]);
        });
    }

    function standartSeatPriceHandler(event: React.ChangeEvent<HTMLInputElement>) {
        setButtonsVisible(true);
        setStandartSeatPrice(() => {
            return Number(event.target.value);
        });
    }
    function vipSeatPriceHandler(event: React.ChangeEvent<HTMLInputElement>) {
        setButtonsVisible(true);
        setVipSeatPrice(() => {
            return Number(event.target.value);
        });
    }
    function restorePrice() {
        setButtonsVisible(false);
        setStandartSeatPrice(() => {
            return Number(halls[chosenHall.current]?.["hall_price_standart"]);
        });
        setVipSeatPrice(() => {
            return Number(halls[chosenHall.current]?.["hall_price_vip"]);
        });
    }
    function savePrice() {
        sendButton.current!.disabled = true;
        setButtonsVisible(false);
        const res = backend.saveSeatsPrice(halls[chosenHall.current]?.["id"], standartSeatPrice, vipSeatPrice);
        res.then(() => {
            // sendButton.current!.disabled = false;
            backend.globalUpdate();
        });
    }

    function getButtons() {
        return buttonsVisible ? (
            <div className="HallPriceConf__buttons-container">
                <input type="button" value="Отмена" className="cancel-button" onClick={restorePrice} />
                <input
                    type="button"
                    value="Сохранить"
                    className="standart-button"
                    onClick={savePrice}
                    ref={sendButton}
                />
            </div>
        ) : null;
    }

    return (
        <>
            <div className="AdminSection__container">
                <header className="AdminSection__header AdminSection__header-linedecorator_both">
                    <div>КОНФИГУРАЦИЯ ЦЕН</div>
                    <div className="AdminSection__header-close-button"></div>
                </header>
                <section className="AdminSection__body-container AdminSection__body-container_linedecorator">
                    <div className="HallPriceConf__choose-hall-title">Выберите зал для концигурации:</div>
                    <HallChooser chooseHallF={chooseHall} />
                    <div className="HallPriceConf__price-set-title">Установите цены для типов кресел:</div>
                    <label className="HallPriceConf__set-price-label-container">
                        Цена, рублей
                        <div className="HallPriceConf__set-price_container">
                            <input type="number" value={standartSeatPrice || 0} onChange={standartSeatPriceHandler} />
                            <div>за</div>
                            <div className="HallSeatsConf__conf_aloneseat HallSeatsConf__conf_aloneseat_standart"></div>
                            <div>обычные кресла</div>
                        </div>
                    </label>
                    <label className="HallPriceConf__set-price-label-container">
                        Цена, рублей
                        <div className="HallPriceConf__set-price_container">
                            <input type="number" value={vipSeatPrice || 0} onChange={vipSeatPriceHandler} />
                            <div>за</div>
                            <div className="HallSeatsConf__conf_aloneseat HallSeatsConf__conf_aloneseat_vip"></div>
                            <div> VIP кресла</div>
                        </div>
                    </label>
                    {getButtons()}
                </section>
            </div>
        </>
    );
}
