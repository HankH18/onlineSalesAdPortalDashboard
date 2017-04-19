import React from 'react'
import USERACTIONS from '../userActions'
import Banner from './components/navBarHeader'
import USERSTORE from '../userStore'
import DATAACTIONS from '../dataActions'
import DATASTORE from '../dataStore'

var LoadingPage = React.createClass({
	render: function() {
		return(
			<div className='loading-page-wrapper'>
				<Banner />
				<img src='http://loading.io/loader/?use=eyJzaXplIjo2MCwic3BlZWQiOjEsImNiayI6IiNmZmZmZmYiLCJjMSI6IiMwMGIyZmYiLCJjMiI6IjEyIiwiYzMiOiI3IiwiYzQiOiIyMCIsImM1IjoiNSIsImM2IjoiMzAiLCJ0eXBlIjoiZGVmYXVsdCJ9'/>
			</div>
		)
	}
})

export default LoadingPage