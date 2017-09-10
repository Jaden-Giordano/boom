angular.module('boom', ['ngRoute']) // eslint-disable-line no-undef
	.config($routeProvider => {
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
	.factory('util', ['$http', '$rootScope', ($http, $rootScope) => {
		return {
			verify: () => {
				return new Promise((resolve, reject) => {
					if (!localStorage.accessToken)
						return reject('Not logged in.');

					return $http({
						method: 'POST',
						url: 'http://localhost:3030/utilentication',
						headers: {
							'utilorization': 'Bearer ' + localStorage.accessToken
						}
					}).then(res => {
						if (!res.data.accessToken) {
							delete localStorage.accessToken;

							return reject('Invalid session.');
						}

						localStorage.accessToken = res.data.accessToken;

						return resolve(res.data.accessToken);
					}, err => {
						delete localStorage.accessToken;

						return reject(err);
					});
				});
			},
			updateProfile: () => {
				if (localStorage.accessToken) {
					if (let data = localStorage.accessToken.split('.')[1]) {
						if (let obj = JSON.parse(atob(data))) {
							$rootScope.user_id = obj.userId;
						}
					}
				}
			}
		};
	}])
	.controller('HomeController', ['$scope', '$location', 'nav', 'util', ($scope, $location, nav, util) => {
		return util.verify().then(() => {
			return nav.updateProfile();
		}, () => $location.path('/login'));
	}])
	.controller('LoginController', ['$scope', '$http', '$location', 'util', ($scope, $http, $location, util) => {
		util.verify().then(() => $location.path('/'), () => {
			$scope.login = user => {
				$http({
					method: 'POST',
					url: 'http://localhost:3030/utilentication',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						strategy: 'local',
						user: user.user,
						password: user.password
					}
				}).then(res => {
					if (res.data && res.data.accessToken) {
						localStorage.accessToken = res.data.accessToken;
						$location.path('/');
					}
				}, err => {
					console.log('Unutilorized'); // eslint-disable-line no-console
				});
			};
		});
	}])
	.controller('SignupController', ['$scope', '$http', '$location', 'util', ($scope, $http, $location, util) => {
		util.verify().then(token => $location.path('/'), () => {
			$scope.signup = (user) => {
				if (user) {
					$scope.password_unmatch = user.password !== user.password_again;
					$scope.password_required = !user.password;
					$scope.password_again_required = !user.password_again;
					$scope.user_required = !user.user;
					$scope.email_required = !user.email;

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
					}).then(() => {}, err => { // eslint-disable-line

					});
				} else {
					$scope.missing_all_fields = true;
				}
			};
		});
	}])
	.controller('UserController', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
		$http.get('http://localhost:3030/users/' + $routeParams.id).then(res => {
			let user = res.data;
			if (user) {
				if (!user.stats) {
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
		}, err => console.log(err)); // eslint-disable-line no-console);
	}]);
