import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {createStore} from "redux";
import {Provider} from "react-redux";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const defaultstate = {
    count: [0,0,0,0,0,0,0,0],
    price: ['','','','','','','',''],
    start: ''
}
const reducer = (state = defaultstate,action) => {
    switch (action.type){
        case "CHANGE_COUNT":
            return{...state,count: state.count.map(
                    (val, i) => i === action.index ? action.val
                        : val
                )}
        case "CHANGE_PRICE":
            return{...state,price: state.price.map(
                    (val, i) => i === action.index ? action.val
                        : val
                )}
        case "CHANGE_START":
            return{...state,start: action.val}
        default:
            return state
    }
}

// @ts-ignore
const store = createStore(reducer)
root.render(
  <BrowserRouter>
      <Provider store={store}>
    <App />
  </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
