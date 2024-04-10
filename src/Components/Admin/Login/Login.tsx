import { useRef, useState } from "react";
import "./Login.css";
import { BackendAPI } from "../../../BackendAPI";

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
            <section className="admin-popup_container admin-login_container_size">
                <div className="admin-popup_title admin-popup_title_pos">
                    <div>АВТОРИЗАЦИЯ</div>
                    <div className="admin-popup_close"></div>
                </div>

                <form onSubmit={Login} ref={loginForm} className="admin-popup_form_container">
                    <label>
                        E-mail
                        <input id="email" name="login" type="email" placeholder="Email" autoComplete="email" required />
                    </label>
                    <label>
                        Пароль
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            autoComplete="current-password"
                            required
                        />
                    </label><div className="admin-popup_buttons_container">
                    <button id="login_btn" type="submit">
                        АВТОРИЗОВАТЬСЯ
                    </button></div>
                </form>
            </section>
        </>
    );
}
