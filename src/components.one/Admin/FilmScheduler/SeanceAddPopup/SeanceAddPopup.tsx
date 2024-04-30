import "./SeanceAddPopup.css";
import { useEffect, useRef, useState } from "react";
import { BackendAPI } from "../../../../BackendAPI/BackendAPI.tsx";

type SeanceAddPopupProps = {
    filmId: number,
    hallId: number,
    closeFunc: () => void;
};

export function SeanceAddPopup(props: SeanceAddPopupProps) {
    const backend = BackendAPI.getInstance();
    const { filmId, hallId, closeFunc } = props;
    const [halls, setHalls] = useState(backend.getHalls());
    const [films, setFilms] = useState(backend.getFilms());
    const [seances, setSeances] = useState(backend.getSeances());
    const [film, setFilm] = useState(filmById(filmId));
    const [hall, setHall] = useState(hallById(hallId));
    const [filmName, setFilmName] = useState(film?.film_name);
    const [hallName, setHallName] = useState(hall?.hall_name);


    const getHalls = () => (backend.getHalls().length > 0 ? setHalls(backend.getHalls()) : setTimeout(getHalls, 500));
    const getFilms = () => (backend.getFilms().length > 0 ? setFilms(backend.getFilms()) : setTimeout(getFilms, 500));
    const getSeances = () =>
        backend.getSeances().length > 0 ? setSeances(backend.getSeances()) : setTimeout(getSeances, 500);
    const getFilm = () => films.length > 0 ? setFilm(filmById(filmId)) : setTimeout(getFilm, 500);
    const getHall = () => halls.length > 0 ? setHall(hallById(hallId)) : setTimeout(getHall, 500);

    useEffect(() => {
        getHalls();
        getFilms();
        getSeances();
        getFilm();
        getHall();
    }, []);

    function filmById(id: number): { film_name: string; color: string } | undefined {
        return films.find((film: { id: number }) => film.id === id);
    }
    function hallById(id: number): { hall_name: string; color: string } | undefined {
        return halls.find((hall: { id: number }) => hall.id === id);
    }

    function addSeance(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        data.set("seanceFilmid", film?.id)
        data.set("seanceHallid", hall?.id)
        backend.addSeance(data, sendDone);
    }

    function sendDone() {
        closeFunc();
    }

    return (
        <>
            <div className="admin-popup_container admin-popup_float_container">
                <header className="admin-popup_title">
                    <div>ДОБАВЛЕНИЕ сеанса</div>
                    <div className="admin-popup_close" onClick={closeFunc}></div>
                </header>
                <form className="PopupForm__container" onSubmit={addSeance}>
                    <label className="PopupForm__label">
                        Название фильма
                        <input
                            type="text"
                            className="PopupForm__input"
                            name="seanceFilmid"
                            placeholder="Название фильма"
                            required
                            readOnly
                            value={filmName}
                            onChange={()=> setFilmName(film?.film_name)}
                        />
                    </label>
                    <label className="PopupForm__label">
                        Название зала
                        <input
                            type="text"
                            className="PopupForm__input"
                            name="seanceHallid"
                            placeholder="Название зала"
                            required
                            value={hallName}
                            onChange={()=>setHallName(hall?.hall_name)}
                        />
                    </label>
                    <label className="PopupForm__label">
                        Время начала
                        <input
                            type="time"
                            className="PopupForm__input"
                            name="seanceTime"
                            placeholder="Время начала"
                            required
                            // value={hallName}
                            // onChange={()=>setHallName(hall?.hall_name)}
                        />
                    </label>

                    <div className="Popup_buttons-container">
                        <input type="submit" className="standart-button" value="добавить" />
                        <input type="button" className="cancel-button" onClick={closeFunc} value="отменить" />
                    </div>
                </form>
            </div>
        </>
    );
}
