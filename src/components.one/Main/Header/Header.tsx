import "./Header.css";

export function Header() {
    return (
        <>
            <header className="header-container">
                <span className="header-title">
                    ИДЁМ<span className="header-title_letter">В</span>КИНО
                </span>
                <button className="header-button_style">ВОЙТИ</button>
            </header>
        </>
    );
}
