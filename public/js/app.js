angular.module('boom', ['ngRoute']) // eslint-disable-line no-undef
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'view/home.html',
				controller: 'home',
				resolve: 'auth'
			})
			.when('/login', {
				templateUrl: 'view/login.html',
				controller: 'login',
				resolve: 'auth'
			})
			.when('/users/:id', {
				templateUrl: 'view/user.html',
				controller: 'user'
			});
	})
	.factory('auth', function($http) {
		return {
			accept: function() {
				if (!localStorage.accessToken)
					return false;

				return $http({
					method: 'POST',
					url: 'http://localhost:3030/authentication',
					headers: {
						'authorization': 'Bearer ' + localStorage.accessToken
					}
				}).then(function(res) {
					if (!res.data.accessToken)
						return false;

					return true;
				}, function(err) {
					console.log(err); // eslint-disable-line no-console

					return false;
				});
			}
		};
	})
	.controller('home', ['$scope', '$location', 'auth', function($scope, $location, auth) {
		if (!auth.accept())
			$location.path('/login');
	}])
	.controller('login', ['$scope', '$http', '$location', 'auth', function($scope, $http, $location, auth) {
		if (auth.accept())
			$location.path('/');

		$scope.login = function(user) {
			$http({
				method: 'POST',
				url: 'http://localhost:3030/authentication',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					strategy: 'local',
					user: user.user,
					password: user.password
				}
			}).then(function(res) {
				if (res.data && res.data.accessToken) {
					localStorage.accessToken = res.data.accessToken;
					$location.path('/');
				}
			}, function(err) {
				console.log('Unauthorized: ' + err); // eslint-disable-line no-console
			});
		};
	}]);
