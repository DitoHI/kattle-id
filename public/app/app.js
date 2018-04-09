var app = angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController',
            'authServices', 'dairyController', 'dairyServices'])

    .config(function($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptors');
    });