import "../../../../css/PopUp.css";
import "./FilmAddPopup.css";
import { useRef, useState } from "react";
import { BackendAPI } from "../../../../BackendAPI/BackendAPI.tsx";

type FilmAddPopupProps = {
    closeFunc: () => void;
};

export function FilmAddPopup(props: FilmAddPopupProps) {
    const backend = BackendAPI.getInstance();
    const { closeFunc } = props;
    const file = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");


    function addFile() {
        file?.current?.click();
    }
    function fileHandler() {
        if (file && file.current && file.current.files && file.current.files[0] && file.current.files[0].name) {
            setFileName(() => String(file?.current?.files?.[0].name));
        }
    }

    function addFilm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        backend.addFilm(data, sendDone);
    }

    function sendDone() {
        closeFunc();
    }

    return (
        <>
            <div className="Popup__container Popup__float-container">
                <header className="Popup__title">
                    <div>ДОБАВЛЕНИЕ ФИЛЬМА</div>
                    <div className="Popup__close-button" onClick={closeFunc}></div>
                </header>
                <form className="PopupForm__container" onSubmit={addFilm}>
                    <label className="PopupForm__label">
                        Название фильма
                        <input
                            type="text"
                            className="PopupForm__input"
                            name="filmName"
                            id="hallName"
                            placeholder="Название фильма"
                            required
                        />
                    </label>
                    <label className="PopupForm__label">
                        Продолжительность фильма (мин.)
                        <input
                            type="number"
                            className="PopupForm__input"
                            name="filmDuration"
                            id="hallName"
                            placeholder="Продолжительность фильма (мин.)"
                            required
                        />
                    </label>
                    <label className="PopupForm__label">
                        Описание фильма
                        <textarea
                            placeholder="Описание фильма"
                            name="filmDescription"
                            className="Popup__textarea"
                            required
                        ></textarea>
                    </label>
                    <label className="PopupForm__label">
                        Страна
                        <input
                            type="text"
                            className="PopupForm__input"
                            name="filmOrigin"
                            id="hallName"
                            placeholder="Страна"
                            required
                        />
                    </label>
                    <label className="PopupForm__label">
                        {fileName}
                        <input
                            type="file"
                            ref={file}
                            name="filePoster"
                            hidden
                            className="PopupForm__input"
                            required
                            onChange={fileHandler}
                            accept="image/png"
                        />
                    </label>
                    <div className="Popup_buttons-container">
                        <input type="submit" className="standart-button" value="добавить" />
                        <input type="button" value="Загрузить постер" className="standart-button" onClick={addFile} />
                        <input type="button" className="cancel-button" onClick={closeFunc} value="отменить" />
                    </div>
                </form>
            </div>
        </>
    );
}
