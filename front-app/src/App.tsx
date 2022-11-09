import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import {Route, Routes} from 'react-router-dom'
import {Main_page} from "./pages/main/Main_page";
import {Brokers_page} from "./pages/brokers/Brokers_page";
import {Stocks_page} from "./pages/stocks/Stocks_page";
import {Settings_page} from "./pages/Settings_page";
import axios from 'axios'
import {Ibroker, Isetting, Istock} from "./Models";
import {Bargaining_page} from "./pages/bargaining/Bargaining_page";
function App() {
    const [brokers,setBrokers] = useState<Ibroker[]>([])
    const [stocks,setStocks] = useState<Istock[]>([])
    const [setting,setSetting] = useState<Isetting>({start: '2021-11-04',end: '2022-11-03',speed: 12})
    const [bargainstocks,setBargainStocks] = useState<Istock[]>([])
    async function fetchBrokers(){
        const response = await  axios.get<Ibroker[]>('http://localhost:3000/brokers')
        setBrokers(response.data)
    }
    async function fetchStocks(){
        const response = await  axios.get<Istock[]>('http://localhost:3000/stocks')
        setStocks(response.data)
    }
    async function fetchSetting(){
        const response = await  axios.get<Isetting>('http://localhost:3000/settings')
        setSetting(response.data)
    }
    async function fetchBargainStocks(){
        const response = await  axios.get<Istock[]>('http://localhost:3000/stocks/stocks_bargaining')
        setBargainStocks(response.data)
    }
    useEffect(() =>{
        fetchBrokers();
        fetchStocks();
        fetchSetting();
        fetchBargainStocks();
    },[])
  return (
    <Routes>
      <Route path='/' element={<Main_page/>}/>
      <Route path='/brokers' element={<Brokers_page brokers = {brokers}/>}/>
      <Route path='/stocks' element={<Stocks_page stocks = {stocks}/>}/>
      <Route path='/settings' element={<Settings_page settings={setting}/>}/>
        <Route path='/bargaining' element={<Bargaining_page stocks={bargainstocks} setting={setting}/>}/>
    </Routes>
  );
}

export default App;
