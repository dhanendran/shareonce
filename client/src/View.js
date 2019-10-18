import React from 'react';
import './App.css';
import axios from 'axios';

class View extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			salt: '',
			urlHash: '',
			requireSalt: false,
			error: true
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount () {
		let urlHash = this.props.match.params.urlHash;
		let self = this;
    	self.setState({urlHash: urlHash });

    	axios.get('/api/validate/' + urlHash)
			.then(function (response) {
				if ( response.data.success ) {
					self.setState({ requireSalt: response.data.requireSalt, error: false });
				} else {
					self.setState({ error: true });
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	handleChange(event) {
		this.setState({ [event.target.id]: event.target.value });
	}

	handleSubmit(event) {
		event.preventDefault();
		let self = this;
		
		if ( self.state.requireSalt && ! self.state.salt ) {
			alert('You need to enter your secret code to view the message!');
			return;
		}

		axios.get('/api/view/' + self.state.urlHash + '/' + self.state.salt)
			.then(function (response) {
				self.setState({message: response.data.message});
			})
			.catch(function (error) {
				console.log(error);
			});		
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
				{ this.state.error ?
					<div>
						<p>Couldn't find your message. URL might be wrong or you might already viewed your message.</p>
						<p>Click <a href="/">here</a> to create new.</p>
					</div>
					: ''
				}
				{ this.state.message ?
					(
						<div>
							<p>Your secret message</p>
							<p>{this.state.message}</p>
						</div>
					)
					: ! this.state.error ?
					(
						<div>
							<p>This message will be permanently removed from our storage. Please make sure you save the information before leaving this page.</p>
							<form onSubmit={this.handleSubmit}>
								{ this.state.requireSalt ?
									(
										<div>
											<label htmlFor="message">Enter your secret to view the message: </label>
											<input
												id="salt"
												type="text"
												value={this.state.salt}
												onChange={this.handleChange}
											/>
										</div>
									) : '' }
								<p><button type="submit">Are you sure want to see the message?</button></p>
							</form>
						</div>
					) : ''
				 }
				</header>
			</div>
		);
	}
}

export default View;
