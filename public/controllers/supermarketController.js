var myApp = angular.module('superMarketApp', []);

myApp.controller('sueprMarketController',['$scope','$http', function($scope, $http){

	console.log("Hello world from sueprMarketController!")

	$scope.writeMarketDetail = function(){
		console.log($scope.marketWriteData);
		$http.put('/writeAttr', $scope.marketWriteData).success(function(response){
			console.log(response);
			$scope.resData = response;
		});
	};

	$scope.writeMarketDetail1 = function(){
		console.log($scope.marketWriteData);
		$http.put('/write', $scope.marketWriteData).success(function(response){
			console.log(response);
			$scope.resData = response;
		});
	};

}]);

