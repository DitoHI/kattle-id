// CONTROLLER FOR THE USER
angular
  .module("userControllers", ["userServices"])
  .controller("regCtrl", function($http, $location, $timeout, $scope, User) {
    let app = this;
    $scope.locData = undefined;
    $scope.paramsLocation = undefined;

    this.regUser = function(regData) {
      app.loading = true;
      app.errorMsg = false;

      app.regData.province = app.provinsiSelected.type;
      app.regData.city = app.kotaSelected.type;
      app.regData.district = app.kecamatanSelected.type;
      app.regData.userCategory = app.userCategory.type;

      console.log(app.regData);

      User.create(app.regData).then(function(data) {
        if (data.data.success) {
          app.loading = false;
          app.successMsg = data.data.message + "....Redirecting";
          $timeout(function() {
            //redirect to home
            $location.path("/");
          }, 500);
        } else {
          app.loading = false;
          app.errorMsg = data.data.message;
        }
      });
    };

    this.debugFunc = function(debugData) {
      let username = app.debugData.user;

      let file = $scope.myFile;
      let fd = new FormData();
      fd.append("file", file);
      fd.append("username", username);

      User.uploadImage(fd).then(function(data) {
        let message = data.data.message;

        if (data.data.success) {
          // if success
          console.log(
            `${message} and the file is located in ${data.data.file}`
          );
        } else {
          // if failed to upload
          console.log(message);
        }
      });
    };

    this.defineLocation = function(location, childId) {
      //debug
      let appLocation = this;

      app.data = {};
      app.data.locData = location;
      app.data.childId = childId;

      User.getListLocation(app.data).then(function(data) {
        app[`${location}Name`] = data.data.location;
        app[`${location}Selected`] = { type: app[`${location}Name`].id };
      });
    };
    app.provinceLoc = new app.defineLocation("provinsi", null);

    // Scope for User Category
    app.userCategoryOptions = [
      { name: "Pilih Kategori User", value: null },
      { name: "Pembeli/penjual", value: "Pembeli/penjual" },
      { name: "Peternak", value: "Peternak" }
    ];
    app.userCategory = { type: app.userCategoryOptions[0].value };
  })

  .directive("match", function() {
    return {
      restrict: "A",
      controller: function($scope) {
        $scope.confirmed = false;
        $scope.doConfirm = function(values) {
          values.forEach(function(ele) {
            if ($scope.confirm === ele) {
              $scope.confirmed = true;
            } else {
              $scope.confirmed = false;
            }
          });
        };
      },
      link: function(scope, element, attrs) {
        attrs.$observe("match", function() {
          scope.matches = JSON.parse(attrs.match);
          scope.doConfirm(scope.matches);
        });
        scope.$watch("confirm", function() {
          scope.matches = JSON.parse(attrs.match);
          scope.doConfirm(scope.matches);
        });
      }
    };
  })

  .directive("fileModel", [
    "$parse",
    function($parse) {
      return {
        restrict: "A",
        link: function(scope, element, attrs) {
          let model = $parse(attrs.fileModel);
          let modelSetter = model.assign;

          element.bind("change", function() {
            let file = element[0].files[0];
            scope.$apply(function() {
              modelSetter(scope, file);
            });
          });
        }
      };
    }
  ]);
