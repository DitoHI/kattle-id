// CONTROLLER FOR THE USER
angular.module('userControllers', ['userServices'])
    .controller('regCtrl', function ($http, $location, $timeout, $scope, User) {
        var app = this;

        this.debugFunc = function (debugData) {

            // User.debug(app.debugData).then(function (data) {
            //     console.log(data.data.data);
            // });
            // app.debugData.userImg = $scope.userImg;
            app.debugData.userImg = $scope.userImg;

            console.log(app.debugData);
        };
        // $scope.param = {};

        this.regUser = function (regData) {
            app.loading = true;
            app.errorMsg = false;

            User.create(app.regData).then(function (data) {
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message + '....Redirecting';
                    $timeout(function () {
                        //redirect to home
                        $location.path('/');
                    }, 500);
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        };
    })

    .directive('match', function () {
        return {
            restrict: 'A',
            controller: function ($scope) {
                $scope.confirmed = false;
                $scope.doConfirm = function (values) {
                    values.forEach(function (ele) {
                        if ($scope.confirm === ele) {
                            $scope.confirmed = true;
                        } else {
                            $scope.confirmed = false;
                        }
                    });
                }
            },
            link: function (scope, element, attrs) {
                attrs.$observe('match', function () {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
                scope.$watch('confirm', function () {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
            }
        };
    })

    .directive("fileread", [function () {
        return {
            restrict: 'A',
            controller: function ($scope) {
                $scope.userImg = "kosong";
                $scope.setUserImg = function (values) {
                    $scope.userImg = values;
                }
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                            scope.setUserImg(scope.fileread);
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]);