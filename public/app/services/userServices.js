// SERVICES FOR USER LOGIN
angular.module('userServices', [])
    .factory('User', function ($http) {
        userFactory = {};

        //debug

        userFactory.create = function (regData) {
            return $http.post('/userApi/users', regData);
        };

        userFactory.uploadImage = function (image) {
            return $http.post('/userApi/uploadImage', image, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        };

        userFactory.getListLocation = function (locData) {
            return $http.post('/userApi/getListLocation', locData);
        };

        return userFactory;
    });