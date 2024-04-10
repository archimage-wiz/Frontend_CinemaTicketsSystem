export function HallAddPopup() {
    return (
        <>
            <div className="admin-popup_container admin-popup_float_container">
                <header className="admin-popup_title">
                    <div>ДОБАВЛЕНИЕ ЗАЛА</div>
                    <div className="admin-popup_close"></div>
                </header>
                <section className="admin-popup_form_container">
                    <input type="text" placeholder="Название зала" />
                    <div className="admin-popup_buttons_container">
                        <button>ДОБАВИТЬ</button>
                        <button>ОТМЕНИТЬ</button>
                    </div>
                </section>
            </div>
        </>
    );
}
