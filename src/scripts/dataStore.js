import Backbone from 'backbone'

const DATASTORE = Object.assign({}, Backbone.Events, {
	data: {
		amazonKeys: {},
		amazonData: {},
		fbToken: '',
		fbData: {}
	},
	get: function(prop) {
		return this.data[prop]
	},
	set: function(newData, dataType) {
		this.data[dataType] = newData
		this.trigger('dataUpdated')
	}
})


export default DATASTORE