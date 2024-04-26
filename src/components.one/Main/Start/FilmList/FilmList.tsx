import "./FilmList.css";
import { useEffect, useState } from "react";
import { BackendAPI } from "../../../../BackendAPI/BackendAPI";
import { minutesSpellingTransform } from "../../../../components/CommonFunctions/CommonFunctions";
import { Link } from "react-router-dom";

export function FilmList(props: { date: Date }) {
    const displayDate = props.date;
    const [backend] = useState(BackendAPI.getInstance());
    const [halls, setHalls] = useState([]);
    const [films, setFilms] = useState([]);
    const [seances, setSeances] = useState([]);

    useEffect(() => {
        backend.subscribeHallsUpdate(updateHalls);
        backend.subscribeFilmsUpdate(updateFilms);
        backend.subscribeSeancesUpdate(updateSeances);
    }, []);

    function updateHalls(halls: []) {
        setHalls(halls);
    }
    function updateFilms(films: []) {
        setFilms(films);
    }
    function updateSeances(seances: []) {
        setSeances(seances);
    }

    function filmById(id: number): { film_name: string } | undefined {
        return films?.find((film: { id: number }) => film.id === id);
    }
    function hallById(id: number): { hall_name: string; hall_open: number } | undefined {
        return halls.find((h: { id: number }) => h.id === id);
    }

    type FilmDataType = {
        [key: string]: any;
    };

    function FilmsData(): FilmDataType {
        const filmData: FilmDataType = {};
        seances?.forEach((seance: { id: number; seance_hallid: number; seance_filmid: number; seance_time: string }) => {
            const film = filmById(seance.seance_filmid);
            const hall = hallById(seance.seance_hallid);
            if (!filmData[seance.seance_filmid]) {
                filmData[seance.seance_filmid] = {
                    ...film,
                    halls: {},
                };
            }
            if (hall?.hall_open === 1) {
                if (!filmData[seance.seance_filmid].halls[seance.seance_hallid]) {
                    filmData[seance.seance_filmid].halls[seance.seance_hallid] = [];
                }
                filmData[seance.seance_filmid].halls[seance.seance_hallid]?.push({
                    id: seance.id,
                    time: seance.seance_time,
                });
                filmData[seance.seance_filmid].halls[seance.seance_hallid]?.sort((a: string, b: string) =>
                    ("" + a).localeCompare(b)
                );
            }
        });
        // console.log(filmData);
        return filmData;
    }

    function pastSeance(seance: string): boolean {
        const currentTime = new Date().getTime();
        const seanceHrsMins = seance.split(":");
        const seanceTime = new Date(new Date().setHours(Number(seanceHrsMins[0]), Number(seanceHrsMins[1]))).getTime();
        return seanceTime < currentTime;
    }

    return (
        <>
            {Object.entries<FilmDataType>(FilmsData()).map(([, film]) => (
                <section key={crypto.randomUUID()} className="start-film-list__container">
                    <div className="start-film-list__container-poster-info">
                        <img src={film.film_poster} className="start-film-list__poster"></img>
                        <div className="start-film-list__container-info-descr">
                            <div className="start-film-list__film-title">{film.film_name}</div>
                            <div className="start-film-list__film-info">{film.film_description}</div>
                            <div className="start-film-list__film-duration-country">
                                {film.film_duration} {minutesSpellingTransform(film.film_duration)} {film.film_origin}
                            </div>
                        </div>
                    </div>
                    {Object.entries(film.halls as { [key: number]: [] }).map(([hallId, seances]) => (
                        <div key={crypto.randomUUID()} className="start-film-list__film-seances-container">
                            <div className="start-film-list__hall-list-hall-name">
                                {hallById(Number(hallId))?.hall_name}
                            </div>
                            <div key={crypto.randomUUID()} className="start-film-list__film-seances-time">
                                {seances.map((seance: {id: number; time: string}) =>
                                    pastSeance(seance.time) ? (
                                        <div
                                            key={crypto.randomUUID()}
                                            className="start-film-list__film-seances-time-item_past start-film-list__film-seances-time-item"
                                        >
                                            {seance.time}
                                        </div>
                                    ) : (
                                        <Link
                                            key={crypto.randomUUID()}
                                            to={`/hall/${seance.id}/${displayDate.toISOString().split("T")[0]}`}
                                            className="start-film-list__film-seances-time-item start-film-list__film-seances-time-item_avail "
                                        >
                                            {seance.time}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </section>
            ))}
        </>
    );
}
