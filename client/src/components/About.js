import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

class About extends React.Component {
	render() {
		return (
			<Paper className='home-msg'>
				<Typography component='div'>
					<Box fontSize="h3.fontSize">
						Share Once
					</Box>
					Share Once is one of the platform where you can share your secret information with someone in a secured way.
				
					<Box fontSize="h4.fontSize">
						How to?
					</Box>
					<ol>
						<li>On the Share Once home page, type your secret message.</li>
						<li>Pass Pharse is optional but I highly recommend to add pass pharse to secure more.</li>
						<li>Click on the `Encode` button.</li>
						<li>Your message will be encrypted and stored in a secured place.</li>
						<li>Copy and share the URL with the person whom you want to share the secret.</li>
						<li>tada</li>
					</ol>
				</Typography>
			</Paper>
		);
	}
}

export default About;