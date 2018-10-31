'use strict';

angular.module('myApp.home', ['ngRoute', 'firebase'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
}])

    .controller('HomeCtrl', ['$scope', '$location', 'CommonProp', '$firebaseAuth', function ($scope, $location, CommonProp, $firebaseAuth) {

        // Create a firebase database reference
        var firebaseObj = firebase.database().ref();

        $scope.user = {};
        $scope.SignIn = function (e) {
            e.preventDefault();
            var username = $scope.user.email;
            var password = $scope.user.password;


            firebase.auth().signInWithEmailAndPassword(username, password).then(function () {
                // Sign-in successful.
                console.log('sign in successful');
                CommonProp.setUser(username);
                console.log($location.path());
                $location.path('/welcome');
                $scope.$apply();
                console.log($location.path());
            }, function (error) {
                console.log(error);
            });

        }

}])


    .service('CommonProp', ['$location', function ($location) {
        var user = '';

        // var firebaseObj = firebase.database().ref();
        // var loginObj = $firebaseAuth(firebaseObj);

        return {
            getUser: function () {
                if (user == '') {
                    user = localStorage.getItem('userEmail');
                }
                return user;
            },
            setUser: function (value) {
                localStorage.setItem("userEmail", value);
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
                //firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)  
                user = value;
            },
            logoutUser: function () {
                // logout the user
                firebase.auth().signOut().then(function () {
                        // Sign-out successful.
                    },
                    function (error) {
                        // An error happened.
                    });

                //loginObj.$unauth();
                user = '';
                localStorage.removeItem('userEmail');
                console.log('done logout');
                $location.path('/home');
            }
        }

    }]);
