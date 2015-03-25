define([
	'scripts/models/Message'
], function (Message) {

	var Messages = Backbone.Collection.extend({

		model: Message,

		// Make sure messages are sorted by date, ascending
		comparator: function (message) {
		  return -message.get("timestamp");
		}
	});

	return Messages;
});