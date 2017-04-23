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
			<div className="site-wrapper">
		      <div className="site-wrapper-inner">
		        <div className="cover-container">
		          <div className="masthead clearfix">
		            <div className="inner">
		              <Banner/>
		            </div>
		          </div>
		          <div className="inner cover">
		            <h1 className="cover-heading">Unify your data</h1>
		            <p className="lead">Unify is data visualization dashboard which puts all of your online ad and sales data in one place</p>
		            <p className='lead'>Select help in the navbar if you need help logging in</p>
		            <div className="lead main-forms">
		              <FacebookLoginEl />
		              <AmazonLoginEl />
		            </div>
		          </div>
		        </div>
		      </div>
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
			console.log(response)
			if (response.status === 'connected') {
				DATAACTIONS.storeFbToken()
			}
		})
	},
	render: function() {
		this.checkLoggedIn()
		return(
			<div className="facebook-login-wrapper login">
				<h2>Link Facebook Account Data:</h2>
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
		console.log(userData)
		formEl.reset()
	},
	render: function() {
		return(
			<div className='amazon-login-wrapper login'>
				<h2>Link Amazon Account Data:</h2>
				<form onSubmit={this.handleSubmit} className='amazon-form'>
					<input
						className='sellerId amazon-form-input'
						type='text'
						name='sellerId'
						placeholder='Amazon Seller ID'
					/>
					<input
						className='awsAccessKey amazon-form-input'
						type='text'
						name='awsAccessKey'
						placeholder='AWS Access Key'
					/>
					<input
						className='secretAccessKey amazon-form-input'
						type='text'
						name='secretAccessKey'
						placeholder='AWS Secret Access Key'
					/>
					<button className="amazon-button amazon-form-input" type="submit">submit</button>
				</form>
			</div>
		)
	}
})

export default SyncAccountView