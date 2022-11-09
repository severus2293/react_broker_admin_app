export interface Ibroker{
  id: number;
    name: string;
  money: number;
}

export interface Istockinfo{
    id: number,
    designation: string,
    title: string,
    data: {Date: string, Open: string}[]
}

export interface Istockdata{
    id: number,
    count: number,
    participation: boolean
}
export interface Istock{
    data: Istockdata,
    info: Istockinfo
}
export interface Isetting{
  start: string;
  end: string;
    speed: number
}
