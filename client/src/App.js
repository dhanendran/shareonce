import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.css';

import Home from './Home';
import View from './View';

export default function App() {
	return (
    <Router>
      <div>
        <Switch>
        	<Route path="/v/:urlHash" component={View} />
          	<Route path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}


