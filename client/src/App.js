import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import Home from './components/Home';
import View from './components/View';

export default function App() {
	return (
		<React.Fragment>
			<CssBaseline />
			<Container>
				<Router>
					<div>
						<Switch>
							<Route path="/v/:urlHash" component={View} />
							<Route path="/" component={Home} />
						</Switch>
					</div>
				</Router>
			</Container>
		</React.Fragment>
	);
}