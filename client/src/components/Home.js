import React from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import HttpsIcon from '@material-ui/icons/Https';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			salt: '',
			url: '',
			errorMsg: false,
			copied: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleError  = this.handleError.bind(this);
		this.handleCopy   = this.handleCopy.bind(this);
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
				self.setState({ url: window.location.origin + '/v/' + response.data.urlHash });
				self.setState({ message: '', salt: '' });
			})
			.catch(function (error) {
				self.setState({ errorMsg: true });
			});
	}

	handleError(event) {
		this.setState({ errorMsg: ! this.state.errorMsg });
	}

	handleCopy(event) {
		this.setState({ copied: ! this.state.copied });
	}

	render() {
		return (
				<div>
					<Paper className='home-msg'>
						<Typography variant='h5' component='h3'>
							Welcome to Share Once!
						</Typography>
						<Typography component='p'>
							Share your secret information to other people in a secured way and safely remove them once they viewed and copied them.
						</Typography>
						<form className='formData' onSubmit={this.handleSubmit}>
							<TextField
								required
								id='message'
								label='Message'
								style={{ margin: 8 }}
								placeholder='Type here'
								helperText='Enter your secret message.'
								value={this.state.message}
								onChange={this.handleChange}
								fullWidth
								margin='normal'
								InputLabelProps={{
								  shrink: true,
								}}
							/>
							
							<TextField
								id='salt'
								label='Pass Pharse'
								style={{ margin: 8 }}
								placeholder='Type here'
								helperText='You can add pass pharse to add additional security to your message.'
								value={this.state.salt}
								onChange={this.handleChange}
								fullWidth
								margin='normal'
								InputLabelProps={{
								  shrink: true,
								}}
							/>
							<Button variant='contained' color='secondary' className='resetBtn' startIcon={<SettingsBackupRestoreIcon />}>
								Reset
							</Button>
							<Button type='submit' variant='contained' color='primary' className='submitBtn' startIcon={<HttpsIcon />}>
								Encode
							</Button>
						</form>
						<Snackbar open={this.state.errorMsg} autoHideDuration={4000} onClose={this.handleError}>
							<Alert onClose={this.handleError} severity="error">
								Something went wrong! Please try again.
							</Alert>
						</Snackbar>
					</Paper>
					{ this.state.url ?
					<Paper className='secretUrlContainer'>
						<Typography component='p'>
							Copy and share this URL with the person whom you want to share this secret information.
						</Typography>
						<div className='secretUrlDiv'>
							<TextField
								required
								id="standard-required"
								className='secretUrl'
								margin="normal"
								value={this.state.url}
							/>
							<CopyToClipboard text={this.state.url} onCopy={this.handleCopy}>
								<Button variant='contained' color='secondary' className='resetBtn' startIcon={<FileCopyIcon />}>
									Copy
								</Button>
							</CopyToClipboard>
						</div>

					</Paper>
					: '' }
					<Snackbar open={this.state.copied} autoHideDuration={4000} onClose={this.handleCopy}>
						<Alert onClose={this.handleCopy} severity="success">
							URL copied into your clipboard.
						</Alert>
					</Snackbar>
				</div>
		);
	}
}

export default Home;
