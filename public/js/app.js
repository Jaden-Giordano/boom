angular.module('boom', ['ngRoute']) // eslint-disable-line no-undef
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'view/home.html'
			})
			.when('/login', {
				templateUrl: 'view/login.html',
				controller: 'login'
			});
	})
	.controller('login', function() {
	});
