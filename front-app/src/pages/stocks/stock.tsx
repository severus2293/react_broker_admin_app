import React, {useState} from "react";
import { Istock} from "../../Models";
import {createStore} from "redux";
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
import {useDispatch} from "react-redux";

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
    stock: Istock
}
export function Stock(props: StockProps){
    const [countvalue,setCountValue] = useState(props.stock.data.count)
    const [checkvalue,setCheckValue] = useState(props.stock.data.participation)
    const ChangecountHandler = async (event: React.ChangeEvent<HTMLInputElement>) =>{
        setCountValue(JSON.parse(event.target.value))
        if(parseInt(event.target.value) >= 0){
            const body = {
                id: parseInt(event.target.id.replace("countfold: " ,'')),
                count: parseInt(event.target.value)
            }
            const response = await axios.post<Istock>('http://localhost:3000/stocks/change_count_bargaining', body)
        }
    }
    const ChangeparticionHandler = async (event: React.ChangeEvent<HTMLInputElement>) =>{
     const body = {
         id: parseInt(event.target.id.replace("checkfold: " ,''))
     }
        if(event.target.checked){
            setCheckValue(true)

        }
        else{
            setCheckValue(false)
        }
        const response = await axios.post<Istock>('http://localhost:3000/stocks/change_particion', body)
    }
    return(
        <div className={'singlestock'} key={'singlestock: ' + props.stock.data.id}>
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

                <div className={'countstock'}>
                    <label className={'stockplabel'} htmlFor={'countfold: ' + props.stock.data.id}>
                        Количество акций:
                    </label>
                    <input className={'stocks_input'} type={'number'}  id = {"countfold: " + props.stock.data.id} value={countvalue} onChange={ChangecountHandler}/>

                </div>
                <div>
                    <label className={'stockplabel'} htmlFor={'checkfold: ' + props.stock.data.id} >
                        Участие:
                    </label>
                    <input className={'stockscheck_input'} type={'checkbox'}  id = {"checkfold: " + props.stock.data.id} defaultChecked={checkvalue} onChange={ChangeparticionHandler}/>

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
                    {props.stock.info.data.slice(0).reverse().map(day =><tr key={'datatr: ' + day.Date}>
                        <td className={'stockstablebody'}>{day.Date}</td>
                        <td className={'stockstablebody'}>{day.Open}</td>
                    </tr>)}

                    </tbody>
                </table>
                <div className={'graphic'}>
                    <Line data={{
                        labels: props.stock.info.data.slice(0).reverse().map(day => day.Date),
                        datasets: [
                    {
                        data: props.stock.info.data.slice(0).reverse().map(day => parseInt((day.Open).replace('$',''))),
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
