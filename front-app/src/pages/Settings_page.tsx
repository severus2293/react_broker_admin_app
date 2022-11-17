import React, {ChangeEvent, useEffect, useState} from "react";
import {Isetting} from "../Models";
import axios from "axios";
import {Link, Route, Routes} from "react-router-dom";
import {io} from "socket.io-client";
import {useDispatch} from "react-redux";
interface SettingProps{
    settings: Isetting
}

export function Settings_page(props: SettingProps){
    const [startdatevalue,setstartdateValue] = useState(props.settings.start)
    const [sock,setsocket] = useState()
    const [enddatevalue,setenddateValue] = useState(props.settings.end)
    const [speedvalue,setspeedValue] = useState(props.settings.speed)
    const dispatch = useDispatch()
    const ChangeStartHandler = async (event: ChangeEvent<HTMLInputElement>) => {

        setstartdateValue(event.target.value)
        const message = {
            start: event.target.value
        }
        // @ts-ignore
        sock!.emit('changeStart',message)
        dispatch({type: "CHANGE_START",val: event.target.value})
        }
        const startbargain = async (event) =>{
            if(new Date(startdatevalue) >= new Date(enddatevalue)){
                event.preventDefault()

            }
            else{
                const message = {
                    process: true,
                }
                // const socket = this.$store.getters.GetSocket
                // @ts-ignore
                sock.emit('start_bargaing',message)
                return true
            }
        }
    const ChangeEndHandler = async (event: ChangeEvent<HTMLInputElement>) => {

        setenddateValue(event.target.value)
        const message = {
            end: event.target.value
        }
        // @ts-ignore
        sock!.emit('changeEnd',message)
    }
    const ChangeSpeedHandler = async (event: ChangeEvent<HTMLInputElement>) => {


        if(parseInt(event.target.value) > 0) {
            setspeedValue(parseInt(event.target.value))
            const message = {
                speed: parseInt(event.target.value)
            }
            // @ts-ignore
            sock!.emit('changeSpeed', message)
        }

    }
    useEffect(()=>{
        const socket = io('http://localhost:3000/usersocket')
        // @ts-ignore
        setsocket(socket)
        fetch('http://localhost:3000/settings')
            .then(response => response.json())
            .then(json =>{
                setstartdateValue(json.start);
                setenddateValue( json.end);
                setspeedValue(json.speed);
            })
        socket.on('SettingsUpdate', (message) => {
            setstartdateValue(message.start);
            setenddateValue( message.end);
            setspeedValue(message.speed);
        })
    },[])
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
                    <input id={'date_end_fold'} className={'settings_input'} type={'date'}  max="2022-11-03" min={"2021-11-05"} value={enddatevalue} onChange={ChangeEndHandler}/>

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
