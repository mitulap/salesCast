var myApp = angular.module('myApp', []);

myApp.controller('bootstrapController',['$scope','$http', function($scope, $http){

	console.log("Hello world from bootstrapController!")

	$scope.bootstrapDevice = function(){
		console.log($scope.bsData);
		$http.post('/bsAdd', $scope.bsData).success(function(response){
			console.log(response);
			$scope.resData = response;
		});
	};

}]);

