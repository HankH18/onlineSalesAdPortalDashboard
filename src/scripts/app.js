import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'
import init from './init'
import SyncAccountView from './views/syncAccountView'
import {DataPage, DisplayTable} from './views/dataView'
import LoadingPage from './views/loadingView'
import User from './models/userModel.js'


const app = function() {
	var PageRouter = Backbone.Router.extend({
		routes: {
			'data': 'showDataView',
			'table': 'showTableView',
			'linkData': 'showSyncAccountView',
			'*default': 'redirect'
		},
		redirect: function() {
			location.hash = 'linkData'
		},
		showDataView: function() {
			ReactDOM.render(<DataPage />, document.querySelector('.container'))
		},
		showTableView: function() {
			ReactDOM.render(<DisplayTable />, document.querySelector('.container'))
		},
		showSyncAccountView: function() {
			ReactDOM.render(<SyncAccountView />, document.querySelector('.container'))
		}
	})
	window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '619077844954087',
	      xfbml      : true,
	      cookie	 : true,
	      version    : 'v2.8'
	    });
	    FB.AppEvents.logPageView();
	    new PageRouter
		Backbone.history.start()
	  };
	  
	  (function(d, s, id){
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) {return;}
	    js = d.createElement(s); js.id = id;
	    js.src = "https://connect.facebook.net/en_US/sdk.js";
	    fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));
}

// x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..
// NECESSARY FOR USER FUNCTIONALITY. DO NOT CHANGE. 
export const app_name = init()
app()
// x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..