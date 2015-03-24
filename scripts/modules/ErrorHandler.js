define([
], function () {

	var ErrorHandler = {

		report: function (error) {
			console.error(error.message);
		}
	}

	return ErrorHandler;
});