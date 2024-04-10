
const backendDomainUrl = "https://shfe-diplom.neto-server.ru";

export class BackendAPI {
    private static instance: BackendAPI;
    private domain: string;
    public isAuth: boolean = false;
    private constructor() {
        this.domain = backendDomainUrl;
        if (localStorage.getItem("isAuth") === "true") {
            this.isAuth = true;
        }
        console.log("BackendAPI created");
    }

    public static getInstance(): BackendAPI {
        if (!BackendAPI.instance) {
            BackendAPI.instance = new BackendAPI();
        }
        return BackendAPI.instance;
    }

    public getDomain(): string {
        return this.domain;
    }

    public async authentication(data: FormData, changeStateF: (state: boolean) => void): Promise<void> {
        const res = await fetch(this.domain + "/login", {
            method: "POST",
            body: data,
        });
        if (res.ok) {
            const jsonData = await res.json();
            if (jsonData.success === true) {
                this.isAuth = true;
                localStorage.setItem("isAuth", "true");
                changeStateF(true);
            } else {
                alert(jsonData.error);
                window.location.reload();
            }
        } else {
            alert("Ошибка HTTP: " + res.status);
            window.location.reload();
        }
    }

}
