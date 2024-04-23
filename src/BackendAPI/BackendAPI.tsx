const backendDomainUrl = "https://shfe-diplom.neto-server.ru";
const filmColorsArr = ["#caff85", "#85ff89", "#85ffd3", "#85e2ff", "#8599ff"];

export type chosenSeats = {
    place: number;
    row: number;
    seanceId: number;
    cost: number;
}

export class BackendAPI {
    private static instance: BackendAPI;
    private domain: string;
    public isAuth: boolean = false;
    private halls: [];
    private films: [];
    private seances: [];
    private callBacks: { [key: string]: (() => void)[] } = {};
    private chosenSeats: chosenSeats[] = [];
    private constructor() {
        this.domain = backendDomainUrl;
        this.halls = [];
        this.films = [];
        this.seances = [];
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
    public getFilms(): [] {
        return this.films;
    }
    public getSeances(): [] {
        return this.seances;
    }
    public getSeats(): chosenSeats[] {
        return this.chosenSeats;
    }

    public setUpdateF(fname: string, f: () => void) {
        if (!this.callBacks[fname]) {
            this.callBacks[fname] = [];
        }
        if (!this.callBacks[fname].includes(f)) {
            this.callBacks[fname].push(f);
        }
    }
    public manualUpdate() {
        this.callBacks?.["halls"]?.forEach((f) => f());
        this.callBacks?.["films"]?.forEach((f) => f());
        this.callBacks?.["seances"]?.forEach((f) => f());
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
        this.films = jsonData.result.films;
        this.films.map((film: { color: string }) => {
            film["color"] = filmColorsArr[Math.floor(Math.random() * filmColorsArr.length)];
        });
        this.seances = jsonData.result.seances;
        this.manualUpdate();
        console.log(jsonData.result);
    }

    getHallConfig(seanceId: number, date: string) {
        return fetch(this.domain + "/hallconfig?" + `seanceId=${seanceId}&date=${date}`).then((response) =>
            response.json()
        );
    }

    setChosenSeats(seats: { place: number; row: number; seanceId: number; cost: number }[]) {
        this.chosenSeats = seats;
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
            alert(res.statusText);
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
    public async deleteHall(id: number): Promise<void> {
        if (!this.isAuth) return;
        const res = await fetch(this.domain + "/hall/" + id, {
            method: "DELETE",
        });
        if (!res.ok) {
            alert(res.statusText);
            return;
        }
        // console.log(res);
        const jsonData = await res.json();
        // console.log(jsonData);
        if (jsonData.success === true) {
            this.refreshAllData();
        } else {
            alert("Error: " + jsonData.error);
        }
    }
}
