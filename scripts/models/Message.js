define([
	'backbone',
	'moment'
], function (Backbone, moment) {

	var Message = Backbone.Model.extend({

		defaults: {
			id: 									new String(),
			senderId: 						new String(),
			message: 							new String(),
			timestamp: 						new moment()
		},

		initialize: function (options) {
			if (options !== undefined) {
				if (options.timestamp && moment(options.timestamp).isValid()) {
					this.set("timestamp", moment(options.timestamp + " +0000", "YYYY-MM-DD HH:mm:ss Z"));
				}
			}
		}

	});

	return Message;
});