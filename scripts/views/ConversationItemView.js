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
					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		}
	});

	function getCompiledTemplate (model, template, callback) {
		console.log(model);

		var compiledTemplate = template({
			conversation: model.toJSON()
		});

		callback(compiledTemplate);
	}

	return ConversationListView;
});