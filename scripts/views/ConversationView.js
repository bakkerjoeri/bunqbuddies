define([
	'backbone',
	'text!templates/conversation.html'
], function (Backbone, templateString) {

	var ConversationView = Backbone.View.extend({

		initialize: function () {
			this.template = _.template(templateString);
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (error, compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {

					if (_.isFunction(callback)) {
						callback(null);
					};
				});
			});
		},

		close: function () {
			this.stopListening();
		}
	});

	function getCompiledTemplate (model, template, callback) {
		var compiledTemplate = template({
			id: model.get('id')
		});

		callback(null, compiledTemplate);
	}

	return ConversationView;
});