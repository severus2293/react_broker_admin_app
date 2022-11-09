import React, {ChangeEvent, useEffect, useState} from "react";
import {Isetting} from "../Models";
import axios from "axios";
import {Link, Route, Routes} from "react-router-dom";
interface SettingProps{
    settings: Isetting
}

export function Settings_page(props: SettingProps){
    const [startdatevalue,setstartdateValue] = useState(props.settings.start)
    const [enddatevalue,setenddateValue] = useState(props.settings.end)
    const [speedvalue,setspeedValue] = useState(props.settings.speed)
    const ChangeStartHandler = async (event: ChangeEvent<HTMLInputElement>) => {

        setstartdateValue(event.target.value)
        const body = {
            start: event.target.value
        }
        const response = await axios.post<Isetting>('http://localhost:3000/settings/change_start',body)
        }
        const startbargain = async (event) =>{
            if(new Date(startdatevalue) >= new Date(enddatevalue)){
                event.preventDefault()

            }
            else{
                const r= await axios.post('http://localhost:3000/bargain-process/start_bargaing',{time: speedvalue,date: startdatevalue, start: true})
                return true
            }
        }
    const ChangeEndHandler = async (event: ChangeEvent<HTMLInputElement>) => {

        setenddateValue(event.target.value)
        const body = {
            end: event.target.value
        }
        const response = await axios.post<Isetting>('http://localhost:3000/settings/change_end',body)
    }
    const ChangeSpeedHandler = async (event: ChangeEvent<HTMLInputElement>) => {

        setspeedValue(parseInt(event.target.value))
        const body = {
            speed: parseInt(event.target.value)
        }
        const response = await axios.post<Isetting>('http://localhost:3000/settings/change_speed',body)

    }
    return(
        <>
        <div className={'settingspage_box'} key={'settings'}>
            <Link to={'/'} style={{marginLeft: '70%',
                marginTop: '1%'
                }}>
                <button className={'exitbutton'}  id={'back'}>Назад</button>
            </Link>
            <h2>Настройка</h2>
            <div className={'settingsmain'}>
                <div className="field">
                    <label className={'settinglabel'} htmlFor={'date_start_fold'}>
                        Дата начала торгов:
                    </label>
                    <input id={'date_start_fold'} className={'settings_input'} type={'date'} max="2022-11-03" min={"2021-11-04"} value={startdatevalue} onChange={ChangeStartHandler}/>

                </div>
                <div className="field">
                    <label className={'settinglabel'} htmlFor={'date_end_fold'}>
                        Дата окончания торгов:
                    </label>
                    <input id={'date_end_fold'} className={'settings_input'} type={'date'}  max="2022-11-03" min={"2021-11-04"} value={enddatevalue} onChange={ChangeEndHandler}/>

                </div>
                <div className="field">
                    <label className={'settinglabel'} htmlFor={'date_end_fold'}>
                        Скорость смены дат:
                    </label>
                    <input id={'speed_date'} className={'settings_input speed'} type={'number'} value={speedvalue} onChange={ChangeSpeedHandler}/>

                </div>
                <Link to={'/bargaining'} style={{marginLeft: '30%',
                    marginTop: '16%'}}>
                <button className={'startbargbutton'}  id={'startbarg'} onClick={ startbargain }>Начало Торгов</button>
                </Link>
            </div>
        </div>
        </>
    )
}
