'use strict';

angular.module('myApp.welcome', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/welcome', {
            templateUrl: 'welcome/welcome.html',
            controller: 'WelcomeCtrl'
        });
}])

    .controller('WelcomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', '$route', function ($scope, CommonProp, $firebaseArray, $firebaseObject, $location, $route) {

        $scope.username = CommonProp.getUser();

        if (!$scope.username) {
            $location.path('/home');
        }


        // Create a firebase database reference
        var firebaseRef = firebase.database().ref();
        var articlesArray = $firebaseArray(firebaseRef.child('Articles'));
        $scope.articles = articlesArray;


        $scope.editPost = function (id) {
            var article = articlesArray.$getRecord(id); // record with $id === "id" passed in or null
            console.log(article.title);
            console.log(article.post);
            $scope.postToUpdate = article;
            $('#editModal').modal(); // triggers the modal pop up
        }


        $scope.confirmDelete = function (id) {
            var article = articlesArray.$getRecord(id); // record with $id === "id" passed in or null
            $scope.postToDelete = article;
            $('#deleteModal').modal();
        }

        $scope.deletePost = function () {
            var id = $scope.postToDelete.$id;
            var article = articlesArray.$getRecord(id); // record with $id === "id" passed in or null

            firebase.database().ref().child('Articles/' + id).remove().then(function (ref) {
                $('#deleteModal').modal('hide');
                console.log("Post Deleted")
            }, function (error) {
                console.log("Error:", error);
            });

        }



        $scope.updatePost = function () {

            var id = $scope.postToUpdate.$id;
            var article = articlesArray.$getRecord(id); // record with $id === "id" passed in or null
            console.log(article.title);
            console.log(article.post);
            $scope.postToUpdate = article;

            var postData = {
                title: $scope.postToUpdate.title,
                post: $scope.postToUpdate.post,
                emailId: $scope.postToUpdate.emailId
            }

            // Get a key for a new Post.
            var newPostKey = firebase.database().ref().child('Articles').push().key;
            var updates = {};
            updates = postData;
            console.log(postData);
            console.log(updates);

            firebase.database().ref().child('Articles/' + id).update({
                title: $scope.postToUpdate.title,
                post: $scope.postToUpdate.post,
                emailId: $scope.postToUpdate.emailId
            }).then(function (ref) {
                $('#editModal').modal('hide');
                console.log("Post Updated");
                //$location.path('/home');
                //$location.path('/welcome');
                //$scope.$apply();
                //$route.reload();
                $scope.needToRefresh = true;

            }, function (error) {
                console.log("Error:", error);
            });

            // NOT WORKING - DOESN'T GET CALLED AFTER CLose of modal
            if ($scope.needToRefresh) {
                $route.reload();
            }

        }

        $scope.logout = function () {
            CommonProp.logoutUser();
        }


}]);


// ******** UPDATE NOT WORKING WITH EITHER OF THESE 2 METHODS **********
// I get the following listed errors every time:     

// EFFORT #1
// Reference.update failed: First argument  contains an invalid key (/Articles/-Kx4-MPVU0UYkBnrBPy0/) in property 'updates'.   
// Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"

/*var updates = {};
updates['/Articles/' + id + '/'] = postData;
//updates[article] = postData;

//firebase.database().ref().child('Articles/' + id + '/').update({
firebase.database().ref().update({
    updates
    //firebaseRef.child('Articles' + id).update(updates)({
}).then(function (ref) {
    $('#editModal').modal('hide');
}, function (error) {
    console.log("Error:", error);
});*/



// EFFORT #2 
// Reference.update failed: First argument  must be an object containing the children to replace.

/*
var newUpdatePostRef = firebase.database().ref().child("/Articles/" + id + '/').push();
var newUpdatePostKey = newUpdatePostRef.key;
var newUpdatedPost = {};
// Create the data we want to update
let postData2 = {
    title: $scope.postToUpdate.title,
    post: $scope.postToUpdate.post,
    emailId: $scope.postToUpdate.emailId
};
newUpdatedPost['/Articles/' + newUpdatePostKey] = postData2;
console.log(newUpdatedPost);
console.log('/Articles/' + newUpdatePostKey + '/' + postData2);
return firebase.database().ref().update('/Articles/' + newUpdatePostKey + '/' + postData2);
*/

//$location.path('/welcome');
//$scope.$apply();
