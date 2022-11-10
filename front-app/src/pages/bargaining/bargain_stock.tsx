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
}

export function BargainStock(props: StockProps){

    const [indexdate,setindexdate] = useState(-1)
    const [date_array,setdatearray] = useState<string[]>([])
    const [price_array,setpricearray] = useState<string[]>([])
    const [countbuyvalue,setcountbuy] = useState(0)
    const dispatch = useDispatch()
    const changebuycountHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setcountbuy(parseInt(event.target.value))
        dispatch({type: "CHANGE_COUNT",index: props.id,val: countbuyvalue})

    }
    useEffect(() => {
        updateGraphic()
    })
    function updateGraphic(){

        var cur_d_ar = date_array
        var cur_p_ar = price_array
        var cur_date = props.startdate
        if(indexdate === -1){
            for(let i = props.stock.info.data.length - 1;i > 0;i--){

                if(props.stock.info.data[i].Date === cur_date){
                    setindexdate(i)
                    cur_d_ar.push(props.stock.info.data[i].Date)
                    cur_p_ar.push(props.stock.info.data[i].Open)
                    setdatearray(cur_d_ar)
                    setpricearray(cur_p_ar)
                    if(cur_p_ar[cur_p_ar.length - 2] !== props.stock.info.data[i].Open){
                        dispatch({type: "CHANGE_PRICE",index: props.id,val: props.stock.info.data[i].Open})
                    }
                        return
                }
            }
        }
        else{
            var iter = indexdate
            if(date_array.length == 1 && props.startdate !== props.enddate){
                var cur = cur_date.split('/')
                let day = new Date('' + cur[2] + '-' + cur[0] + '-' + cur[1]);
                var offset = day.getTimezoneOffset();
                day = new Date(day.getTime() - offset * 60 * 1000);
                day.setDate(day.getDate() + 1);
                var tmp = day.toISOString().split('T')[0].split('-');
                cur_date = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
                while(cur_date !== props.enddate){
                    if(cur_date === props.stock.info.data[iter-1].Date){
                        cur_d_ar.push(props.stock.info.data[iter-1].Date)
                        cur_p_ar.push(props.stock.info.data[iter-1].Open)
                        iter-=1
                        setindexdate(iter) // indexdate -1
                        setdatearray(cur_d_ar)
                        setpricearray(cur_p_ar)
                    }
                    else if(cur_date !== cur_d_ar[cur_d_ar.length-1]){
                        console.log(cur_date)
                        console.log(cur_d_ar[cur_d_ar.length-1])
                        cur_d_ar.push(cur_date)
                        cur_p_ar.push(cur_p_ar[cur_p_ar.length-1])
                        setdatearray(cur_d_ar)
                        setpricearray(cur_p_ar)
                    }
                    cur = cur_date.split('/')
                    let day = new Date('' + cur[2] + '-' + cur[0] + '-' + cur[1]);
                    const offset = day.getTimezoneOffset();
                    day = new Date(day.getTime() - offset * 60 * 1000);
                    day.setDate(day.getDate() + 1);
                    const tmp = day.toISOString().split('T')[0].split('-');
                    cur_date = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
                }
              //  setindexdate(indexdate - 1);
                console.log('not here')
                console.log(indexdate)
                //cur = cur_date.split('/')
               // day = new Date('' + cur[2] + '-' + cur[0] + '-' + cur[1]);
               // offset = day.getTimezoneOffset();
               // day = new Date(day.getTime() - offset * 60 * 1000);
               // day.setDate(day.getDate() + 1);
               //  tmp = day.toISOString().split('T')[0].split('-');
               // cur_date = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
                iter -= 1
                setindexdate(iter)
                console.log('данные восстановлены')

            }
            /*if(date_array.length == 1){
                console.log(props.enddate)
                var cur = cur_date.split('/')
                let day = new Date('' + cur[2] + '-' + cur[0] + '-' + cur[1]);
                const offset = day.getTimezoneOffset();
                day = new Date(day.getTime() - offset * 60 * 1000);
                day.setDate(day.getDate() + 1);
                const tmp = day.toISOString().split('T')[0].split('-');
                cur_date = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
               while(cur_date !== props.enddate){
                   if(cur_date === props.stock.info.data[indexdate-1].Date){
                       cur_d_ar.push(props.stock.info.data[indexdate-1].Date)
                       cur_p_ar.push(props.stock.info.data[indexdate-1].Open)
                       setindexdate(indexdate - 1)
                       setdatearray(cur_d_ar)
                       setpricearray(cur_p_ar)
                   }
                   else if(props.enddate !== cur_d_ar[cur_d_ar.length-1]){
                       cur_d_ar.push(cur_date)
                       cur_p_ar.push(cur_p_ar[cur_p_ar.length-1])
                       setdatearray(cur_d_ar)
                       setpricearray(cur_p_ar)
                       return
                   }
                   cur = cur_date.split('/')
                   let day = new Date('' + cur[2] + '-' + cur[0] + '-' + cur[1]);
                   const offset = day.getTimezoneOffset();
                   day = new Date(day.getTime() - offset * 60 * 1000);
                   day.setDate(day.getDate() + 1);
                   const tmp = day.toISOString().split('T')[0].split('-');
                   cur_date = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
               }
            }*/

            if(props.enddate === props.stock.info.data[iter-1].Date){
                cur_d_ar.push(props.stock.info.data[iter-1].Date)
                cur_p_ar.push(props.stock.info.data[iter-1].Open)
                iter -= 1 //
                setindexdate(iter) //indexdate - 1
                setdatearray(cur_d_ar)
                setpricearray(cur_p_ar)
                return
            }
            else if(props.enddate !== cur_d_ar[cur_d_ar.length-1] && props.enddate !== props.stock.info.data[iter-1].Date){
                console.log('why?')
                console.log(`текущая дата:`+props.id +' '+ props.enddate)
                console.log('дата из данных: ' + props.stock.info.data[iter-1].Date)
                console.log(indexdate)
                console.log(iter)
                cur_d_ar.push(props.enddate)
                cur_p_ar.push(cur_p_ar[cur_p_ar.length-1])
                setdatearray(cur_d_ar)
                console.log(date_array)
                setpricearray(cur_p_ar)
                return
            }


        }

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
                    <p className={'stock_p'}   id = {"countstockfold: " + props.stock.data.id}  key={"titlestockfold: " + props.stock.data.id}>{props.stock.data.count}</p>
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
                    {date_array.map((element,index) =><tr key={'datatr: ' + element}>
                        <td className={'stockstablebody'}>{element}</td>
                        <td className={'stockstablebody'}>{price_array[index]}</td>
                    </tr>)}

                    </tbody>
                </table>
                <div className={'graphic'}>
                    <Line data={{
                        labels: date_array.map(day => day),
                        datasets: [
                            {
                                data: price_array.map(day => parseFloat((day).replace('$',''))),
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
