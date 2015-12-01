var myApp = angular.module('regApp', []);

myApp.controller('registrationController',['$scope','$http', function($scope, $http){

	console.log("Hello world from registrationController!")

	$http.get('/populate').success(function(response){

		if(response==undefined || response==null ||response[0]==null){
			alert("No supermarkets in database");
		}
		else{
			
			$scope.supermarkets=response;

			console.log($scope.supermarkets)
		}

	});





	$scope.registerDevice = function(){
		
		
		console.log($scope.regData);
		$http.post('/registration', $scope.regData).success(function(response){
			console.log(response);
			$scope.resData = response;
		});
	};


	$scope.registercounter = function(){
		console.log($scope.regData);
		$http.post('/registrationCounter', $scope.counterData).success(function(response){
			console.log(response);
			$scope.counData = response;
		});
	};

	$scope.registerWarehouse = function(){
		console.log($scope.warehouse);
		$http.post('/registrationWarehouse', $scope.warehouse).success(function(response){
			console.log(response);
			$scope.warehouseData = response;
		});
	};	



}]);

