import { useState } from "react";
import { BackendAPI } from "../../../../BackendAPI/BackendAPI.tsx";

type HallAddPopupProps = {
    closeFunc: () => void;
};

export function HallAddPopup(props: HallAddPopupProps) {
    const [backend] = useState(BackendAPI.getInstance());
    const { closeFunc } = props;

    function addHall(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        backend.addHall(data, addHallAfter);
    }
    function addHallAfter() {
        closeFunc();
    }

    return (
        <>
            <div className="Popup__container Popup__float-container">
                <header className="Popup__title">
                    <div>ДОБАВЛЕНИЕ ЗАЛА</div>
                    <div className="Popup__close-button" onClick={closeFunc}></div>
                </header>
                <form className="PopupForm__container" onSubmit={addHall}>
                    <label className="PopupForm__label">
                        Название зала
                        <input type="text" name="hallName" id="hallName" className="PopupForm__input" placeholder="Название зала" required />
                    </label>
                    <div className="Popup_buttons-container">
                        <button type="submit" className="standart-button">
                            ДОБАВИТЬ
                        </button>
                        <button onClick={closeFunc} className="cancel-button">
                            ОТМЕНИТЬ
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
