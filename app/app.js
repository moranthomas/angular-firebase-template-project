'use strict';


// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.register',
  'myApp.welcome',
  'myApp.addPost'
]).

config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    //config($routeProvider, $locationProvider) {  
    //-- ORIGINAL CODE -- I needed to add in $locationProvider to fix
    //Exclamation mark after hash (#!) in angularjs app


    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/register', {
            templateUrl: 'register/register.html',
            controller: 'RegisterCtrl',
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);
