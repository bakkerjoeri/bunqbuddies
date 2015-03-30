define([
	'backbone',
	'text!templates/message.html',
	'scripts/modules/DataHandler',
	'moment'
], function (Backbone, templateString, DataHandler, moment) {

	var MessagesView = Backbone.View.extend({

		events: {

		},

		initialize: function (options) {
			this.template = _.template(templateString);
			this.insertAt = options.insertAt;
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (error, compiledTemplate) {
				if (that.insertAt.afterId !== undefined && that.$el.find("#message-" + that.insertAt.afterId).length > 0) {
					that.$el.find("#message-" + that.insertAt.afterId).after(compiledTemplate).promise().done(finishedRendering);
				} else if (that.insertAt.beforeId !== undefined && that.$el.find("#message-" + that.insertAt.beforeId).length > 0) {
					that.$el.find("#message-" + that.insertAt.beforeId).before(compiledTemplate).promise().done(finishedRendering);
				} else {
					that.$el.prepend(compiledTemplate).promise().done(finishedRendering);
				}

				function finishedRendering () {
					if (_.isFunction(callback)) {
						callback(null);
					}
				}
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
			timestamp: model.getTimestampString(),
			byOwner: (DataHandler.currentUser.get('id') === model.get('senderId'))
		});

		callback(null, compiledTemplate);
	}

	return MessagesView;
});