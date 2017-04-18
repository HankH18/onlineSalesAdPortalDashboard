import React from 'react'
import USERACTIONS from '../../userActions'
import User from '../../models/userModel.js'
import USERSTORE from '../../userStore'

var Banner = React.createClass({
	componentWillMount: function() {
		USERSTORE.on('dataUpdated', () => {
			this.setState(USERSTORE.data)
		})
	},
	getInitialState: function() {
		return USERSTORE.data
	},
	render: function() {
		var companyNameDisplay = this.state.user.attributes.name ? this.stateuser.attributes.name : ''
		return(
			<div className='banner-wrapper'>
				<h2>{companyNameDisplay}</h2>
				<h1>Unify</h1>
				<ul className='nav'>
					<li className='nav-item'>
						<a href='#data' className='nav-link'>
							View Data
						</a>
					</li>
					<li className='nav-item'>
						<a href='#linkData' className='nav-link'>
							Manage Data Sources
						</a>
					</li>
					{/*<li className='nav-item'>
						{companyNameDisplay ? <a onClick={USERACTIONS.logout} className='nav-link'>
							Log Out
						</a> : <a href='#login' className='nav-link'>
							Log In
						</a>}
					</li>*/}
				</ul>
			</div>
		)
	}
})

export default Banner