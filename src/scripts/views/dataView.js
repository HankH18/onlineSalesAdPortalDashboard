import React from 'react'
import USERACTIONS from '../userActions'
import Banner from './components/navBarHeader'
import USERSTORE from '../userStore'
import DATAACTIONS from '../dataActions'
import DATASTORE from '../dataStore'
import ChartistGraph from 'react-chartist'


var DataPage = React.createClass({
	componentWillMount: function() {
		DATASTORE.on('dataUpdated', () => {
			this.setState(DATASTORE.data)
		})
	},
	componentWillUnmount: function() {
		DATASTORE.off('dataUpdated')
	},
	getInitialState: function() {
		return DATASTORE.data
	},
	getFbChartData: function() {
		var chartArray = []
		var inputDataArray = this.state.fbData.pageImpressions
		for (var i = 0; i < inputDataArray.length; i++) {
			var chartMonth = parseInt(inputDataArray[i].end_time.slice(5,7))
			var chartDay = parseInt(inputDataArray[i].end_time.slice(8,10))
			if (chartDay % 5 === 0) {
				chartArray.push({x: chartMonth + '/' + chartDay, 
					y: inputDataArray[i].value})
			} else {
				chartArray.push({x: '', y: inputDataArray[i].value})
			}
		}
		return chartArray
	},
	getAmazonChartData: function() {
		var monthArray = [31,28,31,30,31,30,31,31,30,31,30,31]
		var inputDataArray = this.state.amazonData
		var chartArray = []
		var monthDays = monthArray[parseInt(inputDataArray[0].PurchaseDate.slice(5,7))-1]
		for (var i = 0; i < monthDays; i++) {
			chartArray[i] = 0
		}
		for (var i = 0; i < inputDataArray.length; i++) {
			chartArray[parseFloat(inputDataArray[i].PurchaseDate.slice(8,10))-1] += parseFloat(inputDataArray[1].OrderTotal.Amount)
		}
		return chartArray
	},
	getFbDataTotal: function() {
		var dataTotal = 0
		var inputDataArray = this.state.fbData.pageImpressions
		for (var i = 0; i < inputDataArray.length; i++) {
			dataTotal += inputDataArray[i].value
		}
		return dataTotal
	},
	getAmazonSalesTotal: function() {
		var salesTotal = 0
		var arrayTally = 0
		var inputDataArray = this.state.amazonData
		for(var i = 0; i < inputDataArray.length; i ++) {
			if(inputDataArray[i].OrderTotal) {
				salesTotal += parseFloat(inputDataArray[i].OrderTotal.Amount)
				arrayTally ++
			}
		}
		console.log(arrayTally)
		return Math.floor(salesTotal)
	},
	render: function() {
		console.log(this.state)
		return(
			<div className='data-page-wrapper'>
				<Banner />
				<DisplayTotal
				getFbDataTotal={this.getFbDataTotal}
				getAmazonSalesTotal={this.getAmazonSalesTotal}
				/>
				<DisplayGraph 
				getFbChartData={this.getFbChartData}
				getAmazonChartData={this.getAmazonChartData}
				/>
			</div>
		)
	}
})

var DisplayTotal = React.createClass({
	render: function() {
		return(
			<div>
				<h3>Total Page Impressions:</h3>
				<h3>{this.props.getFbDataTotal()}</h3>
				<h3>Total Sales:</h3>
				<h3>${this.props.getAmazonSalesTotal()}</h3>
			</div>
		)
	}
})

var DisplayGraph = React.createClass({
	getChartData: function() {
		var chartData = this.props.getFbChartData()
		var amazonChartData = this.props.getAmazonChartData()
		var newSeries = []
		var simpleLineChartData = {
		  labels: [],
		  series: []
		}
		for (var i = 0; i < chartData.length; i ++) {
			simpleLineChartData.labels.push(chartData[i].x)
			newSeries.push(chartData[i].y)
		}
		simpleLineChartData.series.push(newSeries)
		simpleLineChartData.series.push(amazonChartData)
		console.log(simpleLineChartData)
		return simpleLineChartData
	},
	render: function() {
		var chartData = this.getChartData()
		var chartOptions = {
			low: 0,
			showArea: false
		}
		return(
			<div>
				<ChartistGraph className={'ct-chart'} data={chartData} type={'Line'} options={chartOptions}/>
			</div>
		)
	}
})




export default DataPage