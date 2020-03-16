import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import MainRouter from './MainRouter';
import Home from './core/Home'

let App = () => (
  <BrowserRouter>
    <MainRouter />
  </BrowserRouter>
);

export default App;