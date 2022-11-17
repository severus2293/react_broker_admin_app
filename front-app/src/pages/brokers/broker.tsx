import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Ibroker} from "../../Models"
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import axios from "axios";
import {io} from "socket.io-client";

interface BrokerProps{
    broker: Ibroker
    butname: string,
    socket: any
}
export function Broker(props: BrokerProps){

    const [moneyvalue,setMoneyValue] = useState(JSON.stringify(props.broker.money))
    //const [socket,setSocket] = useState(io('http://localhost:3000/usersocket'))
    useEffect(()=>{
    },[])
    const SubmitHandler  = async (event) =>{
        event.preventDefault()
        // eslint-disable-next-line no-restricted-globals
        const check = confirm('вы точно хотите удалить брокера?');
        if(check) {
            const message = {
                id: event.target.id.replace('formdelid: ','')
            }
            //  const socket = this.$store.getters.GetSocket
            console.log('DELETEUSER: ' + message.id)
            props.socket.emit('delUser',message)
           // const socket = io('http://localhost:3000/usersocket')
           // socket.emit('delUser',message)
        }
    }
    const changepriceHandler = async (event: ChangeEvent<HTMLInputElement>) => {

        setMoneyValue(event.target.value)
        if(parseFloat(moneyvalue) >= 0){
            console.log('dhfjhjfgj')
            const message = {
                id: event.target.id.replace('moneyfold:',''),
                money: parseFloat(event.target.value)
            }
            props.socket.emit('changeMoney',message)
        }
    }
    useEffect(()=>{
        props.socket.on('authorization_status', (message) => {
            for(let user of message){
                if(user.id === props.broker.id){
                    setMoneyValue(user.money)
                    break
                }
            }
            //setMoneyValue(message)
        })
       // window.location.reload()
    },[])
    return(
        <form onSubmit={SubmitHandler} id={'formdelid: ' + props.broker.id}>
            <div className={'main'}>
                <div className="field namefield">
                    <label className={'brokerlabel'} htmlFor={'broknamefold'}>
                        имя:
                    </label>
                    <input id={'broknamefold: ' + props.broker.id} className={'brokers_input'} value={props.broker.name} readOnly/>

                </div>
                <div className="field">
                    <label className={'brokerlabel'} htmlFor={'moneyfold'}>
                        деньги:
                    </label>
                    <input className={'brokers_input'} type={'number'}  id = {"moneyfold: " + props.broker.id} value={moneyvalue}   onBlur={changepriceHandler} onChange={changepriceHandler}/>

                </div>
                <button className={'brokerbutton delbut'}  id={'buttonbrok: ' + props.broker.id}>{props.butname}</button>

            </div>
        </form>

    )
}
