import React, {ChangeEvent, useEffect, useState} from "react";
import {BargainStock} from "./bargain_stock";
import {Ibroker, Isetting, Istock} from "../../Models";
import {io,Socket} from "socket.io-client";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
interface StocksProps{
    stocks: Istock[]
    setting: Isetting
}
export function Bargaining_page(props: StocksProps){
    const [timervalue, setTimerValue] = useState(props.setting.speed)
    const [datevalue,setDateValue] = useState(''+ props.setting.start.split('-')[1] +'/'+ props.setting.start.split('-')[2] + '/'+ props.setting.start.split('-')[0])

    useEffect(() => {
        setInterval(() =>{fetchtime()
            fetchdate()},1000)
    }, [datevalue]);
    async function fetchtime(){
        const response = await  axios.get('http://localhost:3000/bargain-process/time')
        setTimerValue(response.data)
    }
    async function fetchdate(){
        const response = await  axios.get('http://localhost:3000/bargain-process/date')
        setDateValue(response.data)
    }
    /*useEffect(  () => {
        if (socket) {
            socket.on("log", (body) => {

                setTimerValue(body.time);
                console.log(body.time);
                setDateValue(body.date)
                console.log(body.date)
            });
            console.log('onetime')
        }
    },[])*/



    return(
        <div className={'stockspage_box'} key={'stockslist'}>
            <h2>Торги</h2>
            <div className={'changedatabox'} key={'changedatabox'}>

                <div className={'stockfield timer'} key={'timerdiv'}>
                    <p className={'stockplabel'}>
                        Таймер:
                    </p>
                    <p className={'stock_p'}   id = {"itersec"}  key={"itersecond"}>{timervalue}</p>
                </div>

                <div className={'stockfield'}>
                    <p className={'stockplabel datachange'}>
                        Дата:
                    </p>
                    <p className={'stock_p'}   id = {"iterdat"}  key={"iterdata"}>{datevalue}</p>
                </div>
            </div>
            {props.stocks.map(stock =><BargainStock stock = {stock}  id = {stock.info.id} startdate={''+ props.setting.start.split('-')[1] +'/'+ props.setting.start.split('-')[2] + '/'+ props.setting.start.split('-')[0]} enddate={datevalue} />

            )}

        </div>
    )
}
