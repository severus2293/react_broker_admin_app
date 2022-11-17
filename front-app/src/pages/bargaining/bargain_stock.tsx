import React, {ChangeEvent, useEffect, useState} from "react";
import {Isetting, Istock} from "../../Models";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Chart,Line } from 'react-chartjs-2'
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
interface StockProps{
    stock: Istock,
    startdate: string,
    enddate: string,
    id: number,
    socket: any
}

export function BargainStock(props: StockProps){

    const [indexdate,setindexdate] = useState(-1)
    const [date_array,setdatearray] = useState<string[]>([])
    const [price_array,setpricearray] = useState<string[]>([])
    const [stock,setStock] = useState<Istock>()
    const [cur_date,setCurdate] = useState(props.enddate)
    const [countvalue,setCountValue] = useState(0)
    const [countbuyvalue,setcountbuy] = useState(0)
    const dispatch = useDispatch()
    const changebuycountHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setcountbuy(parseInt(event.target.value))
        dispatch({type: "CHANGE_COUNT",index: props.id,val: countbuyvalue})

    }
    useEffect(() => {
        fetch('http://localhost:3000/stocks/stocks_bargaining')
            .then(response => response.json())
            .then(json =>{
                for(let stock of json){
                    if(stock.data.id === props.stock.data.id){
                        setCountValue(stock.data.count)
                        break
                    }
                }
            })
        props.socket.on('BargainStocks', (message) => {
            for(let stock of message){
                if(stock.data.id === props.stock.data.id){
                    setCountValue(stock.data.count)
                    break
                }
            }
        })
        setCurdate(props.enddate)
        renderInfArr(props.startdate)
        props.socket.on('ChangeTime', (message) => {
            var dat = message.date
            if(dat >= cur_date){ //!==
                renderInfArr(dat)
            }
        })},[])
    function renderInfArr(date){
        const datearr: string[] = []
        const pricearr: string[] = []
        var start = props.startdate
        const end = date
        console.log('akwgfds: '+ props.enddate)
        // @ts-ignore
        var index = props.stock.info.data.length - 1
        // @ts-ignore
        var a = new Date(props.stock.info.data[index].Date)
        var b = new Date(start)
        while(a < b){
            index--;
            let day = new Date(props.stock.info.data[index].Date);
            const offset = day.getTimezoneOffset();
            day = new Date(day.getTime() - offset * 60 * 1000);
            day.setDate(day.getDate() + 1);
            const tmp = day.toISOString().split('T')[0].split('-');
            a = new Date('' + tmp[1] + '/' + tmp[2] + '/' + tmp[0]);
        }
        while(end >= start){
            // @ts-ignore
            if(props.stock.info.data[index].Date === start){     //если есть данные о дне в таблице
                datearr.push(start);
                // @ts-ignore
                pricearr.push(props.stock.info.data[index].Open);
                index--;

            }
            else{
                datearr.push(start);
                pricearr.push(pricearr[pricearr.length-1]);
            }
            let day = new Date(start);
            const offset = day.getTimezoneOffset();
            day = new Date(day.getTime() - offset * 60 * 1000);
            day.setDate(day.getDate() + 1);
            const tmp = day.toISOString().split('T')[0].split('-');
            start = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
        }
        setpricearray(pricearr)
        setdatearray(datearr)
    }
    return(
        <div className={'singlestock'} key={'singlebargainstock: ' + props.stock.data.id}>
            <div className={'mainstock'}>
                <div className={'stockfield'}>
                    <p className={'stockplabel'}>
                        Обозначение:
                    </p>
                    <p id={'designationstockfold: '} className={'stock_p'}>{props.stock.info.designation}</p>

                </div>
                <div className={'stockfield'}>
                    <p className={'stockplabel'}>
                        Название компании:
                    </p>
                    <p className={'stock_p'}   id = {"titlestockfold: " + props.stock.data.id}  key={"titlestockfold: " + props.stock.data.id}>{props.stock.info.title}</p>
                </div>

                <div className={'stockfield'}>
                    <p className={'stockplabel'}>
                        Количество акций:
                    </p>
                    <p className={'stock_p'}   id = {"countstockfold: " + props.stock.data.id}  key={"titlestockfold: " + props.stock.data.id}>{countvalue}</p>
                </div>
                <div className={'stockfield'}>
                    <p className={'stockplabel'}>
                        Текущая стоимость:
                    </p>
                    <p className={'stock_p'}   id = {"curprice: " + props.stock.data.id}  key={"curprice: " + props.stock.data.id} >{price_array[price_array.length-1]}</p>
                </div>
                <div className={'stockfield numbuy'}>
                    <input className={'stocks_input numbargain'} type={'number'} onChange={changebuycountHandler} onBlur={changebuycountHandler} onBeforeInput={changebuycountHandler}/>
                </div>
                <div className={'stockfield'}>
                    <button className={'buybut'}>Купить</button>
                </div>
            </div>
            <div className={'databox'}>
                <h2 id={'changecoursetitle'}>Изменение курса</h2>
                <table cellSpacing={5}>
                    <thead>
                    <tr key={"titlestocktr: " + props.stock.data.id}>
                        <th className={'stockstablehead'}>Дата</th>
                        <th className={'stockstablehead'}>Стоимость</th>
                    </tr>
                    </thead>
                    <tbody>
                    {date_array.map((day,index) =><tr key={'datatr: ' + day}>
                        <td className={'stockstablebody'}>{day}</td>
                        <td className={'stockstablebody'}>{price_array[index]}</td>
                    </tr>)}

                    </tbody>
                </table>
                <div className={'graphic'}>
                    <Line data={{
                        labels: date_array,
                        datasets: [
                            {
                                data: price_array.map(price => parseFloat((price).replace('$',''))),
                                label: "Курс",
                                borderColor: "green",
                                fill: true,
                            }
                        ]
                    }}/>
                </div>
            </div>
        </div>
    )
}
