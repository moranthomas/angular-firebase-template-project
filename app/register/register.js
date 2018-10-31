'use strict';

angular.module('myApp.register', ['ngRoute', 'firebase'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'register/register.html',
            controller: 'RegisterCtrl'
        });
}])

    .controller('RegisterCtrl', ['$scope', '$location', '$firebaseAuth', function ($scope, $location, $firebaseAuth) {

        // Create a firebase database reference
        var firebaseObj = firebase.database().ref();

        $scope.user = {};
        $scope.signUp = function (e) {
            e.preventDefault();
            if (!$scope.regForm.$invalid) {

                var username = $scope.user.email;
                var password = $scope.user.password;

                if (username && password) {
                    firebase.auth().createUserWithEmailAndPassword(username, password)
                        .then(function () {
                            console.log($location.path());
                            $location.path('/welcome');
                            $scope.$apply();
                            console.log($location.path());
                            // User created successfully.
                            console.log('User created successfully');

                        }, function (error) {
                            // do things if failure
                            $scope.regError = true;
                            $scope.regErrorMessage = error.message;
                            console.log(error);
                        });

                }
            }
        };



}]);
