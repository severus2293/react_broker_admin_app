import React, {ChangeEvent, FormEvent, useState} from "react";
import {Ibroker} from "../../Models"
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import axios from "axios";

interface BrokerProps{
    broker: Ibroker
    butname: string
}
export function Broker(props: BrokerProps){

    const [moneyvalue,setMoneyValue] = useState(JSON.stringify(props.broker.money))
    const SubmitHandler  = async (event) =>{
        event.preventDefault()
        // eslint-disable-next-line no-restricted-globals
        const check = confirm('вы точно хотите удалить брокера?');
        if(check) {
            const body = {
                id: parseInt((event.target.id).replace('formdelid: ',''))
            }
            console.log(body.id)
            const response = await axios.post<Ibroker>('http://localhost:3000/brokers/remove_broker', body)

            window.location.reload()
        }
    }
    const changepriceHandler = async (event: ChangeEvent<HTMLInputElement>) => {

        setMoneyValue(event.target.value)
        if(parseInt(moneyvalue) >= 0){
            const broker: Ibroker = {
                id: -1,
                name: '',
                money: 0
            }
            const res = await  axios.get<Ibroker[]>('http://localhost:3000/brokers')
            for (const value of res.data) {
                if (value.id === parseInt(event.target.id.replace('moneyfold: ',''))) {
                    broker.id = value.id;
                    broker.money = parseInt(moneyvalue);
                    broker.name = value.name;
                }
            }
            const response = await axios.post<Ibroker>('http://localhost:3000/brokers/change_money',broker)
            console.log('dsgsd')
        }
    }
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
