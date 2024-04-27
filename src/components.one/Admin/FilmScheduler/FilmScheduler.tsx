import "./FilmScheduler.css";
import { useEffect, useState } from "react";
import { BackendAPI } from "../../../BackendAPI/BackendAPI";
import { minutesSpellingTransform } from "../../../components/CommonFunctions/CommonFunctions";
import { FilmAddPopup } from "./FilmAddPopup/FilmAddPopup";

export function FilmScheduler() {
    const backend = BackendAPI.getInstance();
    const [halls, setHalls] = useState(backend.getHalls());
    const [films, setFilms] = useState(backend.getFilms());
    const [seances, setSeances] = useState(backend.getSeances());
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        getHalls();
        getFilms();
        getSeances();
    }, []);
    const getHalls = () => (backend.getHalls().length > 0 ? setHalls(backend.getHalls()) : setTimeout(getHalls, 500));
    const getFilms = () => (backend.getFilms().length > 0 ? setFilms(backend.getFilms()) : setTimeout(getFilms, 500));
    const getSeances = () =>
        backend.getSeances().length > 0 ? setSeances(backend.getSeances()) : setTimeout(getSeances, 500);

    function filmById(id: number): { film_name: string; color: string } | undefined {
        return films.find((film: { id: number }) => film.id === id);
    }

    function toggleAddPopup() {
        setShowAdd(!showAdd);
    }

    return (
        <>
            <div className="admin-hall_container">
                <header className="admin-hall_title admin-hall_title_linedecorator_both">
                    <div>СЕТКА СЕАНСОВ</div>
                    <div className="admin-hall_title_close"></div>
                </header>
                <section className="admin-hall_container_body admin-hall_container_body_linedecorator">
                    <input type="submit" value="Добавить фильм" className="standart-button" onClick={toggleAddPopup} />

                    <div className="film-seances__film-chooser_container">
                        {films.map(
                            (film: {
                                film_name: string;
                                color: string;
                                film_poster: string;
                                film_duration: string;
                            }) => (
                                <div
                                    key={crypto.randomUUID()}
                                    className="film-seances__film-chooser-item"
                                    style={{ backgroundColor: film.color }}
                                >
                                    <img src={film.film_poster} className="film-seances__film-chooser-poster"></img>
                                    <div className="film-seances__film-chooser-info">
                                        <div className="film-seances__film-chooser-title">{film.film_name}</div>
                                        <div className="film-seances__film-chooser-duration">
                                            {film.film_duration} {minutesSpellingTransform(Number(film.film_duration))}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <div className="film-seances__seance-scheduler_container">
                        {halls.map((hall: { id: number; hall_name: string }) => (
                            <div key={crypto.randomUUID()} className="film-seances__hall-item_container">
                                <div className="film-seances__seance-scheduler-title">{hall.hall_name}</div>
                                <div className="film-seances__seance-scheduler-seances">
                                    {seances.map(
                                        (seance: {
                                            seance_hallid: number;
                                            seance_filmid: number;
                                            seance_time: string;
                                        }) =>
                                            seance.seance_hallid === hall.id ? (
                                                <div
                                                    key={crypto.randomUUID()}
                                                    className="film-seances__seance-scheduler-seance"
                                                    style={{
                                                        backgroundColor: filmById(seance.seance_filmid)?.color,
                                                    }}
                                                >
                                                    <div>{filmById(seance.seance_filmid)?.film_name}</div>
                                                    <div className="film-seances__seance-scheduler-time">
                                                        {seance.seance_time}
                                                    </div>
                                                </div>
                                            ) : null
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="FilmScheduler__buttons-container">
                        <input type="button" value="Отмена" className="cancel-button" />
                        <input type="submit" value="Сохранить" className="standart-button" />
                    </div>
                </section>
            </div>
            {showAdd ? <FilmAddPopup closeFunc={toggleAddPopup} /> : null}
        </>
    );
}
