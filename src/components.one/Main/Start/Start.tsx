import "./Start.css";
import { Header } from "../Header/Header";
import { DateSelector } from "./DateSelector/DateSelector";
import { useState } from "react";
import { FilmList } from "./FilmList/FilmList";

export function Start() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    function selectedDateCallBack(date: Date) {
        setSelectedDate(date);
    }

    return (
        <>
            <Header options={{ loginButton: true }} />
            <DateSelector dateSelectCallBack={selectedDateCallBack} />
            <FilmList date={selectedDate} />
        </>
    );
}
