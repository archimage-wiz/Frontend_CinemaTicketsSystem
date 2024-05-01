

export type HallConfigType = string[];

export type HallType = {
    id: number,
    hall_name: string,
    hall_open: number,
    hall_price_standart: number,
    hall_price_vip: number
    hall_rows: number,
    hall_config: HallConfigType[]
}