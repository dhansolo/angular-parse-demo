/*
    app.js
    code for our demo application
 */

"use strict";

//this is the base URL for all task objects managed by your application
//requesting this with a GET will get all tasks objects
//sending a POST to this will insert a new task object
//sending a PUT to this URL + '/' + task.objectId will update an existing task
//sending a DELETE to this URL + '/' + task.objectId will delete an existing task
var tasksUrl = 'https://api.parse.com/1/classes/tasks';

angular.module('ToDoApp', [])
    .config(function($httpProvider) {
        //Parse required two extra headers sent with every HTTP request: X-Parse-Application-Id, X-Parse-REST-API-Key
        //the first needs to be set to your application's ID value
        //the second needs to be set to your application's REST API key
        //both of these are generated by Parse when you create your application via their web site
        //the following lines will add these as default headers so that they are sent with every
        //HTTP request we make in this application
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'tPIh4aDVhx4TFrIiGXc79qsPEaxbL1Dq6KMaJKGq';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'oxHTMSMLaNG764gK7KFXvfGGsbJ0OjI4pnp37wnt';
    })

    .controller('TasksController', function($scope, $http) {
        // get or refresh all taskobjects saved by my application on Parse.com
        $scope.refreshTasks = function() {
            $scope.loading = true;
            $http.get('https://api.parse.com/1/classes/tasks' + '?where={"done" : false}' )
                .success(function(responseData) {
                    //When return a list of data, Parse.com will always
                    //return an object with on property called 'results'
                    //which will contain an array of with all the ta objects
                    $scope.tasks = responseData.results;
                })
                .error(function(err) {
                    console.log(err);
                    //notify user in some way
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; // scope.refreshTasks()

        //call the refreshTask() to get the initial set of tasks on page load
        $scope.refreshTasks();

        $scope.newTask = { done: false };

        //function to add a new task to the list
        $scope.addTask = function(task) {
            //Post will add (insert) a new item to the class
            $http.post('https://api.parse.com/1/classes/tasks', task)
                .success(function(responseData) {
                    //Parse.com will return the new objectID in the response data
                    //copy that to the task we just inserted
                    task.objectID = responseData.objectId;
                    //add that task to our task list
                    $scope.tasks.push(task);
                    //reset the newTask to clear the form
                    $scope.newTask = {done: false};
                })
        };

        //function to update an existing task
        $scope.updateTask = function(task) {
            $scope.updating = true;
            $http.put('https://api.parse.com/1/classes/tasks/' + task.objectId, task)
                .success(function(responseData) {
                    //don't need to do anything because the local object is already up-to-date
                })
                .error(function(err) {
                    console.log(err);
                    //notify the user in some way
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };
    });


        /*
        $http.get('https://api.parse.com/1/classes/tasks')
        .success(function(data) {
            $scope.tasks = data.results;
        })
        .error(function(err) {
            //error occurred! might want to also tell the user
            console.log(err);
        });
        */




