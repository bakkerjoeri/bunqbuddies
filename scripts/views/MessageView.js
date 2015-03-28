define([
	'backbone',
	'text!templates/message.html',
	'scripts/modules/DataHandler',
	'moment'
], function (Backbone, templateString, DataHandler, moment) {

	var MessagesView = Backbone.View.extend({

		events: {

		},

		initialize: function () {
			this.template = _.template(templateString);
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (error, compiledTemplate) {
				that.$el.append(compiledTemplate);
			});
		},

		close: function () {
			this.undelegateEvents();
		},

		remove: function () {
			this.close();
			this.$el.remove();
		}
	});

	function getCompiledTemplate(model, template, callback) {
		var compiledTemplate = template({
			messageId: model.get('id'),
			senderName: DataHandler.getUser(model.get('senderId')).get('name'),
			message: model.get('message'),
			timestamp: getTimestampString(model.get('timestamp'))
		});

		callback(null, compiledTemplate);
	}

	function getTimestampString (timestamp) {
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

	return MessagesView;
});