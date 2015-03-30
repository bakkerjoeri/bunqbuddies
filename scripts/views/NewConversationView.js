define([
	'backbone',
	'scripts/models/AppState',
	'text!templates/newConversation.html',
	'scripts/modules/DataHandler',
	'scripts/modules/ErrorHandler',
	'scripts/collections/Users'
], function (Backbone, AppState, templateString, DataHandler, ErrorHandler, Users) {

	var NewConversationView = Backbone.View.extend({

		events: {
			'click .button_cancel': 'onClickCancel',
			'click .selectable-user': 'onClickUser',
			'click .button_create-conversation': 'onClickCreate'
		},

		initialize: function () {
			this.template = _.template(templateString);
			this.selectedUsers = new Users();
		},

		close: function () {
			this.$el.undelegate('click');
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (error, compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {

					that.listenTo(that.selectedUsers, 'add remove', that.changeSelectedUsers, that);

					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		},

		onClickCancel: function (event) {
			if (!$(event.target).hasClass('is-disabled')) {
				// Open menu
				AppState.toggleMenu(true);

				// Navigate to home screen
				App.Router.navigate('/', true);
			}
		},

		onClickUser: function (event) {
			var userId = event.target.dataset.userId;

			// If element is 'checked', select the user. Otherwise, deselect the user.
			if ($(event.target).is(':checked')) {
				this.toggleUserSelected(userId, true);
			} else {
				this.toggleUserSelected(userId, false);
			}
		},

		onClickCreate: function (event) {
			if (!$(event.target).hasClass('is-disabled') && !$(event.target).hasClass('is-busy')) {
				this.createConversation();
			}
		},

		createConversation: function () {
			var that = this;

			this.toggleCreateButtonBusy(true);

			var participants = new Users(this.selectedUsers.toArray());
			participants.add(DataHandler.currentUser);
			var participantIds = participants.pluck('id');

			DataHandler.createConversation(participantIds, this.getConversationName(), function (error, response) {
				if (!error) {
					var conversationId = response.id;
					DataHandler.updateConversations(function (error) {
						// Regardless of errors, the create button is no longer busy.
						that.toggleCreateButtonBusy(false);

						if (!error) {
							// Close menu
							AppState.toggleMenu(false);

							// Navigate to the newly created conversation
							App.Router.navigate('/conversation/' + conversationId, true);
						} else {
							ErrorHandler.report(error);
						}
					});
				} else {
					ErrorHandler.report(error);
				}
			});
		},

		toggleUserSelected: function (userId, isSelected) {
			if (isSelected) {
				this.selectedUsers.add(DataHandler.getUser(userId));
			} else {
				this.selectedUsers.remove(DataHandler.getUser(userId));
			}
		},

		changeSelectedUsers: function (model, collection) {
			// If at least 1 user is selected to participate in this conversation, enable the create button.
			if (this.selectedUsers.length > 0) {
				this.toggleCreateButtonDisabled(false);
			} else {
				this.toggleCreateButtonDisabled(true);
			}

			// If 2 or more other users will participate in this conversation, show group name input.
			if (this.selectedUsers.length > 1) {
				this.toggleGroupnameInputHidden(false);
			} else {
				this.toggleGroupnameInputHidden(true);
			}
		},

		toggleGroupnameInputHidden: function (isHidden) {
			var elGroupnameInput = this.$el.find('.input_groupname');

			// If no isHidden is given, switch the current hidden state.
			if (isHidden === undefined) {
				isHidden = !elGroupnameInput.hasClass('is-hidden');
			}

			// Set the is-hidden class accordingly.
			if (isHidden) {
				elGroupnameInput.addClass('is-hidden');
			} else {
				elGroupnameInput.removeClass('is-hidden');
			}
		},

		toggleCreateButtonDisabled: function (isDisabled) {
			var elCreateButton = this.$el.find('.button_create-conversation');

			// If no isDisabled is given, switch the current disabled state.
			if (isDisabled === undefined) {
				isDisabled = !elCreateButton.hasClass('is-disabled');
			}

			// Set the is-disabled class accordingly.
			if (isDisabled) {
				elCreateButton.addClass('is-disabled');
			} else {
				elCreateButton.removeClass('is-disabled');
			}
		},

		toggleCreateButtonBusy: function (isBusy) {
			var elCreateButton = this.$el.find('.button_create-conversation');

			// If no isBusy is given, switch the current busy state.
			if (isBusy === undefined) {
				isBusy = !elCreateButton.hasClass('is-busy');
			}

			// Set the is-busy class accordingly.
			if (isBusy) {
				elCreateButton.addClass('is-busy');
			} else {
				elCreateButton.removeClass('is-busy');
			}
		},

		getConversationName: function () {
			var elGroupnameInput = this.$el.find('.input_groupname');

			if (elGroupnameInput.hasClass('is-hidden')) {
				return '';
			} else {
				return elGroupnameInput.val();
			}
		}
	});

	function getCompiledTemplate (model, template, callback) {
		var compiledTemplate = template({
			selectableUsers: DataHandler.getOtherUsers().toJSON()
		});

		callback(null, compiledTemplate);
	}

	return NewConversationView;

});