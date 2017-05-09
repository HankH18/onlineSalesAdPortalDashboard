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

export var DataPage = React.createClass({
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
	},
	render: function() {
		return(
			<div>
				<Banner
				handleSubmit={this.handleSubmit}/>
				<div className="container-fluid">
				    <div className="row">
				        <div className="col-sm-3 col-md-2 sidebar">
				            <ul className="nav nav-sidebar">
				            	<li className="active"><a href="#data">Overview <span className="sr-only">(current)</span></a></li>
				            	<li><a href="#table">Table Display</a></li>
				            </ul>
						</div>
						<div className="col-md-10 main">
	    					<h1 className="page-header">Dashboard {monthNameArray[this.state.fbData.month]} {this.state.fbData.year}</h1>
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
						</div>
				    </div>
				</div>
			</div>
		)
	}
})

var DisplayTotal = React.createClass({
	render: function() {
		return(
			<div className="row placeholders dataPoints">
       			<div className="col-xs-6 col-sm-3 placeholder dataNumber">
					<h3 className="img-responsive">{this.props.getTotalFbImpressions()}</h3>
					<h4>Total Page Impressions</h4>
				</div>
				<div className="col-xs-6 col-sm-3 placeholder dataNumber">
					<h3 className="img-responsive">{this.props.getPercentPaidImpressions()}%</h3>
					<h4>Percent of Impressions from Sponsored Content</h4>
				</div>
				<div className="col-xs-6 col-sm-3 placeholder dataNumber">
					<h3 className="img-responsive">${this.props.getAmazonSalesTotal()}</h3>
					<h4>Total Sales</h4>
				</div>
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
				<div className='data-chart'>
					<p className='chart-title'><span className="darkBlue">Facebook Impressions</span> V. <span className="red">Overall Sales</span></p>
					<ChartistGraph className={'ct-chart'} data={chartData1} type={'Line'} options={chartOptions1}/>
				</div>
				<div className='data-chart'>
					<p className='chart-title'>Facebook Impressions: <span className="darkBlue">Total</span> V. <span className="lightBlue">Sponsored</span></p>
					<ChartistGraph className={'ct-chart'} data={chartData2} type={'Bar'} options={chartOptions2}/>
				</div>
			</div>
		)
	}
})

export var DisplayTable = React.createClass({
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
	fillTable: function() {
		var rows = []
		for (var i = 0; i < this.state.fbData.totalImpressions.length; i ++) {
			rows.push({
				id: (i+1),
				date: monthNameArray[this.state.fbData.month] + '-' + (i+1) + '-' + this.state.fbData.year,
				sales: '$' + Math.floor(this.state.amazonData.dailySales[i]),
				fbImpressionsTotal: this.state.fbData.totalImpressions[i],
				fbImpressionsPaid: this.state.fbData.paidImpressions[i]
			})
		}
		return rows
	},
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
	},
	render: function() {
		return(
			<div>
				<Banner
				handleSubmit={this.handleSubmit}/>
				<div className="container-fluid">
				    <div className="row">
				        <div className="col-md-2 sidebar">
				            <ul className="nav nav-sidebar">
				            	<li><a href="#data">Overview</a></li>
				            	<li className="active"><a href="#table">Table Display <span className="sr-only">(current)</span></a></li>
				            </ul>
				        </div>
			            <div className="col-md-10 main">
	    					<h1 className="page-header">Table View {monthNameArray[this.state.fbData.month]} {this.state.fbData.year}</h1>
	    					<div className="table-responsive">
								<BootstrapTable data={this.fillTable()} striped={true} hover={true}>
								    <TableHeaderColumn dataField="date" isKey={true} dataAlign="center" dataSort={true}>Date</TableHeaderColumn>
								    <TableHeaderColumn dataField="sales">Total Daily Sales</TableHeaderColumn>
								    <TableHeaderColumn dataField="fbImpressionsTotal">Total Facebook Impressions</TableHeaderColumn>
								    <TableHeaderColumn dataField="fbImpressionsPaid">Sponsored Facebook Impressions</TableHeaderColumn>
								</BootstrapTable>
							</div>
						</div>
				    </div>
				</div>
			</div>
		)
	}
})


