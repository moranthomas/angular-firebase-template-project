'use strict';

angular.module('myApp.addPost', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/addPost', {
            templateUrl: 'addPost/addPost.html',
            controller: 'AddPostCtrl'
        });
}])

    .controller('AddPostCtrl', ['$scope', '$firebase', 'CommonProp', '$location', function ($scope, $firebase, CommonProp, $location) {

        if (!CommonProp.getUser()) {
            $location.path('/home');
        }
        $scope.AddPost = function () {

            // Create a firebase database reference
            var firebaseObj = firebase.database().ref();

            var title = $scope.article.title;
            var post = $scope.article.post;

            firebase.database().ref().child('Articles').push({
                title: title,
                post: post,
                emailId: CommonProp.getUser()
            }).then(function (ref) {
                console.log(ref);
                $location.path('welcome/');
                $scope.$apply();
            }, function (error) {
                console.log("Error:", error);
            });


        };

        $scope.logout = function () {
            CommonProp.logoutUser();
        }


        /*
        // This is a more robust method of doing posts. In this case you post and get the key for a new post and then
        // simultaneously update the new post into the posts list and the user's post list.... 
        function writeNewPost(uid, username, picture, title, body) {
            // A post entry.
            var postData = {
                author: username,
                uid: uid,
                body: body,
                title: title,
                starCount: 0,
                authorPic: picture
            };

            // Get a key for a new Post.
            var newPostKey = firebase.database().ref().child('posts').push().key;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/posts/' + newPostKey] = postData;
            updates['/user-posts/' + uid + '/' + newPostKey] = postData;

            return firebase.database().ref().update(updates);
        };*/
}]);
