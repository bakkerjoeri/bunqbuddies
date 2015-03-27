define([
	'backbone',
	'text!templates/message.html',
	'scripts/modules/DataHandler'
], function (Backbone, templateString, DataHandler) {

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
			timestamp: model.get('timestamp').format('H:mm')
		});

		callback(null, compiledTemplate);
	}

	return MessagesView;
});