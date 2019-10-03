var app = angular.module('cmt-application', ['ngRoute']);

var global = {
    // URL for backend service listening at :5000
    url:'http://127.0.0.1:5000',
    username: 'test',
};

app.config(function($routeProvider,$locationProvider) {
    $routeProvider
    .when("/",{
        templateUrl:'./components/article.html',
        controller:'general-controller',
        title:'Login | SignUp',
    })
});

app.controller('general-controller', function($scope,$location,$rootScope,$http) {
    console.log('general conreoller called')
});