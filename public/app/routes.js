var app = angular.module('appRoutes', ['ngRoute']);
app.config(function($routeProvider, $locationProvider){
        $routeProvider
        
            .when('/',{
                templateUrl: "app/views/pages/home.html"
            })
            .when('/shop', {
                templateUrl: "app/views/pages/shop.html",
                controller: "predCtrl",
                controllerAs: "predict"
            })
            .when('/prediction', {
                templateUrl: "app/views/pages/prediction.html"
            })

            .when('/about', {
                templateUrl: "app/views/pages/about.html"
            })

            .when('/register', {
                templateUrl: "/app/views/pages/users/register.html",
                controller: 'regCtrl',
                controllerAs: 'register'
            })

            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html'
            })

            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html'
            })

            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html'
            })

            .when('/debug', {
                templateUrl: 'app/views/pages/users/debug.html',
                controller: 'predCtrl',
                controllerAs: 'predict'
            })

            .otherwise({ redirectTo: '/' });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
    });