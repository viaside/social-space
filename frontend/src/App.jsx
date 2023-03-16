import React, {Component} from "react";
import { Route, Routes,  BrowserRouter} from 'react-router-dom';
import AppRoutes from './AppRoutes';
import NavBar from './component/NavBar';
import './App.css';

export default class App extends Component {
  render(){
    return (
      <BrowserRouter>
        <NavBar/>
        <Routes>
            {AppRoutes.map((route, index) => {
              const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
            })}
        </Routes>
      </BrowserRouter>
    );
  }
}