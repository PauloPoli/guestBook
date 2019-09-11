myApp.factory('AuthenticationService', function($http, $localStorage) {

var service = {};

service.Login = Login;

return service;

function Login( password, callback) {
    $http.post('http://192.168.10.253:10004/login' + "?password=" + password).then (function successCallback(response){
            // login successful if there's a token in the response
            console.log(response.data.token);
            if (response.data.token) {
                // store username and token in local storage to keep user logged in between page refreshes
                $localStorage.currentUser = { token: response.data.token };
                // add jwt token to auth header for all requests made by the $http service
                $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;

                // execute callback with true to indicate successful login
                callback(true);
            } else {
                // execute callback with false to indicate failed login
                alert("Wrong password. Try Again!");
                location.reload();
                console.log('Eroras')
                callback(false);
            }
            
        }, function errorCallback() {
          
          alert("Wrong password. Try Again!");
          location.reload();
          });
}

});

myApp.controller('LoginCtrl', function($scope, $window, AuthenticationService) {

  $scope.login = function(password) {

        AuthenticationService.Login(password, function (result) {
            if (result === true) {
              $window.location.href = '/';
            } else {
              alert("NEveikia");
              
            }
        });
    };
  });







