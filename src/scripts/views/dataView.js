import React from 'react'
import USERACTIONS from '../userActions'
import Banner from './components/navBarHeader'
import USERSTORE from '../userStore'
import DATAACTIONS from '../dataActions'
import DATASTORE from '../dataStore'
import ChartistGraph from 'react-chartist'

var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

var monthArray = [31,28,31,30,31,30,31,31,30,31,30,31]
var monthNameArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var d = new Date()
var m = d.getMonth()
var y = d.getFullYear()
var availableYearsArray = []
var setAvailableYears = function(currentYear) {
	for (var i = 2014; i <= y; i ++) {
		availableYearsArray.push(i)
	}
}
setAvailableYears(y)
//var glanceViewVisible = true
//var visible = {display: 'inline-block'}
//var invisible = {display: 'none'}

var DataPage = React.createClass({
	componentWillMount: function() {
		DATASTORE.on('dataUpdated', () => {
			console.log('now what is it in the event handler?')
			console.log(DATASTORE.data.currentData)
			this.setState(DATASTORE.data.currentData)
		})
	},
	componentWillUnmount: function() {
		DATASTORE.off('dataUpdated')
	},
	getInitialState: function() {
		return DATASTORE.data.currentData
	},
	getNewFbData: function(month, year) {
		DATAACTIONS.storeFb(month, year)
	},
	getNewAmazonData: function(month, year) {
		DATAACTIONS.storeAmazon(month, year)
	},
	getChartRange: function() {
		var chartLabels = []
		for (var i = 0; i < this.state.fbData.totalImpressions.length; i ++) {
			if (i % 3 === 0 || i === 0) {
				chartLabels.push((i+1) + '/' + this.state.fbData.year)
			} else {
				chartLabels.push('')
			}
		}
		return chartLabels
	},
	getTotalFbImpressions: function() {
		var totalImpressions = 0
		for (var i = 0; i < this.state.fbData.totalImpressions.length; i ++) {
			totalImpressions += this.state.fbData.totalImpressions[i]
		}
		return totalImpressions
	},
	getPercentPaidImpressions: function() {
		var totalImpressions = this.getTotalFbImpressions()
		var paidImpressions = 0
		for (var i = 0; i < this.state.fbData.paidImpressions.length; i ++) {
			paidImpressions += this.state.fbData.paidImpressions[i]
		}
		var percentPaidImpressions = (paidImpressions/totalImpressions) * 100
		return Math.floor(percentPaidImpressions)
	},
	getAmazonSalesTotal: function() {
		var salesTotal = 0
		for(var i = 0; i < this.state.amazonData.dailySales.length; i ++) {
			salesTotal += this.state.amazonData.dailySales[i]
		}
		return Math.floor(salesTotal)
	},
	/*changeTabs: function(tabNumClicked) {
		if (tabNumClicked === 1) {
			glanceViewVisible = true
		} else if (tabNumClicked === 2) {
			glanceViewVisible = false
		}
	},*/
	render: function() {
		console.log(this.state)
		console.log(this.state.fbData.month)
		console.log(this.state.fbData.year)
		return(
			<div className='data-page-wrapper'>
				<Banner />
				<SelectMonth
				getNewAmazonData={this.getNewAmazonData}
				getNewFbData={this.getNewFbData}
				fbData={this.state.fbData}/>
				{/*<PageTabs
				changeTabs={this.changeTabs}/>*/}
				<DisplayTotal
				amazonData={this.state.amazonData}
				fbData={this.state.fbData}
				getTotalFbImpressions={this.getTotalFbImpressions}
				getPercentPaidImpressions={this.getPercentPaidImpressions}
				getAmazonSalesTotal={this.getAmazonSalesTotal}
				/>
				<DisplayGraph 
				amazonData={this.state.amazonData}
				fbData={this.state.fbData}
				getChartRange={this.getChartRange}
				/>
				<DisplayTable
				amazonData={this.state.amazonData}
				fbData={this.state.fbData}
				/>
			</div>
		)
	}
})

