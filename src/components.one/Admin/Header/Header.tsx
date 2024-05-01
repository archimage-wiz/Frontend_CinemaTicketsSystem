import "./Header.css";

export function Header() {
    return (
        <>
            <header className="AdminHeader__container">
                <div>
                    <div className="header-title">
                        ИДЁМ<span className="header-title__letter">В</span>КИНО
                    </div>
                    <div className="AdminHeader__subtext">АДМИНИСТРАТОРРРСКАЯ</div>
                </div>
            </header>
        </>
    );
}
