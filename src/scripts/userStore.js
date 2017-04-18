import Backbone from 'backbone'
import User from './models/userModel'


const USERSTORE = Object.assign({}, Backbone.Events, {
	data: {
		user: new User
	},
	get: function(prop) {
		if (this.data[prop] === 'undefined') {
			throw new Error(prop + "doesn't exist in the store")
		}
		return this.data[prop]
	},
	set: function(attrs) {
		this.data = Object.assign(this.data,attrs)
		this.trigger('dataUpdated')
	}
})


export default USERSTORE