import DATASTORE from './dataStore'
import $ from 'jquery'

const DATAACTIONS = {
	storeFbToken: function() {
		FB.getLoginStatus(function(userResponse) {
			var userToken = userResponse.authResponse.accessToken
			FB.api('/me/accounts', {access_token: userToken}, function(response) {
				var companyToken = response.data[1].access_token
				DATASTORE.set(companyToken, 'fbToken')
				DATAACTIONS.storeFb(companyToken)
			})
		})
	},

	storeAmazonKeys: function(obj) {
		DATASTORE.set(obj, 'amazonKeys')
		DATAACTIONS.storeAmazon()
	},

	storeFb: function(str) {
		FB.api('me/insights/page_impressions/day', {access_token: str}, function(response) {
			DATASTORE.set({pageImpressions: response.data[0].values}, 'fbData')
		})
		console.log(DATASTORE.data)
	},

	storeAmazon: function() {
		var requestKeys = DATASTORE.get('amazonKeys')
		$.getJSON('/proxy/reports', {
			accessKeyId: requestKeys.awsAccessKey,
      		secretAccessKey: requestKeys.secretAccessKey,
      		merchantId: requestKeys.sellerId,
		})
		.then(function(resp) {
			DATASTORE.set(resp.reports.result, 'amazonData')
			console.log('got amazon data')
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









