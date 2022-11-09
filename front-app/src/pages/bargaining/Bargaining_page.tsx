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
    // @ts-ignore
    console.log(useSelector(state => state.price))
    console.log('geret')
    function buyHandler(index){


        // @ts-ignore
        //socket.emit("buy:post",{id: index, count: useSelector(state => state.count[index])})
        // послать на сокет обновления кол-ва акций
        // в нём же оповестить всех об изменении кол-ва акций
    }
    const dispatch = useDispatch()
    // @ts-ignore
    const c = useSelector(state => state.count)
    // @ts-ignore
    const p = useSelector(state => state.price)
    const [timervalue, setTimerValue] = useState(props.setting.speed)
    /*const [socket, setSocket] = useState<Socket>(io("http://localhost:3000/realtime_barg", {
        // помните сигнатуру объекта `handshake` на сервере?
        query: {}
    }));*/
    const [datevalue,setDateValue] = useState(''+ props.setting.start.split('-')[1] +'/'+ props.setting.start.split('-')[2] + '/'+ props.setting.start.split('-')[0])
    // @ts-ignore
    const [countbuyvalue,setcountbuyvalue] = useState<number>(useSelector(state => state.count))
    const changecountHandler = (event) => {

        setcountbuyvalue(event.target.value)
        console.log(countbuyvalue)
    }
   // useEffect(() => {
       /* socket.on("counts", (stocks) => {
            setMessages(messages);
        });*/
    //})
    useEffect(() => {
        /*socket.on("data:get", (body) => {

            setTimerValue(body.time);
            console.log(body.time);
            setDateValue(body.date)
            console.log(body.date)
        });*/
        setInterval(() =>{fetchtime()
            fetchdate()},1000)






       /* const timer =  setInterval(async() => {
            if (timervalue > 0) {
                setTimerValue(timervalue - 1);
                const response = await  axios.post('http://localhost:3000/bargain-process/change_time',{time: timervalue})
            }
            else{
                var day = new Date(datevalue)
                const offset = day.getTimezoneOffset()
                day = new Date(day.getTime() - (offset*60*1000))
                day.setDate(day.getDate() + 1);
                const tmp = (day.toISOString().split('T')[0]).split('-')

                setDateValue(''+ tmp[1] +'/'+ tmp[2] + '/'+ tmp[0])
                const res = await  axios.post('http://localhost:3000/bargain-process/change_date',{date: datevalue})
                setTimerValue(props.setting.speed)
                const response = await  axios.post('http://localhost:3000/bargain-process/change_time',{time: timervalue})
            }


        }, 1000)
        return () => {clearInterval(timer)


        }*/
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
            {props.stocks.map(stock =><><BargainStock stock = {stock}  id = {stock.info.id} startdate={''+ props.setting.start.split('-')[1] +'/'+ props.setting.start.split('-')[2] + '/'+ props.setting.start.split('-')[0]} enddate={datevalue} /> <div className={'stockfield'}>
                <button className={'buybut'} >Купить</button>
                </div></>)}

        </div>
    )
}
