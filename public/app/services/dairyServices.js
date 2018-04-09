angular.module('dairyServices', [])
    .factory('Dairy', function ($http) {
        dairyFactory = {};

        dairyFactory.insertData = function() {
            return $http.post('/api/dairy');
        };

        dairyFactory.getData = function() {
            return $http.post('/api/dairiesList');
        };

        dairyFactory.processData = function (dairyData) {
            return $http.post('/api/dairiesMining', dairyData);
        };

        return dairyFactory;
    });