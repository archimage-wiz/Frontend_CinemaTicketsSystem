import "./PaymentProc.css";
import { useEffect, useState } from "react";
import { BackendAPI, chosenSeats } from "../../../BackendAPI/BackendAPI";
import { Header } from "../Header/Header";
import { useNavigate, useParams } from "react-router-dom";

export function PaymentProc() {
    const navigate = useNavigate();
    const [backend] = useState(BackendAPI.getInstance());
    const { seanceId, hallId, filmId, currentDate} = useParams();
    const [film, setFilm] = useState<{ id?: number; film_name?: string }>({});
    const [hall, setHall] = useState<{ id?: number; hall_name?: string; hall_open?: number }>({});
    const [seance, setSeance] = useState<{
        id?: number;
        seance_filmid?: number;
        seance_hallid?: number;
        seance_time?: string;
    }>({});
    const [seats, setSeats] = useState<chosenSeats[]>([]);

    function filmById(id: number): { id: number; film_name: string } | undefined {
        return backend.getFilms().find((film: { id: number }) => film.id === id);
    }

    useEffect(() => {
        console.log("useEffect");
        const film = filmById(Number(filmId));
        const hall = backend.getHalls().find((h: { id: number }) => h.id === Number(hallId));
        const seance = backend.getSeances().find((s: { id: number }) => s.id === Number(seanceId));
        if (film === undefined || hall === undefined || seance === undefined) {
            navigate("/");
        }
        setFilm(film ?? {});
        setHall(hall ?? {});
        setSeance(seance ?? {});
        setSeats(backend.getSeats() ?? []);
    }, []);

    function getSeats() {
        return seats.map((s) => s.place + 1).join(", ");
    }
    function getHallName() {
        return hall.hall_name;
    }
    function getSeanceStartTime() {
        return seance.seance_time;
    }
    function getTotalPrice() {
        return seats.map((s) => s.cost).reduce((a, b) => a + b, 0);
    }

    function getResultTicket(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.disabled = true;
        navigate(`/tickets/${seanceId}/${hall?.id}/${film.id}/${currentDate}`);
    }

    return (
        <>
            <Header
                options={{
                    loginButton: false,
                }}
            />
            <div className="PaymentProc__header-container PaymentProc__ticket-decorator">Вы выбрали билеты:</div>
            <div className="PaymentProc__header-main-separator"></div>
            <main className="PaymentProc__main-container PaymentProc__ticket-decorator">
                <div className="PaymentProc__standart-text">
                    На фильм: <span className="PaymentProc__standart-text_bold">{film.film_name}</span>
                </div>
                <div>
                    Места: <span className="PaymentProc__standart-text_bold">{getSeats()}</span>
                </div>
                <div>
                    В зале: <span className="PaymentProc__standart-text_bold">{getHallName()}</span>
                </div>
                <div>
                    Начало сеанса: <span className="PaymentProc__standart-text_bold">{getSeanceStartTime()}</span>
                </div>
                <div>
                    Стоимость: <span className="PaymentProc__standart-text_bold">{getTotalPrice()} </span>рублей
                </div>
                <div className="PaymentProc__standart-button-container">
                    <button className="standart-button" onClick={getResultTicket}>
                        Получить код бронирования
                    </button>
                </div>
                <div className="PaymentProc__info-text">
                    После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему
                    контроллёру у входа в зал.
                </div>
                <div className="PaymentProc__info-text">Приятного просмотра!</div>
            </main>
        </>
    );
}
