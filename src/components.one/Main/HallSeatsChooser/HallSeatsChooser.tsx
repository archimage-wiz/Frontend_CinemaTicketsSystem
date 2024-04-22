import "./HallSeatsChooser.css";
import { useParams } from "react-router-dom";
import { BackendAPI } from "../../../BackendAPI/BackendAPI";
import { useEffect, useState } from "react";
import { Header } from "../Header/Header";

export function HallSeatsChooser() {
    const { seanceId } = useParams();
    const [backend] = useState(BackendAPI.getInstance());
    const [halls, setHalls] = useState(backend.getHalls());
    const [films, setFilms] = useState(backend.getFilms());
    const [seances, setSeances] = useState(backend.getSeances());
    const [selectedSeats, setSelectedSeats] = useState<{ place: number; row: number }[]>([]);

    useEffect(() => {
        backend.setUpdateF("halls", updateHalls);
        backend.setUpdateF("films", updateFilms);
        backend.setUpdateF("seances", updateSeances);
    }, []);

    function updateHalls() {
        setHalls(backend.getHalls());
    }
    function updateFilms() {
        setFilms(backend.getFilms());
    }
    function updateSeances() {
        setSeances(backend.getSeances());
    }

    function filmById(id: number): { id: number; film_name: string } | undefined {
        return films.find((film: { id: number }) => film.id === id);
    }
    function hallById(id: number): { id: number; hall_name: string; hall_open: number; hall_config: any } | undefined {
        return halls.find((h: { id: number }) => h.id === id);
    }
    function seanceById(
        id: number
    ): { id: number; seance_hallid: number; seance_filmid: number; seance_time: string } | undefined {
        return seances.find((s: { id: number }) => s.id === id);
    }

    function getFilmTitle() {
        const seance = seanceById(parseInt(seanceId!));
        const film = filmById(Number(seance?.seance_filmid));
        return film?.film_name;
    }
    function getHallId(): number | undefined {
        const seance = seanceById(parseInt(seanceId!));
        return seance?.seance_hallid;
    }
    function getSeanceStartTime(): string | undefined {
        const seance = seanceById(parseInt(seanceId!));
        return seance?.seance_time;
    }
    function getHallName(): string | undefined {
        const seance = seanceById(parseInt(seanceId!));
        const hall = hallById(Number(seance?.seance_hallid));
        return hall?.hall_name;
    }

    function selectSeat(seatPosX: number, seatPosY: number) {
        const hall = hallById(getHallId()!);
        const hallConfig: [] = hall?.hall_config;
        if (hallConfig[seatPosY][seatPosX] !== "vip" && hallConfig[seatPosY][seatPosX] !== "standart") return;
        const newSeat = {
            place: seatPosX,
            row: seatPosY,
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


    function HallSeats(props: { hallId: number }) {
        if (halls.length === 0) return null;
        const hall = hallById(props.hallId);
        const hallConfig: [] = hall?.hall_config;

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
                    <HallSeats hallId={getHallId()!} />
                </div>

                <div className="HallSeatsChooser__seats-info-container">seats descr</div>
            </section>
            <div className="HallSeatsChooser__order-button-container">
                <button>Забронировать</button>
            </div>
        </>
    );
}
