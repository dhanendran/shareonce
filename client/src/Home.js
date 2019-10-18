import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			salt: '',
			url: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({ [event.target.id]: event.target.value });
	}

	handleSubmit(event) {
		event.preventDefault();
		var self = this;
		axios.post('/api/save', {
				message: self.state.message,
				salt: self.state.salt
			})
			.then(function (response) {
				console.log(response.data);
				self.setState({ url: window.location.origin + '/v/' + response.data.urlHash });
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<form onSubmit={this.handleSubmit}>
						<label htmlFor="message">Enter your name: </label>
						<textarea
							id="message"
							onChange={this.handleChange}>{this.state.name}</textarea>
						<input
							id="salt"
							type="text"
							value={this.state.salt}
							onChange={this.handleChange}
						/>
						<button type="submit">Submit</button>
					</form>
					<p>{this.state.url}</p>
					
				</header>
			</div>
		);
	}
}

export default Home;
