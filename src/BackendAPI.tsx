const backendDomainUrl = "https://shfe-diplom.neto-server.ru";

export class BackendAPI {
    private static instance: BackendAPI;
    private domain: string;
    public isAuth: boolean = false;
    private halls: [];
    private callBacks: { [key: string]: (() => void)[] } = {};
    private constructor() {
        this.domain = backendDomainUrl;
        this.halls = [];
        this.callBacks = {};
        if (localStorage.getItem("isAuth") === "true") {
            this.isAuth = true;
        }
        this.refreshAllData();
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
    public getHalls(): [] {
        return this.halls;
    }

    public setUpdateF(fname: string, f: () => void) {
        if (!this.callBacks[fname]) {this.callBacks[fname] = []}
        if(!(this.callBacks[fname]).includes(f)) {(this.callBacks[fname]).push(f)}
    }

    private alertErrorReload(err: string) {
        alert(err);
        window.location.reload();
    }

    private async refreshAllData() {
        const res = await fetch(this.domain + "/alldata");
        if (!res.ok) {
            return;
        }
        const jsonData = await res.json();
        if (jsonData.success !== true) {
            return;
        }
        this.halls = jsonData.result.halls;
        (this.callBacks?.["halls"])?.forEach(f => f());
        console.log(jsonData.result);
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
                this.alertErrorReload(jsonData.error);
            }
        } else {
            this.alertErrorReload(res.statusText);
        }
    }

    public async addHall(data: FormData, callBackF: () => void): Promise<void> {
        if (!this.isAuth) return;
        const res = await fetch(this.domain + "/hall", {
            method: "POST",
            body: data,
        });
        if (!res.ok) {
            alert(res.ok);
            return;
        }
        const jsonData = await res.json();
        if (jsonData.success === true) {
            this.refreshAllData();
            callBackF();
        } else {
            alert("Error: " + jsonData.error);
        }
    }
}
