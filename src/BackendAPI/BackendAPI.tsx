import { chosenSeats } from "../Types/ChosenSeats";
import { FilmType } from "../Types/Film";
import { HallConfigType, HallType } from "../Types/Hall";
import { SeanceType } from "../Types/Seance";

const backendDomainUrl = "https://shfe-diplom.neto-server.ru";
const filmColorsArr = ["#caff85", "#85ff89", "#85ffd3", "#85e2ff", "#8599ff"];

export class BackendAPI {
    private static instance: BackendAPI;
    private domain: string;
    public isAuth: boolean = false;
    private halls: HallType[] = [];
    private films: FilmType[] = [];
    private seances: SeanceType[] = [];
    private onUpdateHalls: ((halls: HallType[]) => void)[] = [];
    private onUpdateFilms: ((films: FilmType[]) => void)[] = [];
    private onUpdateSeances: ((seances: SeanceType[]) => void)[] = [];
    private chosenSeats: chosenSeats[] = [];
    private constructor() {
        this.domain = backendDomainUrl;
        if (localStorage.getItem("isAuth") === "true") {
            this.isAuth = true;
        }
        this.refreshAllData();
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
    public getSeats(): chosenSeats[] {
        return this.chosenSeats;
    }
    public getHalls(): HallType[] {
        return this.halls;
    }
    public getFilms(): FilmType[] {
        return this.films;
    }
    public getSeances(): SeanceType[] {
        return this.seances;
    }

    public subscribeHallsUpdate(f: (halls: HallType[]) => void) {
        if (!this.onUpdateHalls.includes(f)) {
            this.onUpdateHalls.push(f);
        }
        f(this.halls);
    }
    public unsubscribeHallsUpdate(f: (halls: HallType[]) => void) {
        this.onUpdateHalls = this.onUpdateHalls.filter((item) => item !== f);
    }
    public subscribeFilmsUpdate(f: (films: FilmType[]) => void) {
        if (!this.onUpdateFilms.includes(f)) {
            this.onUpdateFilms.push(f);
        }
        f(this.films);
    }
    public unsubscribeFilmsUpdate(f: (films: FilmType[]) => void) {
        this.onUpdateFilms = this.onUpdateFilms.filter((item) => item !== f);
    }
    public subscribeSeancesUpdate(f: (seances: SeanceType[]) => void) {
        if (!this.onUpdateSeances.includes(f)) {
            this.onUpdateSeances.push(f);
        }
        f(this.seances);
    }
    public unsubscribeSeancesUpdate(f: (seances: []) => void) {
        this.onUpdateSeances = this.onUpdateSeances.filter((item) => item !== f);
    }

    public globalUpdate() {
        this.onUpdateHalls.forEach((f) => f(this.halls));
        this.onUpdateFilms.forEach((f) => f(this.films));
        this.onUpdateSeances.forEach((f) => f(this.seances));
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
        this.films.map((film: FilmType) => {
            film["color"] = filmColorsArr[Math.floor(Math.random() * filmColorsArr.length)];
        });
        this.seances = jsonData.result.seances;
        this.globalUpdate();
        // console.log(jsonData.result);
    }
    async getHallConfig(seanceId: number, date: string) {
        return fetch(this.domain + "/hallconfig?" + `seanceId=${seanceId}&date=${date}`).then((response) =>
            response.json()
        );
    }
    setChosenSeats(seats: { place: number; row: number; seanceId: number; cost: number }[]) {
        this.chosenSeats = seats;
    }
    public async buyTickets(seanceId: number, tickets: chosenSeats[], date: string) {
        const newTickets = tickets.map((ticket) => {
            return {
                place: ticket.place + 1,
                row: ticket.row + 1,
                coast: ticket.cost,
            };
        });
        const params = new FormData();
        params.set("seanceId", String(seanceId));
        params.set("ticketDate", date);
        params.set("tickets", JSON.stringify(newTickets));
        return fetch(this.domain + "/ticket", {
            method: "POST",
            body: params,
        }).then((response) => response.json());
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
    public async addFilm(data: FormData, onLoadCallBack: () => void): Promise<void> {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", this.domain + "/film", true);
        xhr.responseType = "json";
        xhr.onload = () => {
            onLoadCallBack();
            this.refreshAllData();
        };
        xhr.upload.onerror = function () {
            alert(`Произошла ошибка во время отправки: ${xhr.status}`);
        };
        xhr.onprogress = function (event) {
            console.log(`Загружено ${event.loaded} из ${event.total}`);
        };
        xhr.send(data);
    }
    public async addSeance(data: FormData, onLoadCallBack: () => void): Promise<void> {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", this.domain + "/seance", true);
        xhr.responseType = "json";
        xhr.onload = () => {
            onLoadCallBack();
            this.refreshAllData();
        };
        xhr.upload.onerror = function () {
            alert(`Произошла ошибка во время отправки: ${xhr.status}`);
        };
        xhr.send(data);
    }
    public async deleteHall(hallId: number): Promise<void> {
        if (!this.isAuth) return;
        const res = await fetch(this.domain + "/hall/" + hallId, {
            method: "DELETE",
        });
        if (!res.ok) {
            alert(res.statusText);
            return;
        }
        const jsonData = await res.json();
        if (jsonData.success === true) {
            this.refreshAllData();
        } else {
            alert("Error: " + jsonData.error);
        }
    }
    public async deleteSeance(seanceId: number): Promise<void> {
        if (!this.isAuth) return;
        const res = await fetch(this.domain + "/seance/" + seanceId, {
            method: "DELETE",
        });
        if (!res.ok) {
            alert(res.statusText);
            return;
        }
        const jsonData = await res.json();
        if (jsonData.success === true) {
            this.refreshAllData();
        } else {
            alert("Error: " + jsonData.error);
        }
    }
    public async saveHallConfig(
        hallId: number,
        rowCount: number,
        placeCount: number,
        hallConfig: HallConfigType[]
    ): Promise<void> {
        const params = new FormData();
        params.set("rowCount", String(rowCount));
        params.set("placeCount", String(placeCount));
        params.set("config", JSON.stringify(hallConfig));
        const res = await fetch(this.domain + "/hall/" + hallId, {
            method: "POST",
            body: params,
        });
        if (!res.ok) {
            alert(res.statusText);
            return;
        }
        return await res.json();
    }
    public async saveSeatsPrice(hallId: number, priceStandart: number, priceVip: number): Promise<void> {
        const params = new FormData();
        params.set("priceStandart", String(priceStandart));
        params.set("priceVip", String(priceVip));
        const res = await fetch(this.domain + "/price/" + hallId, {
            method: "POST",
            body: params,
        });
        if (!res.ok) {
            alert(res.statusText);
            return;
        }
        const jsonData = await res.json();
        if (jsonData.success === true) {
            return await new Promise((resolve) => {
                this.halls = this.halls.map((hall) => (hall.id === hallId ? jsonData.result : hall));
                resolve(jsonData.result);
            });
        } else {
            alert("Error: " + jsonData.error);
        }
    }
    public async openCloseHall(hallId: number, status: number): Promise<void> {
        if (!this.isAuth) return;
        const params = new FormData();
        params.set("hallOpen", String(status));
        const res = await fetch(this.domain + "/open/" + hallId, {
            method: "POST",
            body: params,
        });
        if (!res.ok) {
            alert(res.statusText);
            return;
        }
        const jsonData = await res.json();
        if (jsonData.success === true) {
            this.refreshAllData();
        } else {
            alert("Error: " + jsonData.error);
        }
    }
}
