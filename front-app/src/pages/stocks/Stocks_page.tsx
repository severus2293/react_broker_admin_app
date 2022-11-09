import React from "react";
import {Stock} from "./stock";
import {Istock} from "../../Models";
import {Link} from "react-router-dom";
interface StocksProps{
    stocks: Istock[]
}
export function Stocks_page(props: StocksProps){
    return(
        <div className={'stockspage_box'} key={'stockslist'}>
            <Link to={'/'} style={{marginLeft: '70%',
                marginTop: '1%'
            }}>
                <button className={'exitbutton'}  id={'back'}>Назад</button>
            </Link>
            <h2>Акции</h2>
            {props.stocks.map(stock =><Stock stock = {stock} key={'stock: ' + stock.data.id} />)}

            </div>
    )
}