var SelectMonth = React.createClass({
	handleSubmit: function(eventObj) {
		eventObj.preventDefault()
		var formEl = eventObj.target
		var monthSubmit = parseInt(formEl.month.value)
		var yearSubmit = parseInt(formEl.year.value)
		if (yearSubmit === y && monthSubmit > m) {
			alert('Please request a month which has already taken place')
		} else {
			DATAACTIONS.storeFb(monthSubmit, yearSubmit)
			DATAACTIONS.storeAmazon(monthSubmit, yearSubmit)
		}

		formEl.reset()
	},
	render: function() {
		return(
			<form onSubmit={this.handleSubmit}>
				<select name="month" default={this.props.fbData.month}>
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
	  			<select name="year" default={this.props.fbData.year}>
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

/*var PageTabs = React.createClass({
	render: function() {
		var unselectedStyle = {
			color: 'black'
		}
		var selectedStyle = {
			color: 'red'
		}
		return(	
			<ul className='tabs nav'>
				<li className='nav-item tab1' 
				onClick={this.props.changeTabs(1)}
				style={glanceViewVisible ? unselectedStyle : selectedStyle}>
				Data At a Glance
				</li>
				<li className='nav-item tab2'  
				onClick={this.props.changeTabs(2)}
				style={glanceViewVisible ? selectedStyle : unselectedStyle}>
				Table View
				</li>
			</ul>
		)
	}
})*/

var DisplayTotal = React.createClass({
	render: function() {
		return(
			<div>
				<h3>Total Page Impressions:</h3>
				<h3>{this.props.getTotalFbImpressions()}</h3>
				<h3>Percent of Impressions from Sponsored Content:</h3>
				<h3>{this.props.getPercentPaidImpressions()}%</h3>
				<h3>Total Sales:</h3>
				<h3>${this.props.getAmazonSalesTotal()}</h3>
			</div>
		)
	}
})

var DisplayGraph = React.createClass({
	render: function() {
		var chartData1 = {
			labels: this.props.getChartRange(),
			series: [this.props.fbData.totalImpressions, this.props.amazonData.dailySales]
		}
		var chartOptions1 = {
			low: 0,
			showArea: false,
			width: 800,
			height: 400
		}
		var chartOptions2 = {
			low: 0,
			width: 800,
			height: 400,
			seriesBarDistance: 10
		}
		var chartData2 = {
			labels: this.props.getChartRange(),
			series: [this.props.fbData.totalImpressions, this.props.fbData.paidImpressions]
		}
		return(
			<div>
				<div>
					<ChartistGraph className={'ct-chart'} data={chartData1} type={'Line'} options={chartOptions1}/>
				</div>
				<div>
					<ChartistGraph className={'ct-chart'} data={chartData2} type={'Bar'} options={chartOptions2}/>
				</div>
			</div>
		)
	}
})

var DisplayTable = React.createClass({
	fillTable: function() {
		var rows = []
		for (var i = 0; i < this.props.fbData.totalImpressions.length; i ++) {
			rows.push({
				id: (i+1),
				date: monthNameArray[this.props.fbData.month] + '-' + (i+1) + '-' + this.props.fbData.year,
				sales: '$' + this.props.amazonData.dailySales[i],
				fbImpressionsTotal: this.props.fbData.totalImpressions[i],
				fbImpressionsPaid: this.props.fbData.paidImpressions[i]
			})
		}
		return rows
	},
	render: function() {
		return(
			<BootstrapTable data={this.fillTable()} striped={true} hover={true}>
			    <TableHeaderColumn dataField="date" isKey={true} dataAlign="center" dataSort={true}>Date</TableHeaderColumn>
			    <TableHeaderColumn dataField="sales">Total Daily Sales</TableHeaderColumn>
			    <TableHeaderColumn dataField="fbImpressionsTotal">Total Facebook Impressions</TableHeaderColumn>
			    <TableHeaderColumn dataField="fbImpressionsPaid">Sponsored Facebook Impressions</TableHeaderColumn>
			</BootstrapTable>
		)
	}
})









export default DataPage