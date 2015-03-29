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
		},

		getTimestampString: function () {
			var timestamp = this.get('timestamp');
			var formatString = 'DD/MM/YY';

			if (timestamp.isAfter(moment().startOf('year'))) {
				formatString = 'DD/MM';
			}

			if (timestamp.isAfter(moment().subtract(7, 'days').startOf('day'))) {
				formatString = '[Last] dddd';
			}

			if (timestamp.isAfter(moment().startOf('day'))) {
				formatString = 'H:mm';
			}
			
			return timestamp.format(formatString);
		}

	});

	return Message;
});