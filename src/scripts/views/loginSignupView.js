import React from 'react'
import USERACTIONS from '../userActions'
import Banner from './components/navBarHeader'
import USERSTORE from '../userStore'
import DATAACTIONS from '../dataActions'
import DATASTORE from '../dataStore'

var LoginPage = React.createClass({
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
	getExistingData: function() {
		//Check for existing login data and make requests
	},
	render: function() {
		return(
			<div className='login-page-wrapper'>
				<Banner />
				<h2>Welcome to Unify, where you can access all of the numbers you need from your online sales and ad portals, all from one place! Please login or register an account to continue.</h2>
				<h2>Register</h2>
				<RegisterForm />
				<h2>Login</h2>
				<LoginForm />
			</div>
		)
	}
})

var RegisterForm = React.createClass({
	handleSubmit: function(eventObj) {
		eventObj.preventDefault()
		var formEl = eventObj.target,
			userData = {
				name: formEl.companyName.value,
				email: formEl.email.value,
				password: formEl.password.value
			}
		USERACTIONS.registerUser(userData)
	},
	render: function() {
		return(
			<form onSubmit={this.handleSubmit} className='form-group register-form'>
				<input
					className='mt-1 form-control'
					type='text'
					name='companyName'
					placeholder='enter your company name'
				/>
				<input
					className='mt-4 form-control'
					type='text'
					name='email'
					placeholder='enter an email address for your account'
				/>
				<input
					className='my-1 form-control'
					type='password'
					name='password'
					placeholder='create password'
				/>
				<button className="btn btn-primary col-sm-3" type="submit">submit</button>
			</form>
		)
	}
})

var LoginForm = React.createClass({
	handleSumit: function(eventObj) {
		eventObj.preventDefault()
		USERACTIONS.logUserIn(eventObj.target.email.value, eventObj.target.password.value)
	},
	render: function() {
		return(
			<form onSubmit={this.handleSubmit} className='form-group login-form'>
				<input
					className='mt-4 form-control'
					type='text'
					name='email'
					placeholder='email'
				/>
				<input
					className='my-1 form-control'
					type='password'
					name='password'
					placeholder='password'
				/>
				<button className="btn btn-primary col-sm-3" type="submit">submit</button>
			</form>
		)
	}
})

export default LoginPage