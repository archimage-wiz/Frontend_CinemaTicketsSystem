import "./DateSelector.css";
import { useState } from "react";

export function DateSelector(props: { dateSelectCallBack: (d: Date) => void }) {
    const [startDate, setStartDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showNextDateButton, setShowNextDateButton] = useState(true);

    function getDayOfWeek(plusDay: number) {
        const daysName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + plusDay);
        return { day: daysName[currentDate.getDay()], date: currentDate };
    }

    function increaseDate() {
        if ((startDate.getTime() - new Date().getTime()) / 86400000 >= 6) {
            setShowNextDateButton(false);
            return;
        }
        startDate.setDate(startDate.getDate() + 1);
        setStartDate(new Date(startDate));
    }

    function updateSelectedDate(date: Date) {
        setSelectedDate(date);
        props.dateSelectCallBack(date);
    }

    return (
        <>
            <nav className="DateSelector__date-nav-container">
                {[0, 1, 2, 3, 4, 5].map((item) => (
                    <div
                        className={
                            "DateSelector__date-nav-element-container " +
                            (selectedDate.getDate() === getDayOfWeek(item).date.getDate()
                                ? "DateSelector__date-nav-element-container_selected "
                                : "") +
                            (getDayOfWeek(item).day === "Сб" || getDayOfWeek(item).day === "Вс"
                                ? "DateSelector__date-nav-element-container_red "
                                : "")
                        }
                        key={item}
                        onClick={() => updateSelectedDate(getDayOfWeek(item).date)}
                    >
                        <div
                            className={
                                selectedDate.getDate() === getDayOfWeek(item).date.getDate()
                                    ? "DateSelector__date-nav-element-text_selected"
                                    : "DateSelector__date-nav-element-text "
                            }
                        >
                            {getDayOfWeek(item).date.getDate() === new Date().getDate() ? (
                                <>Сегодня</>
                            ) : (
                                <>{getDayOfWeek(item).day},</>
                            )}
                        </div>
                        <div
                            className={
                                selectedDate.getDate() === getDayOfWeek(item).date.getDate()
                                    ? "DateSelector__date-nav-element-text_selected "
                                    : "DateSelector__date-nav-element-text "
                            }
                        >
                            {getDayOfWeek(item).date.getDate() === new Date().getDate() ? (
                                <>
                                    {getDayOfWeek(item).day}, {getDayOfWeek(item).date.getDate()}
                                </>
                            ) : (
                                <>{getDayOfWeek(item).date.getDate()}</>
                            )}
                        </div>
                    </div>
                ))}
                {showNextDateButton ? (
                    <div className="DateSelector__date-nav-element-container">
                        <div
                            className="DateSelector__date-nav-element-text-scroll-arrow"
                            onClick={increaseDate}
                        >
                            {">"}
                        </div>
                    </div>
                ) : null}
            </nav>
        </>
    );
}
