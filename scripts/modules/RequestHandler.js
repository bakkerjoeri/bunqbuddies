define([
	'jquery'
], function ($) {
	var host = "http://assignment.bunq.com";

	function performGet (route, callback) {
		var request = $.ajax({
			url: host + route,
			method: 'GET'
		});

		request.done(function (data, status, xhr) {
			callback(xhr, data);
		});

		request.fail(function (xhr, status, error) {
			callback(xhr);
		});
	}

	function performPost (route, payload, callback) {
		console.log(payload);

		var request = $.ajax({
			url: host + route,
			method: 'POST',
			data: payload,
			dataType: 'json'
		});

		request.done(function (data, status, xhr) {
			callback(xhr, data);
		});

		request.fail(function (xhr, status, error) {
			callback(xhr);
		});
	}

	function performPut (route, payload, callback) {
		var request = $.ajax({
			url: host + route,
			method: 'PUT',
			data: payload,
			dataType: 'json'
		});

		request.done(function (data, status, xhr) {
			callback(xhr, data);
		});

		request.fail(function (xhr, status, error) {
			callback(xhr);
		});
	}

	var CallHandler = {

		getUsers: function (callback) {
			var route = '/users';

			performGet(route, callback);
		},

		getUser: function (userId, callback) {
			var route = '/user/' + userId;

			performGet(route, callback);
		},

		getConversation: function (conversationId, callback) {
			var route = '/conversation/' + conversationId;

			performGet(route, callback);
		},

		getConversationsOfUser: function (userId, callback) {
			var route = '/conversation/user/' + userId;

			performGet(route, callback);
		},

		getLastSeen: function (conversationId, userId, callback) {
			var route = '/conversation/' + conversationId + '/lastseen/' + userId;

			performGet(route, callback);
		},

		getNewMessagesSinceMessage: function (conversationId, lastMessageId, callback) {
			var route = '/conversation/' + conversationId + '/new/' + lastMessageId;

			performGet(route, callback);
		},

		getLimitedMessages: function (conversationId, limit, offset, callback) {
			var route = '/conversation/' + conversationId + '/message/limited?limit=' + limit + '&offset=' + offset;

			performGet(route, callback);
		},

		postMessage: function (conversationId, senderId, message, callback) {
			var route = '/conversation/' + conversationId + '/message/send';
			var payload = {
				message: message,
				senderId: senderId
			}

			performPost(route, payload, callback);
		},

		createPersonalConversation: function (userIds, callback) {
			var route = '/conversation/personal';
			var payload = {
				users: userIds.join(',')
			}

			performPost(route, payload, callback);
		},

		createGroupConversation: function (userIds, groupName, callback) {
			var route = '/conversation/group';
			var payload = {
				users: userIds.join(','),
				name: groupName
			}

			performPost(route, payload, callback);
		},

		updateLastSeen: function (conversationId, userId, callback) {
			var route = '/conversation/' + conversationId + '/seen/' + userId;

			performPut(route, {}, callback);
		}
	}

	return RequestHandler;
});