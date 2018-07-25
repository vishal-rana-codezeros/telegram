'use strict';



app.controller('infoCtrl', function ($scope, $state, $http, defaultService){

	$scope.obj={}


	$scope.createRecord = function(bot){
		var url = 'http://localhost:8090/addDetails'
        $http.post(url, bot)
            .then((response) => {
                window.localStorage.setItem('username', bot.userName);
                defaultService.setAuth(true);
                $state.go('home');
            }).catch((e)=> console.log(e));
	}	









});