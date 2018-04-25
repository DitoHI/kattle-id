// SERVICES FOR USER LOGIN
angular.module('userServices', [])
    .factory('User', function($http){
        userFactory = {};

        //debug
        userFactory.debug = function(debugData){
          return $http.post('/api/imgUpload', debugData);
        };

        userFactory.create = function(regData){
            return $http.post('/api/users', regData);
        };

        return userFactory;
    });