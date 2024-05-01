import "./FilmList.css";
import { useEffect, useState } from "react";
import { BackendAPI } from "../../../../BackendAPI/BackendAPI";
import { minutesSpellingTransform } from "../../../../components/CommonFunctions/CommonFunctions";
import { Link } from "react-router-dom";
import { HallType } from "../../../../Types/Hall";
import { FilmType } from "../../../../Types/Film";
import { SeanceType } from "../../../../Types/Seance";

export function FilmList(props: { date: Date }) {
    const displayDate = props.date;
    const [backend] = useState(BackendAPI.getInstance());
    const [halls, setHalls] = useState<HallType[]>([]);
    const [films, setFilms] = useState<FilmType[]>([]);
    const [seances, setSeances] = useState<SeanceType[]>([]);

    useEffect(() => {
        backend.subscribeHallsUpdate(updateHalls);
        backend.subscribeFilmsUpdate(updateFilms);
        backend.subscribeSeancesUpdate(updateSeances);
    }, []);

    function updateHalls(halls: HallType[]) {
        setHalls(halls);
    }
    function updateFilms(films: FilmType[]) {
        setFilms(films);
    }
    function updateSeances(seances: SeanceType[]) {
        setSeances(seances);
    }

    function filmById(id: number): FilmType | undefined {
        return films?.find((film: { id: number }) => film.id === id);
    }
    function hallById(id: number): HallType | undefined {
        return halls.find((h: { id: number }) => h.id === id);
    }

    type FilmIdSeanceTimeSubType = { id: number; time: string };
    type FilmDataType = {
        [key: number]: FilmType & {
            halls: {
                [key: number]: FilmIdSeanceTimeSubType[];
            };
        };
    };

    function FilmsData(): FilmDataType {
        const filmData: FilmDataType = {};
        seances?.forEach((seance: SeanceType) => {
            const film: FilmType = filmById(seance.seance_filmid)!;
            const hall: HallType = hallById(seance.seance_hallid)!;
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
                filmData[seance.seance_filmid].halls[seance.seance_hallid]?.sort(
                    (a: FilmIdSeanceTimeSubType, b: FilmIdSeanceTimeSubType) => ("" + a.time).localeCompare(b.time)
                );
            }
        });
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
            {Object.entries(FilmsData()).map(([, film]) => (
                <section key={crypto.randomUUID()} className="FilmList__container">
                    <div className="FilmList__container-poster-info">
                        <img src={film.film_poster} className="FilmList__poster"></img>
                        <div className="FilmList__container-info-descr">
                            <div className="FilmList__film-title">{film.film_name}</div>
                            <div className="FilmList__film-info">{film.film_description}</div>
                            <div className="FilmList__film-duration-country">
                                {film.film_duration} {minutesSpellingTransform(film.film_duration)} {film.film_origin}
                            </div>
                        </div>
                    </div>
                    {Object.entries(film.halls as { [key: number]: [] }).map(([hallId, seances]) => (
                        <div key={crypto.randomUUID()} className="FilmList__film-seances-container">
                            <div className="FilmList__hall-list-hall-name">{hallById(Number(hallId))?.hall_name}</div>
                            <div key={crypto.randomUUID()} className="FilmList__film-seances-time">
                                {seances.map((seance: { id: number; time: string }) =>
                                    pastSeance(seance.time) ? (
                                        <div
                                            key={crypto.randomUUID()}
                                            className="FilmList__film-seances-time-item_past FilmList__film-seances-time-item"
                                        >
                                            {seance.time}
                                        </div>
                                    ) : (
                                        <Link
                                            key={crypto.randomUUID()}
                                            to={`/hall/${seance.id}/${displayDate.toISOString().split("T")[0]}`}
                                            className="FilmList__film-seances-time-item FilmList__film-seances-time-item_avail "
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
