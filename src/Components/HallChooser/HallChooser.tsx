import "./HallChooser.css";
import { useEffect, useState } from "react";
import { BackendAPI } from "../../BackendAPI/BackendAPI";

export function HallChooser(props: { chooseHallF: (n: number) => void }) {
    const [backend] = useState(BackendAPI.getInstance());
    const [halls, setHalls] = useState(backend.getHalls());
    const [chosenHall, setChosenHall] = useState(0);

    useEffect(() => {
        backend.setUpdateF("halls", updateHalls);
    }, []);
    function updateHalls() {
        setHalls(backend.getHalls());
    }

    function chooseHall(hall: number) {
        setChosenHall(hall);
        props.chooseHallF(hall);
    }

    return (
        <>
            <div className="hall-chooser__hall-list">
                {halls.map((hall: { hall_name: string }, index) => (
                    <div
                        key={crypto.randomUUID()}
                        className={`hall-chooser__hall-item ${
                            chosenHall === index ? "hall-chooser__hall-item_selected" : ""
                        }`}
                        onClick={() => chooseHall(index)}
                    >
                        {hall.hall_name}
                    </div>
                ))}
            </div>
        </>
    );
}
