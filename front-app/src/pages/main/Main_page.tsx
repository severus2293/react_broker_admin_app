import '../../stylesheet/main.css'
import broker from '../../assets/brokers_img.png'
import stock from '../../assets/stocks_img.png'
import setting from '../../assets/settings_img.png'
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
export function Main_page(){

    return (

        <div className={'flex_box'}>
           <h2>Биржа акций</h2>
            <div className={'contain_button'}>
                <Link to={'/brokers'}>
            <button id={'brokerbut'} className={'mainbutton'} key={1}><img src={broker}/> Брокеры</button>
                </Link>
                <Link to={'/stocks'}>
            <button id={'stockbut'} className={'mainbutton'} key={2}><img src={stock}/> Акции</button>
                </Link>
                <Link to={'/settings'}>
            <button id={'settingbut'}className={'mainbutton'}  key={3}><img src={setting}/> Настройка биржи</button>
                </Link>
            </div>
        </div>
    )
}
