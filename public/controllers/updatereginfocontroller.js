var myApp = angular.module('updateApp', []);

myApp.controller('updateregistrationController',['$scope','$http', function($scope, $http){

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

	$http.get('/populateCounter').success(function(response){

		if(response==undefined || response==null ||response[0]==null){
			alert("No Counters in database");
		}
		else{
			
			$scope.counters=response;

			console.log($scope.counters);
		}

	});

	$http.get('/populateWarehouse').success(function(response){

		if(response==undefined || response==null ||response[0]==null){
			alert("No Counters in database");
		}
		else{
			
			$scope.warehouses=response;

			console.log($scope.warehouses);
		}

	});



	$scope.discover=function(){
	
	$http.post('/discoverSupermarket', $scope.discoverClient).success(function(response){
		

			$scope.superDetails=response[0];
			console.log($scope.superDetails);
			
	});
};

$scope.discoverCounter=function(){
	
	$http.post('/discoverCounter', $scope.counterData).success(function(response){
		

			$scope.counterData=response[0];
			console.log($scope.counterData);
			
	});
};

$scope.discoverWarehouse=function(){
	
	$http.post('/discoverWarehouse', $scope.warehouseData).success(function(response){
		

			$scope.warehouseData=response[0];
			console.log("warehousedataa from server")
			console.log($scope.warehouseData);
			
	});
};
	
	$scope.updateSupermarket = function(){
		console.log($scope.superDetails);

			$http.post('/updateRegInfo', $scope.superDetails).success(function(response){
				console.log(response);
				$scope.resData = response;
		});
	};

	$scope.updateCounter = function(){
		console.log("inside Update Counter");
		console.log($scope.counterData);

			$http.post('/updateCounterInfo', $scope.counterData).success(function(response){
				console.log(response);
				$scope.counData = response;
		});
	};


$scope.updateWarehouse = function(){
		console.log("inside Update Warehouse");
		console.log($scope.warehouseData);

			$http.post('/updateWarehouseInfo', $scope.warehouseData).success(function(response){
				console.log(response);
				$scope.whsData = response;
		});
	};

}]);



