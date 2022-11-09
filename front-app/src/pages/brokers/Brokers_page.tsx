import React, {ChangeEvent, useState} from "react";
import {Broker} from "./broker";
import {Ibroker, Istock} from "../../Models";
import axios from "axios";
import {Link} from "react-router-dom";
interface BrokersProps{
    brokers: Ibroker[]
}
export function Brokers_page(props: BrokersProps){
    const submitHandler = async (event: React.FormEvent) =>{
        event.preventDefault()
        if(parseInt(moneyvalue) >= 0 && namevalue.trim().length > 0){
            const res = await  axios.get<Ibroker[]>('http://localhost:3000/brokers')
            for (const value of res.data) {
                if (value.name === namevalue) {

                    return;
                }
            }
            const broker: Ibroker = {
                id: res.data.length !== undefined ? res.data[res.data.length - 1].id + 1: 0,
                name: namevalue,
                money: parseInt(moneyvalue)
            }
            const response = await axios.post<Ibroker>('http://localhost:3000/brokers/add_broker',broker)
            window.location.reload()
        }
    }
    const [moneyvalue,setMoneyValue] = useState('')
    const [namevalue,setValue] = useState('')
    const changepriceHandler = async (event: ChangeEvent<HTMLInputElement>) => {

         setMoneyValue(event.target.value)
    }
    const changenameHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }
    return(
        <div className={'brokerpage_box'} >
            <Link to={'/'} style={{marginLeft: '70%',
                marginTop: '1%'
            }}>
                <button className={'exitbutton'}  id={'back'}>Назад</button>
            </Link>
            <h2>Брокеры</h2>
            {props.brokers.map(broker =><Broker broker = {broker} butname={'Удалить'} />)}
            <form onSubmit={submitHandler}>
            <div className={'main'}>
                <div className="field namefield">
                    <label className={'brokerlabel'} htmlFor={'broknamefold'}>
                        имя:
                    </label>
                    <input id={'broknamefold: ' + props.brokers.length} className={'brokers_input'} value={namevalue} onChange={changenameHandler}/>

                </div>
                <div className="field">
                    <label className={'brokerlabel'} htmlFor={'moneyfold: ' + props.brokers.length}>
                        деньги:
                    </label>
                    <input className={'brokers_input'} type={'number'}  id = {"moneyfold: " + props.brokers.length} value={moneyvalue} onChange={changepriceHandler}/>

                </div>
                <button className={'brokerbutton addbut'}>Добавить</button>
            </div>
            </form>


</div>
)
}
