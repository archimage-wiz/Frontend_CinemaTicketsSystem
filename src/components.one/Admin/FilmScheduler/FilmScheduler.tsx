import "./FilmScheduler.css";
import { useEffect, useState } from "react";
import { BackendAPI } from "../../../BackendAPI/BackendAPI";
import { minutesSpellingTransform } from "../../../components/CommonFunctions/CommonFunctions";
import { FilmAddPopup } from "./FilmAddPopup/FilmAddPopup";
import { SeanceAddPopup } from "./SeanceAddPopup/SeanceAddPopup";

export function FilmScheduler() {
    const backend = BackendAPI.getInstance();
    const [halls, setHalls] = useState(backend.getHalls());
    const [films, setFilms] = useState(backend.getFilms());
    const [seances, setSeances] = useState(backend.getSeances());
    const [showAdd, setShowAdd] = useState(false);
    const [showAddSeance, setShowAddSeance] = useState(false);
    const [chosenFilmID, setChosenFilmID] = useState(0);
    const [chosenHallId, setChosenHallId] = useState(0);
    const [trashBinVisible, setTrashBinVisible] = useState(true);

    useEffect(() => {
        backend.subscribeHallsUpdate(updateHalls);
        backend.subscribeFilmsUpdate(updateFilms);
        backend.subscribeSeancesUpdate(updateSeances);
        return () => {
            backend.unsubscribeHallsUpdate(updateHalls);
            backend.unsubscribeFilmsUpdate(updateFilms);
            backend.unsubscribeSeancesUpdate(updateSeances);
        };
    }, [backend]);
    function updateHalls(hallsData: []) {
        setHalls(() => hallsData);
    }
    function updateFilms(filmsData: []) {
        setFilms(() => filmsData);
    }
    function updateSeances(seancesData: []) {
        setSeances(() => seancesData);
    }

    function filmById(id: number): { film_name: string; color: string } | undefined {
        return films.find((film: { id: number }) => film.id === id);
    }
    function toggleAddPopup() {
        setShowAdd(!showAdd);
    }
    function toggleSeanceAddPopup() {
        setShowAddSeance(!showAddSeance);
    }
    function addSeance(hallId: number, filmId: number) {
        setChosenHallId(hallId);
        setChosenFilmID(filmId);
        toggleSeanceAddPopup();
    }

    function startDragging(event: React.DragEvent<HTMLDivElement>, filmId: number) {
        event.dataTransfer.setData("text/plain", "f" + String(filmId));
    }
    function startDraggingSeance(event: React.DragEvent<HTMLDivElement>, seanceId: number) {
        event.dataTransfer.setData("text/plain", "s" + String(seanceId));
        setTrashBinVisible(true);
    }
    function onDropHandler(event: React.DragEvent<HTMLDivElement>, hallId: number) {
        let filmId = event.dataTransfer.getData("text/plain");
        if (filmId[0] === "f") {
            filmId = filmId.slice(1);
            addSeance(hallId, Number(filmId));
        }
    }
    function onDropHandlerSeances(event: React.DragEvent<HTMLDivElement>) {
        let seanceId = event.dataTransfer.getData("text/plain");
        if (seanceId[0] === "s") {
            seanceId = seanceId.slice(1);
            backend.deleteSeance(Number(seanceId));
        }
    }

    function onDragHandler(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }
    function getTrashBinClasses() {
        return trashBinVisible
            ? "FilmScheduler__seance-del-bin"
            : "FilmScheduler__seance-del-bin FilmScheduler__seance-del-bin_hide";
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
                                id: number;
                                film_name: string;
                                color: string;
                                film_poster: string;
                                film_duration: string;
                            }) => (
                                <div
                                    key={crypto.randomUUID()}
                                    className="film-seances__film-chooser-item"
                                    style={{ backgroundColor: film.color }}
                                    draggable="true"
                                    onDragStart={(e) => startDragging(e, film.id)}
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
                            <div key={crypto.randomUUID()} className="FilmScheduler__hall-seances-container">
                                <div
                                    className={getTrashBinClasses()}
                                    onDrop={(e) => onDropHandlerSeances(e)}
                                    onDragOver={onDragHandler}
                                ></div>
                                <div className="film-seances__hall-item_container">
                                    <div className="film-seances__seance-scheduler-title">{hall.hall_name}</div>
                                    <div
                                        className="film-seances__seance-scheduler-seances"
                                        onDrop={(e) => onDropHandler(e, hall.id)}
                                        onDragOver={onDragHandler}
                                    >
                                        {seances
                                            .sort((a: { seance_time: string }, b: { seance_time: string }) => {
                                                return a.seance_time.localeCompare("" + b.seance_time);
                                            })
                                            .map(
                                                (seance: {
                                                    id: number;
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
                                                            draggable="true"
                                                            onDragStart={(e) => startDraggingSeance(e, seance.id)}
                                                        >
                                                            <div className="FilmScheduler__seances-film-title">
                                                                {filmById(seance.seance_filmid)?.film_name}
                                                            </div>
                                                            <div className="film-seances__seance-scheduler-time">
                                                                {seance.seance_time}
                                                            </div>
                                                        </div>
                                                    ) : null
                                            )}
                                    </div>
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
            {showAddSeance ? (
                <SeanceAddPopup closeFunc={toggleSeanceAddPopup} filmId={chosenFilmID} hallId={chosenHallId} />
            ) : null}
        </>
    );
}
