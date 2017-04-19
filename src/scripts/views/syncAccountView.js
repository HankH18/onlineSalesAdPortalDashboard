import React from 'react'
import USERACTIONS from '../userActions'
import Banner from './components/navBarHeader'
import USERSTORE from '../userStore'
import DATAACTIONS from '../dataActions'
import DATASTORE from '../dataStore'

var SyncAccountView = React.createClass({
	componentWillMount: function() {
		USERSTORE.on('dataUpdated', () => {
			this.setState(USERSTORE.data)
		})
	},
	componentWillUnmount: function() {
		USERSTORE.off('dataUpdated')
	},
	getInitialState: function() {
		return USERSTORE.data
	},
	render: function() {
		return(
			<div className='sync-view-wrapper'>
				<Banner />
				<h2>Link Facebook Account Data (note, must be registered as an admin for your page):</h2>
				<FacebookLoginEl />
				<h2>Link Amazon Account Data:</h2>
				<AmazonLoginEl />
			</div>
		)
	}
})

var FacebookLoginEl = React.createClass({
	handleClick: function() {
		this.setState()
	},
	checkLoggedIn: function() {
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				DATAACTIONS.storeFbToken()
			}
		})
	},
	render: function() {
		this.checkLoggedIn()
		return(
			<div className="facebook-login-wrapper">
				<div 
				className="fb-login-button" 
				data-size="xlarge" 
				data-show-faces="false" 
				data-auto-logout-link="true"
				data-scope="manage_pages, read_insights"
				onClick={this.handleClick}></div>
			</div>
		)
	}
})

var AmazonLoginEl = React.createClass({
	handleSubmit: function(eventObj) {
		eventObj.preventDefault()
		var formEl = eventObj.target,
			userData = {
				sellerId: formEl.sellerId.value,
				awsAccessKey: formEl.awsAccessKey.value,
				secretAccessKey: formEl.secretAccessKey.value
			}
		DATAACTIONS.storeAmazonKeys(userData)
		formEl.reset()
	},
	render: function() {
		return(
			<form onSubmit={this.handleSubmit} className='amazon-form'>
				<input
					className='sellerId'
					type='text'
					name='sellerId'
					placeholder='Amazon Seller ID'
				/>
				<input
					className='awsAccessKey'
					type='text'
					name='awsAccessKey'
					placeholder='AWS Access Key'
				/>
				<input
					className='secretAccessKey'
					type='text'
					name='secretAccessKey'
					placeholder='AWS Secret Access Key'
				/>
				<button className="amazon-button" type="submit">submit</button>
			</form>
		)
	}
})

export default SyncAccountView