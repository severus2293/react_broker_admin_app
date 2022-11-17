import React, {useEffect, useState} from "react";
import {Stock} from "./stock";
import {Istock} from "../../Models";
import {Link} from "react-router-dom";
import {io} from "socket.io-client";
interface StocksProps{
    stocks: Istock[]
}
export function Stocks_page(props: StocksProps){
    const [sock,setsocket] = useState()
    const [stocks,setStocks] = useState<Istock[]>([])
    useEffect(()=>{
        const socket = io('http://localhost:3000/usersocket')
        // @ts-ignore
        setsocket(socket)
        fetch('http://localhost:3000/stocks')
            .then(response => response.json())
            .then(json =>{
                setStocks(json)
            })
       // socket.on('BargainStocks', (message) => {
      //      setStocks(message)
      //  })
    },[])
    return(
        <div className={'stockspage_box'} key={'stockslist'}>
            <Link to={'/'} style={{marginLeft: '70%',
                marginTop: '1%'
            }}>
                <button className={'exitbutton'}  id={'back'}>Назад</button>
            </Link>
            <h2>Акции</h2>
            {stocks.map(stock =><Stock stock = {stock} socket={sock} key={'stock: ' + stock.data.id} />)}

            </div>
    )
}
