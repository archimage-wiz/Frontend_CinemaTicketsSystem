import "./HallSeatsChooser.css";
import { useNavigate, useParams } from "react-router-dom";
import { BackendAPI } from "../../../BackendAPI/BackendAPI";
import { useEffect, useState } from "react";
import { Header } from "../Header/Header";

export function HallSeatsChooser() {
    const navigate = useNavigate();
    const { seanceId, currentDate } = useParams();
    const [backend] = useState(BackendAPI.getInstance());
    const [hallConfig, setHallConfig] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState<{ place: number; row: number; seanceId: number; cost: number }[]>([]);
    const [film, setFilm] = useState<{id?: number; film_name?: string }>({});
    const [hall, setHall] = useState<{
        hall_name?: string;
        hall_open?: number;
        id?: number;
        hall_price_standart?: number;
        hall_price_vip?: number;
    }>({});
    const [seance, setSeance] = useState<{ seance_filmid?: number; seance_hallid?: number; seance_time?: string }>({});

    function seanceById(
        id: number
    ): { id: number; seance_hallid: number; seance_filmid: number; seance_time: string } | undefined {
        return backend.getSeances().find((s: { id: number }) => s.id === id);
    }

    useEffect(() => {
        backend.getHallConfig(parseInt(seanceId!), currentDate!).then((data) => setHallConfig(data.result));
        backend.setUpdateF("halls", updateHalls);
        backend.setUpdateF("films", updateFilms);
        backend.setUpdateF("seances", updateSeances);
        backend.manualUpdate();
    }, []);

    function updateHalls() {
        const s = seanceById(parseInt(seanceId!));
        setHall(backend.getHalls().find((h: { id: number }) => h.id === s?.seance_hallid) ?? {});
    }
    function updateFilms() {
        const s = seanceById(parseInt(seanceId!));
        setFilm(backend.getFilms().find((f: { id: number }) => f.id === s?.seance_filmid) ?? {});
    }
    function updateSeances() {
        const s = seanceById(parseInt(seanceId!));
        setSeance(s ?? {});
    }

    function getFilmTitle() {
        return film?.film_name;
    }

    function getSeanceStartTime(): string | undefined {
        return seance?.seance_time;
    }
    function getHallName(): string | undefined {
        return hall?.hall_name;
    }

    function selectSeat(seatPosX: number, seatPosY: number) {
        if (hallConfig.length === 0) return;
        if (hallConfig[seatPosY][seatPosX] !== "vip" && hallConfig[seatPosY][seatPosX] !== "standart") return;
        const newSeat = {
            place: seatPosX,
            row: seatPosY,
            seanceId: parseInt(seanceId!),
            cost: getStandartSeatPrice(hallConfig[seatPosY][seatPosX])!
        };
        if (checkIfSelected(seatPosX, seatPosY)) {
            setSelectedSeats(selectedSeats.filter((seat) => seat.place !== seatPosX || seat.row !== seatPosY));
            return;
        }
        setSelectedSeats([...selectedSeats, newSeat]);
    }
    function checkIfSelected(seatPosX: number, seatPosY: number) {
        return selectedSeats.find((seat) => seat.place === seatPosX && seat.row === seatPosY);
    }

    function orderTickets(e: React.MouseEvent<HTMLButtonElement>) {
        if (selectedSeats.length === 0) {alert("Выберите места"); return;}
        e.currentTarget.disabled = true;
        backend.setChosenSeats(selectedSeats);
        navigate(`/payment/${seanceId}/${hall?.id}/${film.id}/${currentDate}`);
    }

    function getStandartSeatPrice(type: string) {
        switch (type) {
            case "standart":
                return hall?.hall_price_standart;
            case "vip":
                return hall?.hall_price_vip;
            default:
                return 0;
        }
    }

    function HallSeats() {
        if (hallConfig.length === 0) return null;
        return (
            <>
                {hallConfig.map((row: [], indexY) => (
                    <div key={crypto.randomUUID()} className="HallSeatsChooser__seats-row">
                        {row.map((item, indexX) => (
                            <div
                                key={crypto.randomUUID()}
                                className={
                                    "HallSeatsChooser__seat HallSeatsChooser__seat_" +
                                    item +
                                    " " +
                                    (checkIfSelected(indexX, indexY) && "HallSeatsChooser__seat_selected")
                                }
                                onClick={() => selectSeat(indexX, indexY)}
                            ></div>
                        ))}
                    </div>
                ))}
            </>
        );
    }

    return (
        <>
            <Header
                options={{
                    loginButton: false,
                }}
            />
            <header className="HallSeatsChooser__header-container">
                <div className="HallSeatsChooser__header-film-title">{getFilmTitle()}</div>
                <div className="HallSeatsChooser__header-film-duration">Начало сеанса: {getSeanceStartTime()}</div>
                <div className="HallSeatsChooser__header-hall-name">{getHallName()}</div>
            </header>
            <section className="HallSeatsChooser__seats-main-container">
                <div className="HallSeatsChooser__seats">
                    <HallSeats />
                </div>
                <div className="HallSeatsChooser__seats-info-container">
                    <div>
                        <div className="HallSeatsChooser__seats-info-row">
                            <div className="HallSeatsChooser__seat HallSeatsChooser__seat_standart"></div>
                            <div className="HallSeatsChooser__seat_text">
                                Свободно ({getStandartSeatPrice("standart")}руб)
                            </div>
                        </div>
                        <div className="HallSeatsChooser__seats-info-row">
                            <div className="HallSeatsChooser__seat HallSeatsChooser__seat_vip"></div>
                            <div className="HallSeatsChooser__seat_text">
                                Свободно VIP ({getStandartSeatPrice("vip")}руб)
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="HallSeatsChooser__seats-info-row">
                            <div className="HallSeatsChooser__seat HallSeatsChooser__seat_taken"></div>
                            <div className="HallSeatsChooser__seat_text">Занято</div>
                        </div>
                        <div className="HallSeatsChooser__seats-info-row">
                            <div className="HallSeatsChooser__seat HallSeatsChooser__seat_selected"></div>
                            <div className="HallSeatsChooser__seat_text">Выбрано</div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="HallSeatsChooser__order-footer-container">
                <button className="standart-button" onClick={orderTickets}>
                    Забронировать
                </button>
            </footer>
        </>
    );
}
