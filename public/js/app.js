angular.module('boom', ['ngRoute']) // eslint-disable-line no-undef
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'view/home.html',
				controller: 'HomeController'
			})
			.when('/login', {
				templateUrl: 'view/login.html',
				controller: 'LoginController'
			})
			.when('/signup', {
				templateUrl: 'view/signup.html',
				controller: 'SignupController'
			})
			.when('/users/:id', {
				templateUrl: 'view/user.html',
				controller: 'UserController'
			});
	})
	.factory('auth', function($http, $location) {
		return new Promise((resolve, reject) => {
			if (!localStorage.accessToken)
				return reject('Not logged in.');

			return $http({
				method: 'POST',
				url: 'http://localhost:3030/authentication',
				headers: {
					'authorization': 'Bearer ' + localStorage.accessToken
				}
			}).then(function(res) {
				if (!res.data.accessToken) {
					return reject('Invalid session.');
				}

				return resolve(res.data.accessToken);
			}, function(err) {
				console.log(err); // eslint-disable-line no-console

				return reject(err);
			});
		});
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
	.controller('HomeController', ['$scope', '$location', 'nav', 'auth', function($scope, $location, nav, auth) {
		auth.then(token => localStorage.accessToken = token, err => $location.path('/login'));

		nav.updateProfile();
	}])
	.controller('LoginController', ['$scope', '$http', '$location', 'auth', function($scope, $http, $location, auth) {
		auth.then(token => $location.path('/'));

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
	.controller('SignupController', ['$scope', '$http', '$location', 'auth', function($scope, $http, $location, auth) {
		auth.then(token => $location.path('/'));

		$scope.signup = function(user) {
			if (user) {
				if (user.password !== user.password_again)
					$scope.password_unmatch = true;
				else
					$scope.password_unmatch = false;
				if (!user.password)
					$scope.password_required = true;
				else
					$scope.password_required = false;
				if (!user.password_again)
					$scope.password_again_required = true;
				else
					$scope.password_again_required = false;
				if (!user.user)
					$scope.user_required = true;
				else
					$scope.user_required = false;
				if (!user.email)
					$scope.email_required = true;
				else
					$scope.email_required = false;

				$http({
					method: 'post',
					url: 'http://localhost:3030/users',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						user: user.user,
						email: user.email,
						password: user.password
					}
				}).then(function(res) { // eslint-disable-line

				}, function(err) { // eslint-disable-line

				});
			} else {
				$scope.missing_all_fields = true;
			}
		};
	}])
	.controller('UserController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
		$http.get('http://localhost:3030/users/' + $routeParams.id).then(function(res) {
			if (res.data) {
				let user = res.data;
				if (!res.data.stats) {
					user.stats = {
						kills: 0,
						deaths: 0,
						bombs_placed: 0,
						powerups_used: 0,
						games_played: 0,
						wins: 0,
						losses: 0
					};
				}
				$scope.user = user;
			}
		}, function(err) {
			console.log(err); // eslint-disable-line no-console
		});
	}]);
