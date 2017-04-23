import Backbone from 'backbone'

const DATASTORE = Object.assign({}, Backbone.Events, {
	data: {
		amazonKeys: {},
		amazonData: [],
		fbToken: '',
		fbData: [],
		currentData: {
			amazonData: {},
			fbData: {}
		}
	},
	get: function(prop) {
		return this.data[prop]
	},
	set: function(newData, dataType) {
		this.data[dataType] = newData
		this.trigger('dataUpdated')
	},
	addData: function(newDataObj, dataType) {
		this.data[dataType].push(newDataObj)
		this.data.currentData[dataType] = newDataObj
		this.trigger('dataUpdated')
	},
	changeCurrentData: function(newDataObj) {
		this.data.currentData = newDataObj
		this.trigger('dataUpdated')
	},
	triggerUpdate: function() {
		this.trigger('dataUpdated')
	}
})


export default DATASTORE