var myApp = angular.module('updateApp', []);

myApp.controller('updateregistrationController',['$scope','$http', function($scope, $http){

	console.log("Hello world from registrationController!")

	$scope.updateregisterDevice = function(){
		console.log($scope.uregData);
		$http.post('/updateRegInfo', $scope.uregData).success(function(response){
			console.log(response);
			$scope.resData = response;
		});
	};

}]);

