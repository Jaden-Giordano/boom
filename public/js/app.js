angular.module('boom', ['ngRoute']) // eslint-disable-line no-undef
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'view/home.html',
				controller: 'HomeController',
				resolve: 'auth'
			})
			.when('/login', {
				templateUrl: 'view/login.html',
				controller: 'LoginController',
				resolve: 'auth'
			})
			.when('/users/:id', {
				templateUrl: 'view/user.html',
				controller: 'UserController'
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
	.factory('nav', function($rootScope) {
		return {
			updateProfile: function() {
				if (localStorage.accessToken) {
					let data = localStorage.accessToken.split('.')[1];
					if (data) {
						let obj = JSON.parse(atob(data));
						if (obj) {
							$rootScope.user_id = obj.userId;
						}
					}
				}
			}
		};
	})
	.controller('HomeController', ['$scope', '$location', 'auth', 'nav', function($scope, $location, auth, nav) {
		if (!auth.accept())
			$location.path('/login');

		nav.updateProfile();
	}])
	.controller('LoginController', ['$scope', '$http', '$location', 'auth', function($scope, $http, $location, auth) {
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
	}])
	.controller('UserController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
		console.log($routeParams.id); // eslint-disable-line no-console

		$http.get('http://localhost:3030/users/' + $routeParams.id).then(function(res) {
			if (res.data)
				$scope.user = res.data;
		}, function(err) {
			console.log(err); // eslint-disable-line no-console
		});
	}]);
