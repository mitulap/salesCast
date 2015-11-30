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
		
		var prodInfo='productInfo:[{product_id: "PG1", stock_min:20,stock_current:100,stock_max:200},{product_id: "MR1", stock_min:20,stock_current:100,stock_max:200}]';
		$scope.regData.productInfo=JSON.parse(prodInfo);
		var shelfInfo='product_shelf:[{productType: "Biscuits", shelf:S111},{productType: "Cornflakes", shelf:S121},{productType: "Vegetables", shelf:S321}]'
		$scope.regData.product_shelf=JSON.parse(shelfInfo);
		var counterInfo='counter:[{counterId:6,counterName:H},{counterId:8,counterName:L}]';
		$scope.regData.counter=Json.parse(counterInfo);
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

