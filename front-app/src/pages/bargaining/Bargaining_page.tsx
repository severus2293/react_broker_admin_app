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
    const [timervalue, setTimerValue] = useState()
    const [datevalue,setDateValue] = useState(''+ props.setting.start.split('-')[1] +'/'+ props.setting.start.split('-')[2] + '/'+ props.setting.start.split('-')[0])
    const [stocks,setStocks] = useState<Istock[]>([])
    // @ts-ignore
    const [startvalue,setStartValue] = useState('')
    const [settings,setSettings] = useState<Isetting>()
    const [sock,setsocket] = useState()
     useEffect(() => {
        const socket = io('http://localhost:3000/usersocket')
        // @ts-ignore
        setsocket(socket)
        fetch('http://localhost:3000/stocks/stocks_bargaining')
            .then(response => response.json())
            .then(json =>{
                setStocks(json)
            })
         fetch('http://localhost:3000/settings')
            .then(response => response.json())
            .then(json =>{
                setSettings(json)
                setTimerValue(json.speed)
                setDateValue(''+ json.start.split('-')[1] +'/'+ json.start.split('-')[2] + '/'+ json.start.split('-')[0])
                setStartValue(''+ json.start.split('-')[1] +'/'+ json.start.split('-')[2] + '/'+ json.start.split('-')[0])
                //console.log(startvalue)
            })

        socket.on('ChangeTime', (message) => {
            setTimerValue(message.speed)
            setDateValue(message.date)

        })
         console.log(startvalue)
        socket.on('SettingsUpdate', (message) => {
            setStartValue(message.start);
            setDateValue( message.end);
            setTimerValue(message.speed);
        })
    }, []);
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
            {stocks.map(stock =><BargainStock stock = {stock} socket={sock}  id = {stock.info.id} startdate={''+ props.setting.start.split('-')[1] +'/'+ props.setting.start.split('-')[2] + '/'+ props.setting.start.split('-')[0]} enddate={datevalue} key={stock.info.id} />

            )}

        </div>
    )
}
