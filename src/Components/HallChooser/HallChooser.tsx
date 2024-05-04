import "./HallChooser.css";
import { useEffect, useState } from "react";
import { BackendAPI } from "../../BackendAPI/BackendAPI";
import { HallType } from "../../Types/Hall";

export function HallChooser(props: { chooseHallF: (n: number) => void }) {
    const [backend] = useState(BackendAPI.getInstance());
    const [halls, setHalls] = useState(backend.getHalls());
    const [chosenHall, setChosenHall] = useState(0);

    useEffect(() => {
        backend.subscribeHallsUpdate(updateHalls);
    }, []);
    function updateHalls(halls: HallType[]) {
        setHalls(halls);
    }

    function chooseHall(hall: number) {
        setChosenHall(hall);
        props.chooseHallF(hall);
    }

    return (
        <>
            <div className="HallChooser__hall-list">
                {halls.map((hall: { hall_name: string }, index) => (
                    <div
                        key={crypto.randomUUID()}
                        className={`HallChooser__hall-item ${
                            chosenHall === index ? "HallChooser__hall-item_selected" : ""
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
