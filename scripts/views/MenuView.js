define([
	'backbone',
	'scripts/models/AppState',
	'text!templates/menu.html',
	'scripts/modules/DataHandler',
	'scripts/views/ConversationListView'
], function (Backbone, AppState, templateString, DataHandler, ConversationListView) {

	var MenuView = Backbone.View.extend({

		events: {
			'click .button_new-conversation': 'onClickNewConversation'
		},

		initialize: function () {
			this.template = _.template(templateString);
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					addSubviews();

					that.listenTo(AppState, 'change:menuOpen', that.onMenuOpenStateChanged, that);

					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		},

		onClickNewConversation: function (e) {
			// Close menu
			AppState.toggleMenu(false);

			// Go to new conversation view
			App.Router.navigate('/new', true);
		},

		onMenuOpenStateChanged: function (state, open) {
			if (open) {
				this.$el.addClass('is-open');
			} else {
				this.$el.removeClass('is-open');
			}
		}
	});

	function getCompiledTemplate (template, callback) {
		var compiledTemplate = template({
			username: DataHandler.currentUser.get('name')
		});

		callback(compiledTemplate);
	}

	function addSubviews () {
		addConversationListView();
	}

	function addConversationListView () {
		new ConversationListView({
			el: '.view_menu-body'
		}).render();
	}

	return MenuView;
});