import { useState } from "react";
import { BackendAPI} from "../../../../BackendAPI/BackendAPI.tsx";

type HallAddPopupProps = {
    closeFunc: () => void;
};

export function HallAddPopup(props: HallAddPopupProps) {

    const [backend] = useState(BackendAPI.getInstance());
    const { closeFunc } = props;

    function addHall(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        backend.addHall(data, addHallAfter);
    }
    function addHallAfter() {
        closeFunc();
    }

    return (
        <>
            <div className="admin-popup_container admin-popup_float_container">
                <header className="admin-popup_title">
                    <div>ДОБАВЛЕНИЕ ЗАЛА</div>
                    <div className="admin-popup_close" onClick={closeFunc}></div>
                </header>
                <form className="admin-popup_form_container" onSubmit={addHall}>
                    <label>Название зала
                    <input type="text" name="hallName" id="hallName" placeholder="Название зала" required/>
                    </label>
                    <div className="admin-popup_buttons_container">
                        <button type="submit" >ДОБАВИТЬ</button>
                        <button onClick={closeFunc}>ОТМЕНИТЬ</button>
                    </div>
                </form>
            </div>
        </>
    );
}
