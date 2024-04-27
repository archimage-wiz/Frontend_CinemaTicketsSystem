import "./HallPriceConf.css";
import { useEffect, useRef, useState } from "react";
import { HallChooser } from "../../../components/HallChooser/HallChooser";
import { BackendAPI } from "../../../BackendAPI/BackendAPI";

export function HallPriceConf() {
    const backend = BackendAPI.getInstance();
    const chosenHall = useRef<number>(0);
    const [halls, setHalls] = useState(backend.getHalls());
    const [standartSeatPrice, setStandartSeatPrice] = useState(0);
    const [vipSeatPrice, setVipSeatPrice] = useState(0);
    const sendButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        backend.subscribeHallsUpdate(updateHalls);
        return () => {
            backend.unsubscribeHallsUpdate(updateHalls);
        };
    }, []);
    function updateHalls(hallsData: []) {
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
        setStandartSeatPrice(() => {
            return Number(event.target.value);
        });
    }
    function vipSeatPriceHandler(event: React.ChangeEvent<HTMLInputElement>) {
        setVipSeatPrice(() => {
            return Number(event.target.value);
        });
    }
    function restorePrice() {
        setStandartSeatPrice(() => {
            return Number(halls[chosenHall.current]?.["hall_price_standart"]);
        });
        setVipSeatPrice(() => {
            return Number(halls[chosenHall.current]?.["hall_price_vip"]);
        });
    }
    function savePrice() {
        sendButton.current!.disabled = true;
        const res = backend.saveSeatsPrice(halls[chosenHall.current]?.["id"], standartSeatPrice, vipSeatPrice);
        res.then(() => {
            sendButton.current!.disabled = false;
            // setHalls(() => backend.getHalls());
            backend.globalUpdate();
        });
    }

    return (
        <>
            <div className="admin-hall_container">
                <header className="admin-hall_title admin-hall_title_linedecorator_both">
                    <div>КОНФИГУРАЦИЯ ЦЕН</div>
                    <div className="admin-hall_title_close"></div>
                </header>
                <section className="admin-hall_container_body admin-hall_container_body_linedecorator">
                    <div className="hall-price__choose-hall-title">Выберите зал для концигурации:</div>
                    <HallChooser chooseHallF={chooseHall} />
                    <div className="hall-price__price-set-title">Установите цены для типов кресел:</div>
                    <label className="hall-price__set-price-label-container">
                        Цена, рублей
                        <div className="hall-price__set-price_container">
                            <input type="number" value={standartSeatPrice || 0} onChange={standartSeatPriceHandler} />
                            <div>за</div>
                            <div className="admin-hallseats_conf_aloneseat admin-hallseats_conf_aloneseat_standart"></div>
                            <div>обычные кресла</div>
                        </div>
                    </label>
                    <label className="hall-price__set-price-label-container">
                        Цена, рублей
                        <div className="hall-price__set-price_container">
                            <input type="number" value={vipSeatPrice || 0} onChange={vipSeatPriceHandler} />
                            <div>за</div>
                            <div className="admin-hallseats_conf_aloneseat admin-hallseats_conf_aloneseat_vip"></div>
                            <div> VIP кресла</div>
                        </div>
                    </label>
                    <div className="HallPriceConf__buttons-container">
                        <input type="button" value="Отмена" className="cancel-button" onClick={restorePrice} />
                        <input type="button" value="Сохранить" className="standart-button" onClick={savePrice} ref={sendButton}/>
                    </div>
                </section>
            </div>
        </>
    );
}
