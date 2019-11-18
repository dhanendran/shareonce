import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import './style.css';

export default function ButtonAppBar() {
	return (
		<div className='root'>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className='title'>
						<Link href="/" className='titleText'>
							Share Once
						</Link>
					</Typography>
					<Typography variant="subtitle2">
						<Link href="/about" className='aboutLink'>
							About
						</Link>
					</Typography>
				</Toolbar>
			</AppBar>
		</div>
	);
}
