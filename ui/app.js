// eslint-disable-next-line no-undef
var app = angular.module('cmt-application', ['ngRoute']);

var global = {
	// URL for backend service listening at :5000
	url: 'http://127.0.0.1:5000',
	username: 'test',
};

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: './components/article.html',
			controller: 'comments-controller',
			title: 'Article | Discuss',
		})
		.when('/questions', {
			templateUrl: './components/article.html',
			controller: 'comments-controller',
			title: 'About',
		})
		.when('/contact', {
			templateUrl: './components/contact.html',
			title: 'Contact Info',
		});
});

app.controller('comments-controller', function($scope,$location,$rootScope,$http) {
	$scope.comment = '';
	$scope.name = '';
	$scope.submitComment = function() {
		if ($scope.comment.length !== 0 && $scope.name.length !== 0) {
			let date = new Date();
			let time = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
			time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ' + time;
			$http({
				url: global.url + '/post-comment',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: 'comment=' + $scope.comment + '&name=' + $scope.name + '&time=' + time
			}).then(resp => {
				let res = resp.data;
				// sort in decending order
				res.sort((a, b) => {
					return b['id']-a['id'];
				});
				$scope.comments = res;
				$scope.comment = '';
				$scope.name = '';
			});
		} else {
			alert('Name or Comment field is empty.');
		}
	};

	$scope.upvoteComment = function(id) {
		console.log('id upvote is ', id);
		$http({
			url: global.url + '/upvote-comment',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'id=' + id
		}).then(resp => {
			let res = resp.data;
			res.sort((a, b) => {
				return b['id']-a['id'];
			});
			$scope.comments = res;
		});
	};

	$scope.downvoteComment = function(id) {
		$http({
			url: global.url + '/downvote-comment',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'id=' + id
		}).then(resp => {
			let res = resp.data;
			res.sort((a, b) => {
				return b['id']-a['id'];
			});
			$scope.comments = res;
		});
	};

	$scope.getComments = function() {
		$http({
			url: global.url + '/comments',
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(resp => {
			let res = resp.data;
			res.sort((a, b) => {
				return b['id']-a['id'];
			});
			$scope.comments = res;
		});
	};
});