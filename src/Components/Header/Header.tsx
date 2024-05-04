import { useNavigate } from "react-router-dom";
import "../../css/Buttons.css";
import "./Header.css";

type HeaderProps = {
    options: {
        loginButton: boolean
    }
}

export function Header(props: HeaderProps) {
    const navigate = useNavigate();
    const { loginButton } = props.options;

    function navToAdmin() {
        navigate("/admin");
    }

    return (
        <>
            <header className="MainHeader__container">
                <span className="header-title">
                    ИДЁМ<span className="header-title__letter">В</span>КИНО
                </span>
                {loginButton && <button className="standart-button" onClick={navToAdmin}>ВОЙТИ</button>}
            </header>
        </>
    );
}
