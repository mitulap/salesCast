var myApp = angular.module('regApp', []);

myApp.controller('registrationController',['$scope','$http', function($scope, $http){

	console.log("Hello world from registrationController!")

	$scope.registerDevice = function(){
		console.log($scope.regData);
		$http.post('/registration', $scope.regData).success(function(response){
			console.log(response);
			$scope.resData = response;
		});
	};

}]);

