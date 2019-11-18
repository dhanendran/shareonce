import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import Header from './components/Header';
import Home from './components/Home';
import View from './components/View';
import About from './components/About';

export default function App() {
	return (
		<React.Fragment>
			<CssBaseline />
			<Container>
				<Header/>
				<Router>
					<div className='paperBody'>
						<Switch>
							<Route path="/v/:urlHash" component={View} />
							<Route path="/about" component={About} />
							<Route path="/" component={Home} />
						</Switch>
					</div>
				</Router>
			</Container>
		</React.Fragment>
	);
}