import React from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
			<div>
				<Paper className='home-msg'>
					{ this.state.error ?
						<div>
							<Typography component='p'>
								Couldn't find your message. URL might be wrong or you might already viewed your message.
							</Typography>
							<Typography component='p'>Click <a href="/">here</a> to create new.</Typography>
						</div>
						: ''
					}

					{ this.state.message ?
					(
						<div>
							<Typography component='p'>Your secret message:</Typography>
							<Typography className='secretMsg' component='p'>{this.state.message}</Typography>
						</div>
					)
					: ! this.state.error ?
					(
						<div>
							<Typography component='p'>This message will be permanently removed from our storage. Please make sure you save the information before leaving this page.</Typography>
							<form onSubmit={this.handleSubmit}>
								{ this.state.requireSalt ?
									(
										<div>
											<TextField
												required
												id='salt'
												label='Secret'
												style={{ margin: 8 }}
												placeholder='Type here'
												helperText='Enter your secret to view the message'
												value={this.state.salt}
												onChange={this.handleChange}
												fullWidth
												margin='normal'
												InputLabelProps={{
												  shrink: true,
												}}
											/>
										</div>
									) : '' }
								<Typography component='p'>
									<Button type='submit' variant='contained' color='primary' className='submitBtn' startIcon={<VisibilityIcon />}>
										Are you sure want to see the message?
									</Button>
								</Typography>
							</form>
						</div>
					) : ''
				 }
				</Paper>
			</div>
		);
	}
}

export default View;
