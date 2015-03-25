define([
	'backbone',
	'text!templates/conversationItem.html'
], function (Backbone, templateString) {

	var ConversationListView = Backbone.View.extend({

		initialize: function () {
			this.template = _.template(templateString);
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (compiledTemplate) {
				that.$el.append(compiledTemplate).promise().done(function () {

					that.bindProperty(that.model, 'numberOfNewMessages', '#conversation-' + that.model.get('id') + ' .badge-new-messages');
					that.bindProperty(that.model, 'messages', '#conversation-' + that.model.get('id') + ' .conversation-item-latest-message', function(model, property) {
						return model.get(property).first().get('message');
					});

					if (_.isFunction(callback)) {
						return callback(null);
					}
				});
			});
		},

		bindProperty: function (model, property, selector, parser) {
			var that = this;

			if (parser === undefined) {
				parser = function (property) {
					return model.get(property);
				}
			}

			model.on('change:' + property, function () {
				that.$el.find(selector).text(parser(model, property));
			});
		}
	});

	function getCompiledTemplate (model, template, callback) {
		var compiledTemplate = template({
			conversation: model.toJSON()
		});

		callback(compiledTemplate);
	}

	return ConversationListView;
});