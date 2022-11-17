import React, {useEffect, useState} from "react";
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
    stock: Istock,
    socket: any
}
export function Stock(props: StockProps){
    const [countvalue,setCountValue] = useState(props.stock.data.count)
    const [checkvalue,setCheckValue] = useState(props.stock.data.participation)
    const [datearray,setDatearr] = useState<string[]>([])
    const [pricearray,setPricearr] = useState<string[]>([])
    useEffect(()=>{
        fetch('http://localhost:3000/stocks')
            .then(response => response.json())
            .then(json =>{
                for(let stock of json){
                    if(stock.data.id === props.stock.data.id){
                        setCountValue(stock.data.count)
                        setCheckValue(stock.data.participation)
                        break
                    }
                }
            })
        props.socket.on('BargainStocks', (message) => {
            for(let stock of message){
                if(stock.data.id === props.stock.data.id){
                    setCountValue(stock.data.count)
                    setCheckValue(stock.data.participation)
                    break
                }
            }
        })
        renderInfoArr()
    },[])
    function renderInfoArr(){
        var start = props.stock.info.data[props.stock.info.data.length - 1].Date
        var index = props.stock.info.data.length - 1
        const datearr: string[] = []
        const pricearr: string[] = []
        while(index>0){
            if(props.stock.info.data[index].Date === start){     //если есть данные о дне в таблице
                datearr.push(start);
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
        setDatearr(datearr)
        setPricearr(pricearr)
    }
    const ChangecountHandler = async (event: React.ChangeEvent<HTMLInputElement>) =>{
        setCountValue(JSON.parse(event.target.value))
        if(parseInt(event.target.value) > 0){
            const message = {
                id: event.target.id.replace('countfold:',''),
                count: parseInt(event.target.value)
            }
            //const socket = this.$store.getters.GetSocket
            props.socket.emit('changeCountStocks',message)
        }
    }
    const ChangeparticionHandler = async (event: React.ChangeEvent<HTMLInputElement>) =>{
        //if(event.target.checked){
        //    setCheckValue(true)

      //  }
       // else{
       //     setCheckValue(false)
       // }
        const message = {
            id: parseInt(event.target.id.replace("checkfold:" ,''))
        }
        //const socket = this.$store.getters.GetSocket
        props.socket.emit('changeParticipationStocks',message)
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
                    <input className={'stockscheck_input'} type={'checkbox'}  id = {"checkfold: " + props.stock.data.id}  checked={checkvalue} onChange={ChangeparticionHandler}/>

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
                    {datearray.map((day,index) =><tr key={'datatr: ' + day}>
                        <td className={'stockstablebody'}>{day}</td>
                        <td className={'stockstablebody'}>{pricearray[index]}</td>
                    </tr>)}

                    </tbody>
                </table>
                <div className={'graphic'}>
                    <Line data={{
                        labels: datearray,
                        datasets: [
                    {
                        data: pricearray.map(price => parseFloat((price).replace('$',''))),
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
