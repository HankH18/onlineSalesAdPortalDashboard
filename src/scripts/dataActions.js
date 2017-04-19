import DATASTORE from './dataStore'
import $ from 'jquery'

var monthArray = [31,28,31,30,31,30,31,31,30,31,30,31]
var d = new Date()
var m = d.getMonth()
var y = d.getFullYear()
var day = d.getDate()


const DATAACTIONS = {
	storeFbToken: function() {
		FB.getLoginStatus(function(userResponse) {
			var userToken = userResponse.authResponse.accessToken
			FB.api('/me/accounts', {access_token: userToken}, function(response) {
				var companyToken = response.data[1].access_token
				DATASTORE.set(companyToken, 'fbToken')
				DATAACTIONS.storeFb(m, y)
			})
		})
	},

	storeAmazonKeys: function(obj) {
		DATASTORE.set(obj, 'amazonKeys')
		DATAACTIONS.storeAmazon(m, y)
	},

	getExistingData: function(m, y) {
		var dataArray = DATASTORE.data.amazonData
		for (var i = 0; i < dataArray.length; i ++) {
			if (dataArray[i].month == m && dataArray[i].year == y) {
				DATASTORE.data.currentData.amazonData = dataArray[i]
				DATASTORE.data.currentData.fbData = DATASTORE.data.fbData[i]
				return true
			}
		}
		return false
	},

	storeFb: function(month, year) {
		var requestToken = DATASTORE.get('fbToken')
		var totalArray = []
		var paidArray = []
		var unpaidArray = []
		if (DATAACTIONS.getExistingData(month, year)) {
			DATAACTIONS.getExistingData(month, year)
			return
		}
		if (month != 11) {
			FB.api('me/insights/page_impressions_by_paid_non_paid_unique?period=day&since=' + year + '-' + (month+1) + '-' + '01&until=' + year + '-' + (month+2) + '-' + '01', {access_token: requestToken}, 
				function(response) {
					var arrayLength
					if (month == m) {
						arrayLength = day
					} else {
						arrayLength = response.data[0].values.length
					}
					for (var i = 0; i < arrayLength; i ++) {
						var dailyValues = response.data[0].values[i].value
						totalArray.push(dailyValues.total)
						paidArray.push(dailyValues.paid)
						unpaidArray.push(dailyValues.unpaid)
					}
					var dataObj = {
						month: month,
						year: year,
						totalImpressions: totalArray,
						paidImpressions: paidArray,
						unpaidImpressions: unpaidArray
					}
					DATASTORE.addData(dataObj, 'fbData')
				}
			)
		} else {
			FB.api('me/insights/page_impressions_by_paid_non_paid_unique?period=day&since=' + year + '-' + (month+1) + '-' + '01&until=' + (year+1) + '-01-01', {access_token: requestToken}, 
				function(response) {
					var arrayLength
					if (month == m) {
						arrayLength = day
					} else {
						arrayLength = response.data[0].values.length
					}
					for (var i = 0; i < response.data[0].values.length; i ++) {
						var dailyValues = response.data[0].values[i].value
						totalImpressions.push(dailyValues.total)
						paidImpressions.push(dailyValues.paid)
						unpaidImpressions.push(dailyValues.unpaid)
					}
					var dataObj = {
						month: month,
						year: year,
						totalImpressions: totalImpressions,
						paidImpressions: paidImpressions,
						unpaidImpressions: unpaidImpressions
					}
					DATASTORE.addData(dataObj, 'fbData')
				}
			)
		}
	},

	storeAmazon: function(month, year) {
		var requestKeys = DATASTORE.get('amazonKeys')
		if (DATAACTIONS.getExistingData(month, year)) {
			DATAACTIONS.getExistingData(month, year)
			return
		}
		$.getJSON('/proxy/reports', {
			accessKeyId: requestKeys.awsAccessKey,
      		secretAccessKey: requestKeys.secretAccessKey,
      		merchantId: requestKeys.sellerId,
      		month: month,
      		year: year
		})
		.then(function(resp) {
			var result = resp.reports.result
			var salesArray = []
			var arrayLength
			if (month == m) {
				arrayLength = day
			} else {
				arrayLength = monthArray[month]
			}
			for (var i = 0; i < arrayLength; i++) {
				salesArray[i] = 0
			}
			for (var i = 0; i < result.length; i++) {
				if (result[i].OrderTotal) {
					var indexDay = parseInt(result[i].PurchaseDate.slice(8,10))-1
					var saleAmount = parseFloat(result[i].OrderTotal.Amount)
					salesArray[indexDay] += saleAmount
				}
			}
			var dataObj = {
				month: month,
				year: year,
				dailySales: salesArray
			}
			DATASTORE.addData(dataObj, 'amazonData')
			if (location.hash != 'data') {
				location.hash = 'data'
			}
		})
	},

	getFb: function() {
		DATASTORE.get(fbData)
	},

	getAmazon: function() {
		DATASTORE.get(amazonData)
	}
}

export default DATAACTIONS









