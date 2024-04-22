import "../../../css/Buttons.css";
import "./Header.css";

type HeaderProps = {
    options: {
        loginButton: boolean
    }
}

export function Header(props: HeaderProps) {
    const { loginButton } = props.options;
    

    return (
        <>
            <header className="header-container">
                <span className="header-title">
                    ИДЁМ<span className="header-title__letter">В</span>КИНО
                </span>
                {loginButton && <button className="standart-button">ВОЙТИ</button>}
            </header>
        </>
    );
}
