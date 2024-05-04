import "./Login.css";
import { BackendAPI } from "../../../BackendAPI/BackendAPI.tsx";
import { useRef, useState } from "react";

type LoginProps = {
    setAuth: (data: boolean) => void;
};

export function Login(props: LoginProps) {
    const [backend] = useState(BackendAPI.getInstance());
    const loginForm = useRef<HTMLFormElement>(null);
    const { setAuth } = props;

    function Login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        loginForm.current?.["login_btn"].setAttribute("style", "display:none;");
        if (loginForm.current) {
            const data = new FormData(loginForm.current);
            backend.authentication(data, setAuth);
        }
    }

    return (
        <>
            <section className="Popup__container AdminLogin__container_size">
                <div className="Popup__title AdminLogin__title_position">
                    <div>АВТОРИЗАЦИЯ</div>
                </div>

                <form onSubmit={Login} ref={loginForm} className="PopupForm__container">
                    <label className="PopupForm__label">
                        E-mail
                        <input
                            className="PopupForm__input"
                            id="email"
                            name="login"
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            required
                        />
                    </label>
                    <label className="PopupForm__label">
                        Пароль
                        <input
                            className="PopupForm__input"
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            autoComplete="current-password"
                            required
                        />
                    </label>
                    <div className="Popup_buttons-container">
                        <button id="login_btn" type="submit" className="standart-button">
                            АВТОРИЗОВАТЬСЯ
                        </button>
                    </div>
                </form>
            </section>
            <section className="PopupForm__container">
                <div style={{ color: 'white' }}>
                    <div>Логин - shfe-diplom@netology.ru</div>
                    <div>Пароль - shfe-diplom</div>
                </div>
            </section>
        </>
    );
}
