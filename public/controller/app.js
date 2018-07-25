'use strict';
var app = angular.module('telegram', [
     'ui.router'         
    ]);


app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider

        .state('info', {
            url: '/info',
            controller: 'infoCtrl',
            templateUrl: 'html/info.html'
        })

        .state('home', {
            url: '/home',
            controller: 'homeCtrl',
            templateUrl: 'html/home.html',
            resolve: {
                checkAuth: function (defaultService) {
                    return defaultService.getAuth();
                }
            }
      })



    $urlRouterProvider.otherwise('/info');

   // console.log('enter in appp');
})

