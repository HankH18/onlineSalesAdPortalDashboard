import React from 'react'
import USERACTIONS from '../../userActions'
import User from '../../models/userModel.js'
import USERSTORE from '../../userStore'
import DATAACTIONS from '../../dataActions'
import DATASTORE from '../../dataStore'

var monthArray = [31,28,31,30,31,30,31,31,30,31,30,31]
var monthNameArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var d = new Date()
var m = d.getMonth()
var y = d.getFullYear()

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
		return(
			<nav className="navbar navbar-inverse navbar-fixed-top">
		      <div className="container-fluid">
		        <div className="navbar-header">
		          <a className="navbar-brand">Unify</a>
		        </div>
		        <div id="navbar" className="navbar-collapse collapse">
		          <ul className="nav navbar-nav navbar-right">
		            <li><a href="#data">Dashboard</a></li>
		            <li><a href="#linkData">Link Accounts</a></li>
		            <li><a href="#">Help</a></li>
		          </ul>
		          <SelectMonth handleSubmit={this.props.handleSubmit}/>
		        </div>
		      </div>
		    </nav>
		)
	}
})

var SelectMonth = React.createClass({
	render: function() {
		return(
			<form onSubmit={this.props.handleSubmit} className="navbar-form navbar-right">
				<select name="month" className='form-control'>
				    <option value='0'>Jan</option>
				    <option value='1'>Feb</option>
				    <option value='2'>Mar</option>
				    <option value='3'>Apr</option>
				    <option value='4'>May</option>
				    <option value='5'>Jun</option>
				    <option value='6'>Jul</option>
				    <option value='7'>Aug</option>
				    <option value='8'>Sep</option>
				    <option value='9'>Oct</option>
				    <option value='10'>Nov</option>
				    <option value='11'>Dec</option>
	  			</select>
	  			<select name="year" className='form-control'>
				    <option value='2017'>2017</option>
				    <option value='2016'>2016</option>
				    <option value='2015'>2015</option>
				    <option value='2014'>2014</option>
	  			</select>
	  			<button type="submit">View</button>
			</form>
		)
	}
})

export default Banner