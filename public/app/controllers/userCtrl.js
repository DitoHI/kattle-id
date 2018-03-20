// CONTROLLER FOR THE USER
angular.module('userControllers', ['userServices'])
    .controller('regCtrl', function($http, $location, $timeout, User) {
        var app = this;

        this.regUser = function(regData) {
            app.loading =true;
            app.errorMsg = false;

            User.create(app.regData).then(function(data){
                if (data.data.success){
                    app.loading = false
                    app.successMsg = data.data.message + '....Redirecting';
                    $timeout(function(){
                        //redirect to home
                        $location.path('/');
                    }, 2000);
                } else{
                    app.loading = false
                    app.errorMsg = data.data.message;
                }
            });
        };
    });