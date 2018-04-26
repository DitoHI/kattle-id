angular.module('dairyController', ['dairyServices'])
    .controller('predCtrl', function ($http, $scope, $rootScope, $route, Dairy) {
        var app = this;

        // dummy trial: get product
        $rootScope.dairyProducts = Dairy.getDairyProducts();

        // === execute if dataset is not added to ===
        this.setDairyData = function () {
            Dairy.insertData().then(function (data) {
                console.log(data.data.message);
            });
        };

        // === process the data inputed by user ===
        this.doMiningData = function () {
            Dairy.getData().then(function (data) {
                app.dairy = data.data.dairy;

                Dairy.processData(app.dairy).then(function (data) {
                    console.log(data.data.dairy);
                });
            });
        };
    });