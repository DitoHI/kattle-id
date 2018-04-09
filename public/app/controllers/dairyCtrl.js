angular.module('dairyController', ['dairyServices'])
    .controller('predCtrl', function ($http, $scope, Dairy) {
        var app = this;

        // === execute if dataset is not added to ===
        // Dairy.insertData();

        // === process the data inputed by user ===
       // this.processData = function () {
        Dairy.getData().then(function (data) {
            app.dairy = data.data.dairy;

            Dairy.processData(app.dairy).then(function (data) {
               console.log(data.data.dairy);
            });
        });
        // };
    });