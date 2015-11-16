var myApp = angular.module('drApp', []);

myApp.controller('deregistrationController',['$scope','$http', function($scope, $http){

	console.log("Hello world from deregistrationController!")

	$scope.deregisterDevice = function(){
		console.log($scope.drData);
		$http.post('/deregistration', $scope.drData).success(function(response){
			console.log(response);
			$scope.resData = response;
		});
	};

}]);