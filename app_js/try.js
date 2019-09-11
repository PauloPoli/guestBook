myApp.run( function($rootScope,$http, $localStorage) {

  // keep user logged in after page refresh
  if ($localStorage.currentUser) {
    console.log($localStorage.currentUser)
      $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
      $rootScope.showReview = false;
      $rootScope.logoutAdmin = true;
      $rootScope.showAdminReplyBtn = true;
      $rootScope.showAdminEditBtn = true;
      
  }
  else{
    $rootScope.showReview = true;
    $rootScope.showUserReply = true;
    $rootScope.showUserEdit = true;
  }
});



myApp.factory('AuthenticationServices', function($http, $localStorage, $window) {

  var services = {};
  
  services.Logoutas = Logoutas;
  services.AdminAnswer = AdminAnswer;
  
  return services;
  
  function Logoutas() {
      // remove user from local storage and clear http auth header
      delete $localStorage.administratorName;
      delete $localStorage.currentUser;
      $http.defaults.headers.common.Authorization = '';
      $window.location.href = '#!/admin';
  }

  function AdminAnswer(client, adminreply, admin_name) {
    $http.post('http://192.168.10.253:10004/reviews/adminanswer?admin_name=Admin ' + admin_name + '&content=' + adminreply + '&parent_id='+client.id).then (function successCallback(){
      alert('Irasas idetas');
      location.reload();
    })
  }

});


