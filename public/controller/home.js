'use strict';
app.controller('homeCtrl', function ($scope, $state,checkAuth,$http) {

    // if (!checkAuth) {
     //    $state.transitionTo('info')
      //   return;
    //} 
    $scope.Users = [];
    $scope.disableTrigger = false;
    $scope.hasGroup = false;
    $scope.noData = false;
    $scope.triggerFn = () => {
        $scope.disableTrigger = true;
        console.log("triggering function");

        var url = 'http://localhost:8090/listen/' + window.localStorage.getItem('username') + '/' + 12000;

        $http.get(url)
            .then((response) => {
                console.log("already triggered")
            }).catch((e) => console.log(e));


    };


    $scope.getUsers = () => {

        var url = 'http://localhost:8090/getAllGroups/' + window.localStorage.getItem('username');

        $http.get(url)
            .then((response) => {
                $scope.Users = response.data.data;
                console.log($scope.Users)
                if ($scope.Users.length > 0) {
                    $scope.hasGroup = true
                } else {
                    $scope.noData = true
                }
            }).catch((e) => console.log(e));

    }


    $scope.sendMessage = function () {
        var url = 'http://localhost:8090/sendMessage/' + window.localStorage.getItem('username');

        $http.get(url)
            .then((response) => {
                console.log('sending message to all')
            }).catch((e) => console.log(e));


    }


});