myApp.controller('customersCtrl', ['$scope', '$http','AuthenticationServices','$localStorage','$location','$anchorScroll', function($scope, $http, AuthenticationServices, $localStorage,$location, $anchorScroll) {

  
  $scope.logout = function() {
  
    AuthenticationServices.Logoutas(function (result) {
      console.log("aaaaa")
    });
  };



  $scope.adminReply = function(client, adminreply, admin_name) {
    console.log(admin_name)
    $localStorage.administratorName = admin_name
    AuthenticationServices.AdminAnswer(client, adminreply, admin_name, function(result){
      console.log("aaaaa")
    });
  }



  $scope.saveName = function(){
    if ($localStorage.administratorName) {
      $scope.admin_name = $localStorage.administratorName;
    }
    else{
      $scope.admin_name = 'George'
    }
  }
    $scope.saveName();

  //Buttons Settings
  $scope.submit = true;
  $scope.update = false;
  $scope.cancel = false;

  $scope.client = {
    first_name: $localStorage.cookieFName,
    last_name: $localStorage.cookieLName,
    email: $localStorage.cookieEmail
  }
// console.log(document.getElementById('display-firstname'));
 $scope.initValue =function() {
  var x = localStorage.length;
  var s = document.getElementById('display-firstname')
  if (x === 0) {
    s.value = "";
  }
  else{
    s.value = $localStorage.cookieFName}
  
  var s = document.getElementById('display-lastname');
  if (x === 0) {
     s.value = "";
  }
  else{
     s.value = $localStorage.cookieLName}
  var s = document.getElementById('display-email');
  if (x === 0) {
    s.value = "";
  }
  else{
    s.value = $localStorage.cookieEmail}
}

$scope.initValue();





  $scope.createUser = function() {
    console.log($scope.client)
    $localStorage.cookieFName = $scope.client.first_name
    $localStorage.cookieLName = $scope.client.last_name
    $localStorage.cookieEmail = $scope.client.email
    $http.post('http://192.168.10.253:10004/reviews', $scope.client).then (function successCallback() {
      alert("User has created Successfully")
      // $scope.client = null;
      location.reload();
      }, function errorCallback() {
      alert("Error. while created user Try Again!");
    });

    };

  $scope.currentPage = 0;
  

  $scope.numberOfPages=function(){
    return Math.ceil($scope.ilgis/12);             
  };

    $scope.DisplayData = function(offset) {
      $scope.offset = offset;
      $http.get('http://192.168.10.253:10004/reviews?offset='+offset +'&limit=12').then(function successCallback(response) {
      $scope.myData = response.data.reviews;

    });
  };

    $http.get('http://192.168.10.253:10004/reviews').then(function successCallback(response) {
      $scope.ilgis = response.data.reviews.length;
  });

  $scope.DisplayData();
    

  $scope.deleteUser = function(client) {
    $http({
      method: 'DELETE',
      url: 'http://192.168.10.253:10004/reviews/' + client.id
    }).then(function successCallback() {
      alert("User has deleted Successfully");
      location.reload();
    }, function errorCallback() {
      alert("Error. while deleting user Try Again!");
    });
  };
  $scope.updateUser = function() {
    console.log($scope.client.content)
    $http.put('http://192.168.10.253:10004/reviews/' + $scope.client.id, $scope.client).then(function successCallback() {
    alert("User has updated Successfully")
    $scope.update = false;//sukuria update buttona
    $scope.cancel = false;//sukuria cancel buttona
    $scope.client = null;
    $scope.IsDisabled = false;
    location.reload();
    }, function errorCallback() {
    alert("Į šį įrašą buvo atsakytą - negalima redaguoti!");
    });
  };

  $scope.SetScope = function(client) {
    $scope.client = client;
  }

  $scope.replyReview = function(user_fname, user_last, mail, comment, review_id) {
    $http.post('http://192.168.10.253:10004/reviews/answer' + '?first_name=' + user_fname + '&last_name=' + user_last +'&email='+ mail + '&content='+ comment + '&parent_id=' +review_id).then (function successCallback() {
    alert("Answer has created Successfully")
    location.reload();
    }, function errorCallback() {
    alert("Error. Try Again!");
    });
}
//Set $scope on Edit button click
  $scope.editUser = function(client) {
    $scope.client = client;
    // $localStorage.$reset();
    $scope.IsDisabled = true;
    $scope.submit = false;//panaikina submit buttona
    $scope.update = true;//sukuria update buttona
    $scope.cancel = true;//sukuria cancel buttona
    $scope.reply = false;
    alert('Veikia editas')
    $location.hash('scrollup')
    $anchorScroll()
  };

  $scope.toReply = function(item) {
    $scope.reply = true;//sukuria reply buttona
    $scope.cancel = true;
    $scope.update = false;
    $scope.submit = false;
    $scope.client = null;
    $scope.IsDisabled = false;
    $scope.item = item;
    alert('Veikia')
    $location.hash('scrollup')
    $anchorScroll()
  };

  $scope.cancelUpdate = function() {
    $scope.client = null;
    $scope.item = null;
    $scope.submit = true;
    $scope.update = false;
    $scope.cancel = false;
    $scope.reply = false;
  };

  $scope.rateFunction = function(rating, post_id) {
    $http.post('http://192.168.10.253:10004/reviews/' + post_id +'?rate=' +rating).then(function successCallback(){ 
      alert('You selected - ' + rating+' stars');
      location.reload();
      }, function errorCallback() {
      alert("Error. Try Again!");
      })
  };

  // $scope.klickasreply = function() {

  //   $scope.showing = !$scope.showing;
  // }
  // $scope.klickasedit = function() {

  //   $scope.editableform = !$scope.editableform;
  // }

  // console.dir($scope);
  // $scope.client.first_name = $localStorage.cookieFName;
  // $scope.CookieLastname = $localStorage.cookieLName;
  // $scope.CookieUserEmail = $localStorage.cookieEmail;

}]);



 myApp.directive('starRating',
	function() {
		return {
			restrict : 'A',
			template : '<ul class="rating">'
					 + '	<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
					 + '\u2605'
					 + '</li>'
					 + '</ul>',
			scope : {
				ratingValue : '=',
				max : '=',
				onRatingSelected : '&'
      },
      controller: "customersCtrl",
			link : function(scope, elem, attrs) {
				var updateStars = function() {
					scope.stars = [];
					for ( var i = 0; i < scope.max; i++) {
						scope.stars.push({
							filled : i < scope.ratingValue
						});
					}
				};
				
				scope.toggle = function(index) {
					scope.ratingValue = index + 1;
					scope.onRatingSelected({
						rating : index + 1
					});
				};
				
				scope.$watch('ratingValue',
					function(oldVal, newVal) {
						if (newVal) {
							updateStars();
						}
					}
				);
			}
		};
	}
);
